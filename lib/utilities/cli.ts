import minimist from 'minimist'
import { IInput } from '../contracts/IInput'
import { IOutput } from '../contracts/IOutput'

export function parseCommandLine (argv: string[]): IInput {
  if (argv.length < 3) {
    throw new Error('Please specify a command to execute.')
  }

  const [command, ...args] = argv.slice(2)
  const { _, ...data } = minimist(args)
  return { command, data }
}

export function writeToConsole (output: IOutput): void {
  if (output.message) {
    console.log(output.message)
  }

  if (output.data) {
    console.log(JSON.stringify(output.data))
  }

  process.exit(output.status)
}
