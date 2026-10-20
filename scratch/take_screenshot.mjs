import { spawn } from 'child_process'
import { writeFileSync } from 'fs'
import path from 'path'

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const PORT = 9223
const USER_DATA = 'C:\\Users\\LENOVO\\AppData\\Local\\Temp\\edge_debug_profile'

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function main() {
  console.log('Starting Edge in headless mode with remote debugging on port', PORT)
  const proc = spawn(
    EDGE_PATH,
    [
      `--remote-debugging-port=${PORT}`,
      '--headless=new',
      `--user-data-dir=${USER_DATA}`,
      '--window-size=1280,720',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-background-networking',
      '--disable-features=Translate',
      'http://localhost:5173/',
    ],
    { stdio: 'ignore', detached: true }
  )

  proc.unref()

  let wsUrl = null
  for (let i = 0; i < 20; i++) {
    await sleep(500)
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`)
      const list = await res.json()
      if (list && list.length > 0 && list[0].webSocketDebuggerUrl) {
        wsUrl = list[0].webSocketDebuggerUrl
        break
      }
    } catch {}
  }

  if (!wsUrl) {
    console.error('Failed to get WebSocket debugger URL from Edge')
    process.exit(1)
  }

  console.log('Connecting to Edge via WebSocket:', wsUrl)
  const ws = new WebSocket(wsUrl)

  await new Promise((resolve, reject) => {
    ws.onopen = resolve
    ws.onerror = reject
  })

  let msgId = 1
  function send(method, params = {}) {
    return new Promise((resolve) => {
      const id = msgId++
      const handler = (evt) => {
        const data = JSON.parse(evt.data)
        if (data.id === id) {
          ws.removeEventListener('message', handler)
          resolve(data.result)
        }
      }
      ws.addEventListener('message', handler)
      ws.send(JSON.stringify({ id, method, params }))
    })
  }

  await send('Page.enable')
  console.log('Navigating to http://localhost:5173/ ...')
  await send('Page.navigate', { url: 'http://localhost:5173/' })

  // Wait for 3D world to render
  console.log('Waiting 6 seconds for 3D graphics to render...')
  await sleep(6000)

  console.log('Capturing screenshot...')
  const screenshotRes = await send('Page.captureScreenshot', { format: 'png' })
  const buffer = Buffer.from(screenshotRes.data, 'base64')

  const outPath = path.resolve('C:/Users/LENOVO/.gemini/antigravity/brain/e57d534b-eeb0-4907-83a5-db8ec6a28f78/high_ceiling_live.png')
  writeFileSync(outPath, buffer)
  console.log('Screenshot successfully saved to:', outPath)

  ws.close()
  try {
    process.kill(proc.pid)
  } catch {}
}

main().catch(console.error)
