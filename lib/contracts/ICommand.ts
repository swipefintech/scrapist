import IInput from './IInput'
import IOutput from './IOutput'

export default interface ICommand {

  process(input: IInput): Promise<IOutput>;

  validate(input: IInput): string | null;
}
