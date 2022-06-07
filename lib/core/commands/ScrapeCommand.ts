import { Cache } from "cache-manager";
import Joi, { PartialSchemaMap } from "joi";
import IInput from "../../contracts/IInput";
import IOutput from "../../contracts/IOutput";
import Command from "../Command";

export default abstract class ScrapeCommand extends Command {

  cache?: Cache;

  protected storeCookies: boolean = false;
  protected storeCookiesByKey: string;

  canStoreCookies(): boolean {
    return !!this.cache && this.storeCookies && !!this.storeCookiesByKey;
  }

  abstract process(input: IInput): Promise<IOutput>;

  rules(): PartialSchemaMap {
    const rules = {};
    if (this.canStoreCookies()) {
      rules[this.storeCookiesByKey] = Joi.string().required();
    }

    return rules;
  }
}
