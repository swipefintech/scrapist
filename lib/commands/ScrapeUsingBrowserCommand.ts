import puppeteer, {
  Browser,
  BrowserConnectOptions,
  BrowserLaunchArgumentOptions,
  LaunchOptions,
  Page
} from 'puppeteer'
import IInput from '../contracts/IInput'
import IOutput from '../contracts/IOutput'
import ScrapeCommand from './ScrapeCommand'

export type BrowserOptions = LaunchOptions & BrowserLaunchArgumentOptions & BrowserConnectOptions;

export default abstract class ScrapeUsingBrowserCommand extends ScrapeCommand {
  get browserOptions (): BrowserOptions {
    return {}
  }

  async createBrowser (): Promise<Browser> {
    return puppeteer.launch(this.browserOptions)
  }

  async createPage (browser: Browser): Promise<Page> {
    return browser.newPage()
  }

  abstract handle(input: IInput, browser: Browser, page: Page): Promise<IOutput>;

  async loadCookies (page: Page, key: string): Promise<void> {
    const serialized = await this.cache.get<string>(key)
    if (serialized) {
      const cookies = JSON.parse(serialized)
      await page.setCookie(...cookies)
    }
  }

  async process (input: IInput): Promise<IOutput> {
    const browser = await this.createBrowser()
    const page = await this.createPage(browser)
    if (this.canStoreCookies()) {
      await this.loadCookies(page, this.getCookieStorageKey(input))
    }

    try {
      return await this.handle(input, browser, page)
    } finally {
      if (this.canStoreCookies()) {
        await this.saveCookies(page, this.getCookieStorageKey(input))
      }

      await browser.close()
    }
  }

  async saveCookies (page: Page, key: string): Promise<void> {
    const cookies = await page.cookies()
    const serialized = JSON.stringify(cookies)
    await this.cache?.set(key, serialized)
  }
}
