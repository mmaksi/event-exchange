import { CustomError } from './custom-error';

export class ForbiddenError extends CustomError {
  statusCode = 403;
  constructor() {
    super("You don't have permissions to access this resource");
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }

  serializeErrors() {
    return [{ message: "You don't have permissions to access this resource" }];
  }
}
