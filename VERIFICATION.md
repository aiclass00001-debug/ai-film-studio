# AI Film Studio V0.2 — Verification Report

Date: 2026-09-10

## Passed in this environment
- Source contract check: PASS
- Required Next.js routes present: PASS
- Client-side secret reference scan: PASS
- Quote-before-generate flow present: PASS
- Master Character flow present: PASS
- Reference-guided `input_references` flow present: PASS
- TypeScript/TSX parser/transpile syntax check across app/lib: PASS (13 files)
- AppleToken API field contract manually cross-checked against API Documentation v1.3: PASS
  - GET /v1/models
  - POST /v1/quote
  - POST /v1/images/generations
  - POST /v1/videos/generations
  - GET /v1/videos/{id}
  - GET /v1/videos/{id}/content
  - input_references items {type,url}
  - quote_id confirmation flow

## Environment limitation
The sandbox cannot resolve external DNS, so npm registry, AppleToken and Groq cannot be reached from the execution container. Therefore `npm install`, authenticated provider calls, and `next build` cannot be executed here. `npm install` was attempted twice and timed out; direct DNS checks also failed.

Run on a normal networked machine before deployment:
```bash
npm install
npm run typecheck
npm run check
npm run build
```

## Runtime prerequisites
- GROQ_API_KEY
- APPLETOKEN_API_KEY
- optional Supabase variables
