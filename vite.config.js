import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// High-performance video streaming middleware with HTTP 206 Partial Content range requests
function videoStreamPlugin() {
  return {
    name: 'video-streamer',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const urlPath = req.url ? req.url.split('?')[0] : ''
        if (urlPath.match(/\.(mp4|webm|ogg|mov)$/i)) {
          let filePath = path.join(__dirname, 'public', decodeURIComponent(urlPath))
          if (!fs.existsSync(filePath)) {
            filePath = path.join(__dirname, decodeURIComponent(urlPath))
          }

          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const stat = fs.statSync(filePath)
            const fileSize = stat.size
            const range = req.headers.range

            if (range) {
              const parts = range.replace(/bytes=/, '').split('-')
              const start = parseInt(parts[0], 10)
              const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
              const chunkSize = end - start + 1
              const fileStream = fs.createReadStream(filePath, { start, end })

              res.writeHead(206, {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunkSize,
                'Content-Type': 'video/mp4',
                'Cache-Control': 'public, max-age=31536000, immutable',
                'Access-Control-Allow-Origin': '*',
              })
              fileStream.pipe(res)
              return
            } else {
              res.writeHead(200, {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4',
                'Accept-Ranges': 'bytes',
                'Cache-Control': 'public, max-age=31536000, immutable',
                'Access-Control-Allow-Origin': '*',
              })
              fs.createReadStream(filePath).pipe(res)
              return
            }
          }
        }
        next()
      })
    }
  }
}

export default defineConfig({
  plugins: [react(), videoStreamPlugin()],
  server: {
    host: true,
    port: 5173,
    watch: {
      ignored: ['**/dist/**', '**/node_modules/**']
    },
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
