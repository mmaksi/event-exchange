import { CustomError } from './custom-error';

export class TooManyRequestsError extends CustomError {
  statusCode = 429;

  constructor() {
    super('EEEEEEEEERRRRRRRRRRRRRR Too many requests, please try again later.');
    Object.setPrototypeOf(this, TooManyRequestsError.prototype);
  }

  serializeErrors() {
    return [{ message: 'Too many requests, please try again later.' }];
  }
}
