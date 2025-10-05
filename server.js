import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import dotenv from 'dotenv'
dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ---- Dev server (Vite middleware + HMR) ----
async function createDevServer() {
  const app = express()
  const vite = await (
    await import('vite')
  ).createServer({
    server: { middlewareMode: true },
    appType: 'custom',
  })

  app.use(vite.middlewares)

  app.use(async (req, res, next) => {
    try {
      const templateHtml = fs.readFileSync(
        path.resolve(__dirname, 'index.html'),
        'utf-8',
      )

      const template = await vite.transformIndexHtml(
        req.originalUrl,
        templateHtml,
      )

      const { render } = await vite.ssrLoadModule('/src/entry-server.jsx')
      const appHtml = await render(req)
      const html = template.replace('<!--ssr-outlet-->', appHtml)

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      vite.ssrFixStacktrace(e)
      next(e)
    }
  })

  return app
}

// ---- Prod server (no Vite middleware, serves built assets) ----
async function createProdServer() {
  const app = express()

  // gzip responses
  app.use((await import('compression')).default())

  // serve client assets from dist/client (no index.html auto-serve)
  app.use(
    (await import('serve-static')).default(
      path.resolve(__dirname, 'dist/client'),
      { index: false },
    ),
  )

  // SSR handler using built server bundle and built HTML template
  app.use(async (req, res, next) => {
    try {
      const template = fs.readFileSync(
        path.resolve(__dirname, 'dist/client/index.html'),
        'utf-8',
      )

      const { render } = await import('./dist/server/entry-server.js')
      const appHtml = await render(req)
      const html = template.replace('<!--ssr-outlet-->', appHtml)

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      next(e)
    }
  })

  return app
}

// ---- Choose server by NODE_ENV ----
if (process.env.NODE_ENV === 'production') {
  const app = await createProdServer()
  app.listen(process.env.PORT, () => {
    console.log(`ssr production server running on http://localhost:${process.env.PORT}`)
  })
} else {
  const app = await createDevServer()
  app.listen(process.env.PORT, () => {
    console.log(`ssr dev server running on http://localhost:${process.env.PORT}`)
  })
}
