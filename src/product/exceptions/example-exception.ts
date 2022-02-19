import { HttpException, HttpStatus } from '@nestjs/common';

export default class ExampleException extends HttpException {
  constructor() {
    super('Example exception for demonstration purposes.', HttpStatus.CONFLICT);
  }
}
