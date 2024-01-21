import { ErrorType } from './error-types.enum';

export const ErrorMessages = {
  [ErrorType.DUPLICATE_USERNAME]: 'A user with this username already exists.',
  [ErrorType.INTERNAL_SERVER_ERROR]: 'An unexpected error occurred.',
};
