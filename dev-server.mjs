import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, join, normalize, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('./out/', import.meta.url))
const host = process.env.HOST || '127.0.0.1'
const port = Number(process.env.PORT || 8080)

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
}

function send(response, statusCode, body, type = 'text/plain; charset=utf-8') {
  response.statusCode = statusCode
  response.setHeader('Content-Type', type)
  response.end(body)
}

function safePath(pathname) {
  const candidate = normalize(join(root, decodeURIComponent(pathname).replace(/^\/+/, '')))
  const rel = relative(root, candidate)
  if (rel.startsWith('..') || rel === '..') return null
  return candidate
}

async function resolveFile(pathname) {
  let target = safePath(pathname === '/' ? '/index.html' : pathname)
  if (!target) return null
  try {
    const s = await stat(target)
    if (s.isDirectory()) target = join(target, 'index.html')
  } catch {
    if (!extname(target)) target = join(target, 'index.html')
  }
  try {
    const s = await stat(target)
    return s.isFile() ? target : null
  } catch {
    return null
  }
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url || '/', `http://${request.headers.host || `${host}:${port}`}`)
  if (url.pathname === '/api/runtime') {
    send(response, 200, JSON.stringify({ ok: true, deployment: 'local-static', paymentProvider: 'polar' }), 'application/json; charset=utf-8')
    return
  }
  if (url.pathname.startsWith('/api/')) {
    send(response, 501, JSON.stringify({ ok: false, error: 'Use wrangler dev or the deployed Worker for API routes.' }), 'application/json; charset=utf-8')
    return
  }
  const file = await resolveFile(url.pathname)
  if (!file) {
    send(response, 404, 'Not found')
    return
  }
  response.statusCode = 200
  response.setHeader('Content-Type', contentTypes[extname(file)] || 'application/octet-stream')
  createReadStream(file).pipe(response)
})

server.listen(port, host, () => {
  console.log(`CertCore dev server running at http://${host}:${port}/`)
})
