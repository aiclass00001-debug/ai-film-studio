const BASE = 'https://appletoken.app/v1'
function key() { const value=process.env.APPLETOKEN_API_KEY; if(!value) throw new Error('APPLETOKEN_API_KEY is not configured'); return value }
export async function appleTokenRawFetch(path:string, init:RequestInit={}) {
  return fetch(`${BASE}${path}`, { ...init, cache:'no-store', headers:{ Authorization:`Bearer ${key()}`, ...(init.body?{'Content-Type':'application/json'}:{}), ...(init.headers||{}) } })
}
export async function appleTokenFetch(path:string, init:RequestInit={}) {
  const res=await appleTokenRawFetch(path,init); const contentType=res.headers.get('content-type')||''; const body=contentType.includes('application/json')?await res.json():await res.arrayBuffer()
  if(!res.ok){ const message=typeof body==='object'&&body&&'error' in body?JSON.stringify((body as any).error):`AppleToken ${res.status}`; throw new Error(message) }
  return body
}
