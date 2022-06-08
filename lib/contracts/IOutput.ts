export enum Status {
  UNKNOWN = -2,
  INVALID = -1,
  FAILURE,
  SUCCESS
}

export default interface IOutput {
  data?: unknown;
  status: Status;
  message?: string;
}
