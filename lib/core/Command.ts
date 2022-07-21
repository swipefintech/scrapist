import Joi, { PartialSchemaMap } from 'joi'
import { ICommand } from '../contracts/ICommand'
import { IInput } from '../contracts/IInput'
import { IOutput } from '../contracts/IOutput'

export abstract class Command implements ICommand {
  abstract process(input: IInput): Promise<IOutput>;

  validate (input: IInput): string | null {
    const { error } = Joi.object(this.rules())
      .validate(input.data, { allowUnknown: true })
    return error?.message ?? null
  }

  rules (): PartialSchemaMap {
    return {}
  }
}
