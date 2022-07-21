import { IEngine, IModule } from '../../../lib'
import GetHomePageLinkUsingBrowser from './GetHomePageLinkUsingBrowser'
import GetHomePageLinkUsingHttpClient from './GetHomePageLinkUsingHttpClient'

export default class ExampleDotCom implements IModule {
  register (engine: IEngine): void {
    engine.register('GetHomePageLinkUsingBrowser', new GetHomePageLinkUsingBrowser())
    engine.register('GetHomePageLinkUsingHttpClient', new GetHomePageLinkUsingHttpClient())
  }
}
