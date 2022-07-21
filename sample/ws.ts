import { caching } from 'cache-manager'
import store from 'cache-manager-fs-hash'
import { createServer } from 'http'
import path from 'path'
import { RawData, WebSocket, WebSocketServer } from 'ws'
import { Engine, Status, parseMessage } from '../lib'
import ExampleDotCom from './modules/ExampleDotCom'

const cache = caching({
  store,
  options: {
    path: path.join(__dirname, 'cache'),
    subdirs: true
  }
})

const engine = new Engine(cache)
engine.mount('ExampleDotCom', new ExampleDotCom())

const server = createServer()
const wss = new WebSocketServer({ server })

wss.on('connection', (ws: WebSocket) => {
  ws.on('message', async (data: RawData) => {
    let input
    try {
      input = parseMessage(data.toString())
      const output = await engine.handle(input)
      ws.send(JSON.stringify(output))
    } catch (e) {
      ws.send(JSON.stringify({
        status: Status.FAILURE,
        message: e.toString()
      }))
    }
  })
})

const port = parseInt(process.env.PORT || '3000')
server.listen(port, () => {
  console.log(`Sample websocket server listening on port ${port}`)
})
