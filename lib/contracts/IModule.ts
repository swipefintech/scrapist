import IEngine from "./IEngine";

export default interface IModule {

  register(engine: IEngine): void;
}
