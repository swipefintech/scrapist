import { IncomingMessage, ServerResponse } from 'http'
import { IInput } from '../contracts/IInput'
import { IOutput, Status } from '../contracts/IOutput'

export function parseRequest (req: IncomingMessage & { body: Record<string, unknown> }): IInput {
  const data = req.body || {}
  return { command: req.url.slice(1), data }
}

export function writeToResponse (output: IOutput, res: ServerResponse): void {
  switch (output.status) {
    case Status.SUCCESS:
      res.statusCode = 200
      break
    case Status.FAILURE:
      res.statusCode = 500
      break
    case Status.INVALID:
      res.statusCode = 422
      break
    default:
      res.statusCode = 400
      break
  }

  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(output))
}
