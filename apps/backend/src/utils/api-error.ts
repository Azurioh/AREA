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
   * @constructor
   * @param httpCode - The http status code
   * @param message - The message
   */
  constructor(httpCode: HttpStatusCode, message: string) {
    super(message);
    this.httpCode = httpCode;
  }
}
