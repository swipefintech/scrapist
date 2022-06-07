import cheerio = require("cheerio");
import Joi, { PartialSchemaMap } from "joi";
import IInput from "../../../lib/contracts/IInput";
import IOutput, { Status } from "../../../lib/contracts/IOutput";
import ScrapeUsingHttpClientCommand, { HttpClient } from "../../../lib/core/commands/ScrapeUsingHttpClientCommand";
import StoreCookies from "../../../lib/decorators/StoreCookies";

@StoreCookies("session")
export default class GetHomePageLinkUsingHttpClient extends ScrapeUsingHttpClientCommand {

  async handle(input: IInput, client: HttpClient): Promise<IOutput> {
    const { body } = await this.sendRequest(client, {
      headers: {
        "referer": input.data["referer"],
      },
      uri: "https://example.com/",
    });
    const $ = cheerio.load(body);
    const href = $("a[href]").attr("href");
    return {
      data: { href },
      status: Status.SUCCESS,
    };
  }

  rules(): PartialSchemaMap {
    return {
      referer: Joi.string().uri().required(),
      ...super.rules(),
    };
  }
}
