import { caching } from 'cache-manager'
import store from 'cache-manager-fs-hash'
import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import { Status } from '../lib/contracts/IOutput'
import Engine from '../lib/core/Engine'
import { parseRequest, writeToResponse } from '../lib/utilities/http'
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

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(async (req, res, next) => {
  try {
    const input = parseRequest(req)
    const output = await engine.handle(input)
    writeToResponse(output, res)
  } catch (e) {
    writeToResponse({
      status: Status.FAILURE,
      message: e.toString()
    }, res)
  }

  next()
})

const port = parseInt(process.env.PORT || '3000')
app.listen(port, () => {
  console.log(`Sample web server listening on port ${port}`)
})
