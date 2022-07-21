export function StoreCookies (key: string) {
  // eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
  return function <Base extends { new (...args: any[]): {} }>(base: Base) {
    return class extends base {
      storeCookies = true
      storeCookiesByKey = key
    }
  }
}
