import request, { CookieJar, Request, RequestAPI, CoreOptions, RequiredUriUrl, Response } from 'request'
import { MemoryCookieStore } from 'tough-cookie'
import IInput from '../contracts/IInput'
import IOutput from '../contracts/IOutput'
import ScrapeCommand from './ScrapeCommand'

export type HttpClient = RequestAPI<Request, CoreOptions, RequiredUriUrl>;

export type HttpResponse = {
  response: Response;
  body: unknown;
};

export default abstract class ScrapeUsingHttpClientCommand extends ScrapeCommand {
  createClient (jar: CookieJar | boolean): HttpClient {
    return request.defaults({ jar })
  }

  abstract handle(input: IInput, client: HttpClient): Promise<IOutput>;

  async loadCookies (store: MemoryCookieStore, key: string): Promise<CookieJar> {
    const serialized = await this.cache.get<string>(key)
    if (serialized) {
      const cookies = JSON.parse(serialized)
      cookies.forEach(x => store.putCookie(x))
    }

    return request.jar(store)
  }

  async process (input: IInput): Promise<IOutput> {
    let jar: boolean | CookieJar = false
    let store: MemoryCookieStore = null
    if (this.canStoreCookies()) {
      jar = await this.loadCookies(
        store = new MemoryCookieStore(),
        this.getCookieStorageKey(input)
      )
    }

    const client = this.createClient(jar)
    try {
      return await this.handle(input, client)
    } finally {
      if (this.canStoreCookies()) {
        await this.saveCookies(store, this.getCookieStorageKey(input))
      }
    }
  }

  get requestOptions (): CoreOptions {
    return {}
  }

  async sendRequest (client: HttpClient, options: RequiredUriUrl & CoreOptions): Promise<HttpResponse> {
    const opts = { ...this.requestOptions, ...options }
    return new Promise<HttpResponse>((resolve, reject) => {
      client(opts, function (error, response, body) {
        if (error) {
          reject(error)
        } else {
          resolve({ response, body })
        }
      })
    })
  }

  async saveCookies (store: MemoryCookieStore, key: string): Promise<void> {
    const cookies = await new Promise((resolve, reject) => {
      store.getAllCookies((err, cookies) => {
        if (err) {
          reject(err)
        } else {
          resolve(cookies)
        }
      })
    })
    const serialized = JSON.stringify(cookies)
    await this.cache?.set(key, serialized)
  }
}
