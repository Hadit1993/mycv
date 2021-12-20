import { HttpException } from '@nestjs/common';

export default class CustomBadRequestException extends HttpException {
  constructor(data: any) {
    super(
      { success: false, message: 'Bad Request', statusCode: 400, error: data },
      400,
    );
  }
}
