import type { HttpStatusCode } from '@area/shared/enums/http-status';

/**
 * @class ApiError
 * @description Api error class
 */
export default class ApiError extends Error {
  /**
   * @property httpCode
   * @description The http status code
   */
  public httpCode: HttpStatusCode;
  /**
   * @property data
   * @description The data
   */
  public data: Record<string, unknown> | undefined;

  /**
   * @constructor
   * @param httpCode - The http status code
   * @param statusCode - The status code
   * @param message - The message
   * @param data - The data
   */
  constructor(httpCode: HttpStatusCode, message: string, data?: Record<string, unknown>) {
    super(message);
    this.httpCode = httpCode;
    this.data = data;
  }
}
