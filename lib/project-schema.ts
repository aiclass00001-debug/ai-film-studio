import { z } from 'zod'

export const ProjectBibleSchema = z.object({
  project: z.object({
    title: z.string(),
    logline: z.string(),
    genre: z.string(),
    visualStyle: z.string(),
    aspectRatio: z.string(),
  }),
  character: z.object({
    name: z.string(),
    role: z.string(),
    appearance: z.string(),
    costume: z.string(),
    personality: z.string(),
    characterPrompt: z.string(),
  }),
  environment: z.object({
    location: z.string(),
    architecture: z.string(),
    lighting: z.string(),
    weather: z.string(),
    environmentPrompt: z.string(),
  }),
  cinematography: z.object({
    lenses: z.array(z.string()),
    cameraLanguage: z.string(),
    lightingLanguage: z.string(),
    colorPalette: z.array(z.string()),
  }),
  shots: z.array(z.object({
    id: z.string(),
    title: z.string(),
    duration: z.number(),
    framing: z.string(),
    lens: z.string(),
    cameraMotion: z.string(),
    action: z.string(),
    imagePrompt: z.string(),
    videoPrompt: z.string(),
  })).min(4).max(10),
})
