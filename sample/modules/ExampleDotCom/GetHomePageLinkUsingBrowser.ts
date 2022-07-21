import { Browser, Page } from 'puppeteer'
import { IInput, IOutput, Status, ScrapeUsingBrowserCommand, StoreCookies } from '../../../lib/'

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
