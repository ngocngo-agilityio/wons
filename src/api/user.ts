'use server';

// Constants
import { API_PATH } from '@/constants';

// Models
import { TUser } from '@/models';

// Services
import { httpClient } from '@/services';

// Utils
import { formatErrorMessage } from '@/utils';

export const getProfile = async (
  jwt: string,
): Promise<Omit<TUser, 'password'>> => {
  try {
    const data = await httpClient.getRequest<Omit<TUser, 'password'>>({
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

type UserListConfigs = {
  cache?: RequestCache;
  nextOptions?: NextFetchRequestConfig;
};

export const getUsers = async ({
  cache,
  nextOptions,
}: UserListConfigs = {}): Promise<TUser[]> => {
  const endpoint = API_PATH.USERS;

  try {
    const customerResponse = await httpClient.getRequest<TUser[]>({
      endpoint,
      configOptions: {
        cache: cache ?? 'force-cache',
        next: nextOptions,
      },
    });

    return customerResponse;
  } catch (error) {
    const message = formatErrorMessage(error);

    throw new Error(message);
  }
};

interface Details extends UserListConfigs {
  id: number;
}

export const getUserById = async ({
  id,
  cache,
  nextOptions,
}: Details): Promise<TUser> => {
  const endpoint = `${API_PATH.USERS}/${id}`;

  try {
    const customerResponse = await httpClient.getRequest<TUser>({
      endpoint,
      configOptions: {
        cache: cache ?? 'force-cache',
        next: nextOptions,
      },
    });

    return customerResponse;
  } catch (error) {
    const message = formatErrorMessage(error);

    throw new Error(message);
  }
};
