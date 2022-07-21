import cheerio from 'cheerio'
import Joi, { PartialSchemaMap } from 'joi'
import { IInput, IOutput, Status, ScrapeUsingHttpClientCommand, HttpClient } from '../../../lib'

export default class GetHomePageLinkUsingHttpClient extends ScrapeUsingHttpClientCommand {
  async handle (input: IInput, client: HttpClient): Promise<IOutput> {
    const { body } = await this.sendRequest(client, {
      headers: {
        referer: input.data.referer
      },
      uri: 'https://example.com/'
    })
    const $ = cheerio.load(body as string)
    const href = $('a[href]').attr('href')
    return {
      data: { href },
      status: Status.SUCCESS
    }
  }

  rules (): PartialSchemaMap {
    return {
      referer: Joi.string().uri().required(),
      ...super.rules()
    }
  }
}
