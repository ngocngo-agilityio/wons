'use server';

import { AuthError } from 'next-auth';

// Configs
import { signIn, signOut as signOutAuth } from '@/configs';

// Constants
import { API_PATH, AUTH_METHODS, ERROR_TYPES, MESSAGES } from '@/constants';

// Types
import {
  SignInFormData,
  ISignUpFormData,
  TSignUpResponse,
  Method,
} from '@/types';

// Services
import { httpClient } from '@/services';

// Utils
import { formatErrorMessage } from '@/utils';

export const authenticate = async (
  formData: SignInFormData,
): Promise<void | string> => {
  try {
    await signIn(AUTH_METHODS.CREDENTIALS, formData);
  } catch (error) {
    const {
      ERROR: { EMAIL_PASSWORD_INVALID, UNKNOWN_ERROR },
    } = MESSAGES;

    if (error instanceof AuthError) {
      const errorMessages: { [key: string]: string } = {
        [ERROR_TYPES.CREDENTIALS_SIGN_IN]: EMAIL_PASSWORD_INVALID,
      };

      return errorMessages[error.type] || UNKNOWN_ERROR;
    }
    throw error;
  }
};

export const signOut = async () => {
  await signOutAuth();
};

export const signUp = async (
  payload: ISignUpFormData,
): Promise<{ error?: string; data?: TSignUpResponse }> => {
  try {
    const res = await httpClient.genericRequest<
      ISignUpFormData,
      TSignUpResponse
    >({
      method: Method.Post,
      endpoint: API_PATH.SIGN_UP,
      body: payload,
    });

    return { data: res };
  } catch (error) {
    const message = formatErrorMessage(error);

    return { error: message };
  }
};
