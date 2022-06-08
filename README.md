# scrapist

Modular framework for building and scaling web scraping workloads over [CLI](https://github.com/swipefintech/scrapist/blob/master/sample/cli.ts), [HTTP](https://github.com/swipefintech/scrapist/blob/master/sample/web.ts) & [WebSockets](https://github.com/swipefintech/scrapist/blob/master/sample/ws.ts).

## Usage

First you need to implement your scraping jobs (commands) classes.

### Commands

You should extend either `ScrapeUsingBrowserCommand` class or `ScrapeUsingHttpClientCommand` to create your jobs as below.

```ts
import IInput from 'scrapist/contracts/IInput'
import IOutput, { Status } from 'scrapist/contracts/IOutput'
import ScrapeUsingHttpClientCommand, { HttpClient } from 'scrapist/commands/ScrapeUsingHttpClientCommand'

export default class YourCommand extends ScrapeUsingHttpClientCommand {

  async handle (input: IInput, client: HttpClient): Promise<IOutput> {
    const { body } = await this.sendRequest(client, {
      // request options
    })
    return {
      data: body,
      status: Status.SUCCESS
    }
  }
}
```

You can persist session data i.e., cookies between commands automatically by using the `@StoreCookies(<unique-key>)` decorator.
The `key` that you specify in the decorator is the key name in your input whose value has to be used as a unique identifier to load/save data.

```ts
import StoreCookies from 'scrapist/decorators/StoreCookies'

@StoreCookies("accountId")
export default class YourCommand extends ScrapeUsingHttpClientCommand {
  // command implementation
}
```

You can also validate data present in your input, powered by [Joi](https://joi.dev/) by overriding the `rules()` method in your command as below.

```ts
import Joi, { PartialSchemaMap } from 'joi'
import ScrapeUsingHttpClientCommand from 'scrapist/commands/ScrapeUsingHttpClientCommand'

export default class YourCommand extends ScrapeUsingHttpClientCommand {

  rules (): PartialSchemaMap {
    return {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      ...super.rules() // make sure to keep this
    }
  }
}
```

For bigger projects, it is advised to organise commands into modules like below:

```ts
import IEngine from 'scrapist/contracts/IEngine'
import IModule from 'scrapist/contracts/IModule'
import YourCommandNo1 from './YourCommandNo1'
import YourCommandNo2 from './YourCommandNo2'

export default class YourModule implements IModule {

  register (engine: IEngine): void {
    engine.register('YourCommandNo1', new YourCommandNo1())
    engine.register('YourCommandNo2', new YourCommandNo2())
    // and so on
  }
}
```

### Running

Now that you have defined your commands, you need to create an instance of `Engine` class, register your commands
(or mount modules) and handle the input.

```ts
import IInput from 'scrapist/contracts/IInput'
import IOutput from 'scrapist/contracts/IOutput'
import Engine from 'scrapist/core/Engine'
import YourCommand1 from './YourCommand1'
import YourCommand2 from './YourCommand2'
import YourModule from './YourModule'

const engine = new Engine()

// eithe register commands
engine.register('YourCommand1', new YourCommand1())
engine.register('YourCommand2', new YourCommand2())

// or mount the module
engine.mount('YourModule', new YourModule())

const input: IInput = {
  command: 'YourCommand1', // or 'YourModule/YourCommand1' is using modules,
  data: {
    username: 'name@example.com',
    password: 'super_secret',
  },
  externalId: 'Premium-User-123', // if using @StoreCookies(...) decorator
}
engine.handle(input)
  .then((output: IOutput) => {
    // deal with output
  })
```

If you are using the `@StoreCookies(<unique-key>)` decorator, you also need to provide a `Cache` implementation (from [cache-manager](https://www.npmjs.com/package/cache-manager)) when creating `Engine` object as below.

```ts
import path from 'path'
import { caching } from 'cache-manager'
import store from 'cache-manager-fs-hash'
import Engine from 'scrapist/core/Engine'

// create a file-system (or any other)
const cache = caching({
  store,
  options: {
    path: path.join(__dirname, 'cache'),
    subdirs: true
  }
})

const engine = new Engine(cache)
```

## Samples

This project also includes [samples](https://github.com/swipefintech/scrapist/tree/master/sample) on implementing and
using **scrapist** via [CLI](https://github.com/swipefintech/scrapist/blob/master/sample/cli.ts), [HTTP](https://github.com/swipefintech/scrapist/blob/master/sample/web.ts) (using [Express](https://expressjs.com/)) and [WebSockets](https://github.com/swipefintech/scrapist/blob/master/sample/ws.ts) (using [ws](https://www.npmjs.com/package/ws)) frontends.

Clone this repository and follow below instructions to test the sample apps on your local workstation.

### CLI

To run the command-line sample, run below command(s) inside cloned folder:

```shell
npm run start:cli -- \
  ExampleDotCom/GetHomePageLinkUsingBrowser \
  --session=Premium-User-123

npm run start:cli -- \
  ExampleDotCom/GetHomePageLinkUsingHttpClient \
  --referer=https://example.com/
```

### HTTP or Web

To run the web (API) sample, run below command(s) inside cloned folder:

```shell
# start development server
npm run start:web

# run test commands (in another terminal)
curl http://localhost:3000/ExampleDotCom/GetHomePageLinkUsingBrowser \
  -H "Content-Type: application/json" \
  -d '{"session": "Premium-User-123"}'

curl http://localhost:3000/ExampleDotCom/GetHomePageLinkUsingHttpClient \
  -H "Content-Type: application/json" \
  -d '{"referer":"https://example.com/"}'
```

### WebSockets

To run the web-socket sample, run below command(s) inside cloned folder:

```shell
# start development server
npm run start:ws

# connect to web-socket server
npx wscat -c ws://localhost:3000/

# run test commands
{"command": "ExampleDotCom/GetHomePageLinkUsingBrowser", "session": "Premium-User-123"}

{"command": "ExampleDotCom/GetHomePageLinkUsingHttpClient", "referer": "https://example.com/"}
```

## License

Please see [LICENSE](LICENSE) file.
