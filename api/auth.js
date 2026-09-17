export async function verifyToken(req) {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) throw new Error('No token')
  const token = auth.slice(7)
  const parts = token.split('.')
  if (parts.length !== 3) throw new Error('Invalid token')
  const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString())
  if (!payload.sub) throw new Error('No sub')
  return payload
}
