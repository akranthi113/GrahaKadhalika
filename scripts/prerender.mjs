import { createServer } from 'node:http'
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { extname, join, resolve, sep } from 'node:path'
import puppeteer from 'puppeteer-core'

const DIST = resolve('dist')
const ROUTES = [
  '/',
  '/about',
  '/mission',
  '/kundli',
  '/charts',
  '/contact',
  '/privacy',
  '/terms',
  '/accessibility',
  '/brand',
]

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  `${process.env.LOCALAPPDATA || ''}/Google/Chrome/Application/chrome.exe`,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
].filter(Boolean)

const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.wasm': 'application/wasm',
  '.se1': 'application/octet-stream',
  '.zip': 'application/zip',
  '.woff2': 'font/woff2',
}

function startServer() {
  return new Promise((resolveServer) => {
    const server = createServer((req, res) => {
      let pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
      if (pathname.endsWith('/')) pathname += 'index.html'
      let file = join(DIST, pathname.replace(/^\//, '').split('/').join(sep))
      if (!existsSync(file) || statSync(file).isDirectory()) {
        file = join(DIST, 'index.html')
      }
      if (!existsSync(file)) {
        res.statusCode = 404
        res.end('Not found')
        return
      }
      res.setHeader('Content-Type', MIME[extname(file).toLowerCase()] || 'application/octet-stream')
      res.end(readFileSync(file))
    })
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address()
      resolveServer({ server, baseUrl: `http://127.0.0.1:${port}` })
    })
  })
}

async function main() {
  const chromePath = CHROME_CANDIDATES.find((p) => p && existsSync(p))
  if (!chromePath) {
    console.error('Prerender aborted: no Chrome/Edge found. Set CHROME_PATH to a browser executable.')
    process.exit(1)
  }

  const { server, baseUrl } = await startServer()
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
  })

  try {
    for (const route of ROUTES) {
      const page = await browser.newPage()
      await page.setRequestInterception(true)
      page.on('request', (req) => {
        const url = new URL(req.url())
        if (url.hostname !== '127.0.0.1' && url.hostname !== 'localhost') {
          req.abort()
        } else {
          req.continue()
        }
      })

      try {
        await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle0', timeout: 30000 })
      } catch {
        await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle2', timeout: 30000 })
      }
      await new Promise((r) => setTimeout(r, 750))

      const html = await page.content()
      const outFile = route === '/' ? join(DIST, 'index.html') : join(DIST, route, 'index.html')
      mkdirSync(join(outFile, '..'), { recursive: true })
      writeFileSync(outFile, html)
      const textLen = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().length
      console.log(`prerendered ${route} -> ${outFile} (${textLen} chars of text)`)
      await page.close()
    }
  } finally {
    await browser.close()
    server.close()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
