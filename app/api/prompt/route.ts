import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const idea = body?.idea?.trim();

    if (!idea) {
      return NextResponse.json(
        { error: "Missing idea" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;
    const model = process.env.GROQ_MODEL || "openai/gpt-oss-20b";

    if (!apiKey) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const systemPrompt = `
You are an expert AI film director and visual development supervisor.

Convert the user's film idea into a structured production bible.

Return VALID JSON ONLY.

Required JSON structure:

{
  "project": {
    "title": "",
    "genre": "",
    "logline": "",
    "visualStyle": ""
  },
  "character": {
    "name": "",
    "age": "",
    "appearance": "",
    "costume": "",
    "personality": "",
    "characterPrompt": ""
  },
  "environment": {
    "location": "",
    "architecture": "",
    "lighting": "",
    "weather": "",
    "environmentPrompt": ""
  },
  "cinematography": {
    "lens": "",
    "cameraMovement": "",
    "lightingStyle": "",
    "colorPalette": ""
  },
  "storyboard": [
    {
      "shot": 1,
      "duration": 3,
      "description": "",
      "camera": "",
      "imagePrompt": "",
      "videoPrompt": ""
    }
  ]
}

Create exactly 6 storyboard shots.
Keep prompts cinematic, production-ready, and suitable for AI image/video generation.
`;

    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          temperature: 0.7,
          response_format: {
            type: "json_object",
          },
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: idea,
            },
          ],
        }),
      }
    );

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();

      return NextResponse.json(
        {
          error: "Groq API request failed",
          details: errorText,
        },
        { status: groqResponse.status }
      );
    }

    const data = await groqResponse.json();

    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "Groq returned empty response" },
        { status: 500 }
      );
    }

    let parsed;

    try {
      parsed = JSON.parse(content);
    } catch {
      return NextResponse.json(
        {
          error: "Groq response was not valid JSON",
          raw: content,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Prompt Director failed",
      },
      { status: 500 }
    );
  }
}
