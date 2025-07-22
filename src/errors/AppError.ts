export class AppError extends Error {
  public statusCode: number;
  public status: string;

  constructor(
    message: string,
    statusCode: number = 400,
    status: string = "error"
  ) {
    super(message);
    this.statusCode = statusCode;
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}
