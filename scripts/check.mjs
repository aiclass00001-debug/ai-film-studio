import fs from 'node:fs'
const required=['app/page.tsx','app/api/prompt/route.ts','app/api/appletoken/models/route.ts','app/api/appletoken/image/route.ts','app/api/appletoken/quote/route.ts','app/api/appletoken/video/route.ts','app/api/appletoken/video-status/route.ts','app/api/appletoken/video-content/route.ts','lib/appletoken.ts']
for(const f of required){ if(!fs.existsSync(f)) throw new Error(`Missing ${f}`) }
const client=fs.readFileSync('app/page.tsx','utf8')
if(/process\.env\.(GROQ_API_KEY|APPLETOKEN_API_KEY|SUPABASE_SERVICE_ROLE_KEY)/.test(client)) throw new Error('Server secret referenced from client source')
if(!client.includes("'/api/appletoken/quote'")) throw new Error('Quote-before-generate flow missing')
if(!client.includes('input_references')) throw new Error('Reference-guided video flow missing')
if(!client.includes('SET MASTER')) throw new Error('Master character flow missing')
console.log('AI Film Studio V0.2 source checks: PASS')
