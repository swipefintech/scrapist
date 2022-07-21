import { Cache } from 'cache-manager'
import Joi, { PartialSchemaMap } from 'joi'
import { IInput } from '../contracts/IInput'
import { IOutput } from '../contracts/IOutput'
import { Command } from '../core/Command'

export abstract class ScrapeCommand extends Command {
  cache?: Cache

  protected storeCookies = false
  protected storeCookiesByKey: string

  canStoreCookies (): boolean {
    return !!this.cache && this.storeCookies && !!this.storeCookiesByKey
  }

  getCookieStorageKey (input: IInput): string {
    return (input.data as Record<string, unknown>)[this.storeCookiesByKey] as string
  }

  abstract process(input: IInput): Promise<IOutput>;

  rules (): PartialSchemaMap {
    const rules = {}
    if (this.canStoreCookies()) {
      rules[this.storeCookiesByKey] = Joi.string().required()
    }

    return rules
  }
}
