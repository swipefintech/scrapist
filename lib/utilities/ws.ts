import { IInput } from '../contracts/IInput'

export function parseMessage (message: string): IInput {
  const { command, ...data } = JSON.parse(message)
  if (!command) {
    throw new Error("Missing 'command' parameter in payload.")
  }

  return { command, data }
}
