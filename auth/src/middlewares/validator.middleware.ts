import { body } from 'express-validator';

export const signupValidator = [
  body('email').isEmail().withMessage('Invalid e-mail'),
  body('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Password must be between 4 and 20 characters'),
];

export const signinValidator = [
  body('email').isEmail().withMessage('Invalid e-mail'),
  body('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Password must be between 4 and 20 characters'),
];
