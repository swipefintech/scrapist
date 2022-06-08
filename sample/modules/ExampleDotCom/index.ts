import IEngine from '../../../lib/contracts/IEngine'
import IModule from '../../../lib/contracts/IModule'
import GetHomePageLinkUsingBrowser from './GetHomePageLinkUsingBrowser'
import GetHomePageLinkUsingHttpClient from './GetHomePageLinkUsingHttpClient'

export default class ExampleDotCom implements IModule {
  register (engine: IEngine): void {
    engine.register('GetHomePageLinkUsingBrowser', new GetHomePageLinkUsingBrowser())
    engine.register('GetHomePageLinkUsingHttpClient', new GetHomePageLinkUsingHttpClient())
  }
}
