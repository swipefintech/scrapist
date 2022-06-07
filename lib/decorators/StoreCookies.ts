export default function StoreCookies(key: string) {
  return function <Base extends { new (...args: any[]): {} }>(base: Base) {
    return class extends base {
      storeCookies = true;
      storeCookiesByKey = key;
    };
  }
}
