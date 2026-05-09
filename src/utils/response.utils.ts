export class ErrorResponse extends Error {
  constructor(
    public override message: string,
    public statusCode: number = 500,
    public statusText: string = "BAD_REQUEST",
  ) {
    super(message);
    this.statusCode = statusCode;
    this.statusText = statusText;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const SuccessResponse = (
  message: string,
  data: any = {},
  statusCode: number = 200,
  statusText: string = "OK",
) => {
  return {
    message,
    data: serialize(data),
    success: true,
  };
};

export const serialize = (data: any) =>
  JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );