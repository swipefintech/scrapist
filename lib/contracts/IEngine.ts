import ICommand from "./ICommand";
import IInput from "./IInput";
import IModule from "./IModule";
import IOutput from "./IOutput";

export default interface IEngine {

  handle(input: IInput): Promise<IOutput>;

  mount(id: string, module: IModule): IEngine;

  register(id: string, command: ICommand): IEngine;
}
