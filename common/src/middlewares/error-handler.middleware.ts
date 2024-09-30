import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../errors/custom-error';
import chalk from 'chalk';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }
  console.error(chalk.red.bold(err));
  return res.status(400).send({ message: 'Something went wrong' });
};
