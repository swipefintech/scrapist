import { IEngine } from './IEngine'

export interface IModule {

  register(engine: IEngine): void;
}
