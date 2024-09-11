// Libs
import { z } from 'zod';

// Constants
import { ERROR_MESSAGES, ErrorMapper } from '@/constants';

export type TStrapiErrorResponse = {
  data: null;
  error: {
    status: number;
    name: string;
    message: string;
  };
};

const TStrapiErrorResponseSchema = z.object({
  data: z.null(),
  error: z.object({
    status: z.number(),
    name: z.string(),
    message: z.string(),
  }),
});

export const formatErrorMessage = (errorResponse: unknown): string => {
  let errorMessage = '';

  const parseResult = TStrapiErrorResponseSchema.safeParse(errorResponse);

  if (parseResult.success) {
    const strapiErrorResponse = errorResponse as TStrapiErrorResponse;

    const { message } = strapiErrorResponse?.error || {};

    errorMessage = ErrorMapper[message] || ERROR_MESSAGES.UNKNOWN_ERROR;
  }

  // Set default message if unknown error
  if (!errorMessage) {
    errorMessage = ERROR_MESSAGES.UNKNOWN_ERROR;
  }

  return errorMessage;
};