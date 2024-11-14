'use server';

// Constants
import { API_PATH } from '@/constants';

// Models
import { TUser } from '@/models';

// Services
import { httpClient } from '@/services';

// Utils
import { formatErrorMessage } from '@/utils';

// Types
import { TProfileResponse } from '@/types';

export const getProfile = async (jwt: string): Promise<TProfileResponse> => {
  try {
    const data = await httpClient.getRequest<TProfileResponse>({
      endpoint: `${API_PATH.USERS}/me?populate=role`,
      configOptions: {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        cache: 'no-store',
        next: {
          tags: [API_PATH.USERS],
        },
      },
    });

    return data;
  } catch (error) {
    const message = formatErrorMessage(error);

    throw new Error(message);
  }
};

export const getUsers = async (): Promise<TUser[]> => {
  const endpoint = API_PATH.USERS;

  try {
    const customerResponse = await httpClient.getRequest<TUser[]>({
      endpoint,
      configOptions: {
        next: { tags: [API_PATH.USERS] },
      },
    });

    return customerResponse;
  } catch (error) {
    const message = formatErrorMessage(error);

    throw new Error(message);
  }
};
