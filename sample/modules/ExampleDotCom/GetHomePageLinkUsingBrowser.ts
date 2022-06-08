import { Browser, Page } from 'puppeteer'
import IInput from '../../../lib/contracts/IInput'
import IOutput, { Status } from '../../../lib/contracts/IOutput'
import ScrapeUsingBrowserCommand from '../../../lib/commands/ScrapeUsingBrowserCommand'
import StoreCookies from '../../../lib/decorators/StoreCookies'

@StoreCookies('session')
export default class GetHomePageLinkUsingBrowser extends ScrapeUsingBrowserCommand {
  async handle (input: IInput, browser: Browser, page: Page): Promise<IOutput> {
    await page.goto('https://example.com/')
    const href = await page.evaluate(() => {
      return document.querySelector('a[href]')
        .getAttribute('href')
    })
    return {
      data: { href },
      status: Status.SUCCESS
    }
  }
}
