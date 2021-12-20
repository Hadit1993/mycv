import { HttpException, HttpStatus } from '@nestjs/common';

export default class CustomHttpException extends HttpException {
  constructor(statusCode: HttpStatus, data: any) {
    let message: string;
    switch (statusCode) {
      case HttpStatus.BAD_REQUEST:
        message = 'BAD REQUEST';
        break;
      case HttpStatus.UNAUTHORIZED:
        message = 'UNAUTHORIZED';
        break;
      case HttpStatus.FORBIDDEN:
        message = 'FORBIDDEN';
        break;
      case HttpStatus.NOT_FOUND:
        message = 'NOT FOUND';
        break;

      case HttpStatus.BAD_GATEWAY:
        message = 'BAD GATEWAY';
        break;

      case HttpStatus.INTERNAL_SERVER_ERROR:
        message = 'INTERNAL_SERVER_ERROR';
        break;

      default:
        message = 'UNKNOWN ERROR';
    }

    super({ success: false, message, statusCode, error: data }, statusCode);
  }
}
