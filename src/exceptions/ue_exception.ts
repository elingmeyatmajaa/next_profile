export class UeException extends Error {
  code: number;
  errors?: any;

  constructor(message: string, code: number = 500, errors?: any) {
    super(message);
    this.name = "UeException";
    this.code = code;
    this.errors = errors;
  }
}