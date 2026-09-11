# AI Film Studio V0.2

Production-oriented Web App for **Idea → Groq Prompt Director → Character Lock → Concept Art → Storyboard → AppleToken Reference Video**.

## Stack
- Next.js 15 / React 19 / TypeScript
- Groq OpenAI-compatible API + JSON Schema structured output
- AppleToken dynamic model catalog, image generation, quote, video generation/poll/content proxy
- Supabase optional persistence
- Vercel deployment target

## Setup
```bash
npm install
cp .env.example .env.local
npm run dev
```

`.env.local`:
```env
GROQ_API_KEY=...
GROQ_MODEL=openai/gpt-oss-20b
APPLETOKEN_API_KEY=...
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Supabase is optional for generation; run `supabase/schema.sql` if persistence is desired.

## V0.2 workflow
1. IDEA: Groq generates strict Production Bible and 6 shots.
2. CHARACTER: dynamically loads AppleToken image models and generates 4 identity explorations. Select one as MASTER CHARACTER.
3. CONCEPT: generate environment master.
4. STORYBOARD: inspect each shot's image/video prompt.
5. VIDEO: dynamically loads video model constraints, validates with `/v1/quote`, then submits Reference-guided generation with Master Character + Environment when available.
6. VIDEO RESULT: poll job status and stream completed MP4 through the authenticated server route.

## Security
`GROQ_API_KEY`, `APPLETOKEN_API_KEY`, and Supabase service role stay server-side. Never prefix them with `NEXT_PUBLIC_`.

## Verification
Run:
```bash
npm run typecheck
npm run build
npm run check
```
`check` validates required source/routes and ensures no secret is referenced from the client bundle source.
