import request from 'axios';
import {toast} from 'react-toastify';
import {ErrorType, ValidationErrorField} from './types/error';
import { HttpCode } from './const';

export const errorHandle = (error: ErrorType): void => {
  if (!request.isAxiosError(error)) {
    throw error;
  }

  const {response} = error;

  if (response) {
    switch (response.status) {
      case HttpCode.BadRequest:
        (response.data.details)
          ? response.data.details
            .forEach(
              (detail: ValidationErrorField) =>
                detail.messages
                  .forEach(
                    (message: string) => toast.info(message),
                  ),
            )
          : toast.info(response.data.message);
        break;
      case HttpCode.Unauthorized:
        toast.info(response.data.message);
        break;
      case HttpCode.NotFound:
        toast.info(response.data.message);
        break;
      case HttpCode.Conflict:
        toast.info(response.data.message);
        break;
    }
  }
};
