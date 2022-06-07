import { Cache } from "cache-manager";
import ICommand from "../contracts/ICommand";
import IEngine from "../contracts/IEngine";
import IInput from "../contracts/IInput";
import IModule from "../contracts/IModule";
import IOutput, { Status } from "../contracts/IOutput";
import ScrapeCommand from "./commands/ScrapeCommand";

type CommandsCollection = { id: string, command: ICommand }[];

export default class Engine implements IEngine {

  private commands: CommandsCollection = [];
  private modules: string[] = [];

  constructor(private cache?: Cache) {
  }

  async handle(input: IInput): Promise<IOutput> {
    for (const cmd of this.commands) {
      if (cmd.id == input.command) {
        const error = cmd.command.validate(input);
        if (error === null) {
          try {
            return cmd.command.process(input);
          } catch (e) {
            return {
              message: e.message,
              status: Status.FAILURE,
            };
          }
        }

        return {
          message: error,
          status: Status.INVALID,
        };
      }
    }

    return {
      status: Status.UNKNOWN,
      message: `Command '${input.command}' is not known.`,
    };
  }

  mount(id: string, module: IModule): IEngine {
    this.modules.push(id);
    module.register(this);
    this.modules.pop();
    return this;
  }

  register(id: string, command: ICommand): IEngine {
    if (command instanceof ScrapeCommand) {
      command.cache = this.cache;
    }

    const path = [ ...this.modules, id ].join("/");
    this.commands.push({ id: path, command: command });
    return this;
  }
}
