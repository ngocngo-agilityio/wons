// Constants
import { API_PATH } from '@/constants';

// Models
import { ICalendarTask, IEvent } from '@/models';

// Services
import { httpClient } from '@/services';

// Types
import { StrapiModel, StrapiResponse } from '@/types';

// Utils
import { formatErrorMessage } from '@/utils';

export const getCalendarEvents = async (): Promise<{
  error?: string;
  data?: StrapiModel<IEvent>[];
}> => {
  try {
    const productsResponse = await httpClient.getRequest<
      StrapiResponse<StrapiModel<IEvent>[]>
    >({
      endpoint: `${API_PATH.EVENTS}?populate=users_permissions_users`,
      configOptions: {
        next: {
          tags: [API_PATH.EVENTS],
        },
      },
    });

    return { data: productsResponse.data ?? [] };
  } catch (error) {
    const message = formatErrorMessage(error);
    return { error: message };
  }
};

export const getCalendarTasks = async (): Promise<{
  error?: string;
  data?: StrapiModel<ICalendarTask>[];
}> => {
  try {
    const productsResponse = await httpClient.getRequest<
      StrapiResponse<StrapiModel<ICalendarTask>[]>
    >({
      endpoint: `${API_PATH.CALENDAR_TASKS}`,
      configOptions: {
        next: {
          tags: [API_PATH.EVENTS],
        },
      },
    });

    return { data: productsResponse.data ?? [] };
  } catch (error) {
    const message = formatErrorMessage(error);
    return { error: message };
  }
};
