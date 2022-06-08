import { caching } from 'cache-manager'
import store from 'cache-manager-fs-hash'
import path from 'path'
import { Status } from '../lib/contracts/IOutput'
import Engine from '../lib/core/Engine'
import { parseCommandLine, writeToConsole } from '../lib/utilities/cli'
import ExampleDotCom from './modules/ExampleDotCom'

const cache = caching({
  store,
  options: {
    path: path.join(__dirname, 'cache'),
    subdirs: true
  }
})

const engine = new Engine(cache)
engine.mount('ExampleDotCom', new ExampleDotCom());

(async function () {
  try {
    const input = parseCommandLine(process.argv)
    const output = await engine.handle(input)
    writeToConsole(output)
  } catch (e) {
    writeToConsole({
      status: Status.FAILURE,
      message: e.toString()
    })
  }
})()
