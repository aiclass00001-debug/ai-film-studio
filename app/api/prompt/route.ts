import OpenAI from 'openai'
import { ProjectBibleSchema } from '@/lib/project-schema'
import { getSupabaseAdmin } from '@/lib/supabase-server'

export const runtime = 'nodejs'

const directorSystem = `You are an expert AI film director, concept artist, cinematographer and prompt engineer.
Turn a rough film idea into a production-ready project bible.
Prioritize identity continuity, cinematic blocking, production design and reference-friendly prompts.
Avoid copyrighted character imitation and do not mention living artists.
Prompts for image/video generation must be concise but production-grade: subject identity, wardrobe, environment, lighting, camera, motion, continuity.
Return only data matching the required schema.`

export async function POST(req: Request) {
  try {
    const { idea } = await req.json()
    if (!idea || typeof idea !== 'string') {
      return Response.json({ error: 'idea is required' }, { status: 400 })
    }

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) return Response.json({ error: 'GROQ_API_KEY is not configured' }, { status: 500 })

    const client = new OpenAI({ apiKey, baseURL: 'https://api.groq.com/openai/v1' })
    const jsonSchema = zodToJsonSchemaForGroq()

    const completion = await client.chat.completions.create({
      model: process.env.GROQ_MODEL || 'openai/gpt-oss-20b',
      temperature: 0.35,
      messages: [
        { role: 'system', content: directorSystem },
        { role: 'user', content: `Develop this film idea:\n${idea}\nCreate 6 storyboard shots by default.` },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'project_bible',
          strict: true,
          schema: jsonSchema,
        },
      },
    })

    const raw = completion.choices[0]?.message?.content
    if (!raw) throw new Error('Groq returned an empty response')
    const bible = ProjectBibleSchema.parse(JSON.parse(raw))

    const supabase = getSupabaseAdmin()
    if (supabase) {
      await supabase.from('projects').insert({
        title: bible.project.title,
        idea,
        bible,
      })
    }

    return Response.json({ bible })
  } catch (error: any) {
    return Response.json({ error: error?.message || 'Prompt Director failed' }, { status: 500 })
  }
}

function zodToJsonSchemaForGroq() {
  // Explicit JSON Schema keeps V0.1 independent from helper-library version changes.
  const string = { type: 'string' }
  return {
    type: 'object', additionalProperties: false,
    properties: {
      project: { type: 'object', additionalProperties: false, properties: {
        title: string, logline: string, genre: string, visualStyle: string, aspectRatio: string,
      }, required: ['title','logline','genre','visualStyle','aspectRatio'] },
      character: { type: 'object', additionalProperties: false, properties: {
        name: string, role: string, appearance: string, costume: string, personality: string, characterPrompt: string,
      }, required: ['name','role','appearance','costume','personality','characterPrompt'] },
      environment: { type: 'object', additionalProperties: false, properties: {
        location: string, architecture: string, lighting: string, weather: string, environmentPrompt: string,
      }, required: ['location','architecture','lighting','weather','environmentPrompt'] },
      cinematography: { type: 'object', additionalProperties: false, properties: {
        lenses: { type: 'array', items: string }, cameraLanguage: string, lightingLanguage: string,
        colorPalette: { type: 'array', items: string },
      }, required: ['lenses','cameraLanguage','lightingLanguage','colorPalette'] },
      shots: { type: 'array', minItems: 4, maxItems: 10, items: { type: 'object', additionalProperties: false, properties: {
        id: string, title: string, duration: { type: 'number' }, framing: string, lens: string,
        cameraMotion: string, action: string, imagePrompt: string, videoPrompt: string,
      }, required: ['id','title','duration','framing','lens','cameraMotion','action','imagePrompt','videoPrompt'] } },
    },
    required: ['project','character','environment','cinematography','shots'],
  }
}
