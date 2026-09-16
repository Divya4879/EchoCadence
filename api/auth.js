export async function verifyToken(req) {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) throw new Error('No token')
  const token = auth.slice(7)
  const parts = token.split('.')
  if (parts.length < 2) throw new Error('Invalid token format')
  const padded = parts[1].replace(/-/g, '+').replace(/_/g, '/')
  const decoded = JSON.parse(Buffer.from(padded, 'base64').toString('utf8'))
  if (!decoded.sub) throw new Error('No sub in token')
  return decoded
}
