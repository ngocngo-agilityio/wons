// constants
import { API_PATH } from '@/constants';

// models
import { IStatistics } from '@/models';

// services
import { httpClient } from '@/services';

// types
import { StrapiModel, StrapiResponse } from '@/types';

// utils
import { formatErrorMessage } from '@/utils';

export const getAllStatistics = async (): Promise<{
  error?: string;
  data?: IStatistics[];
}> => {
  const url = API_PATH.STATISTICS;

  try {
    const response = await httpClient.getRequest<
      StrapiResponse<StrapiModel<IStatistics>[]>
    >({
      endpoint: url,
    });

    if (!response?.data?.length) {
      return { data: [] };
    }

    const statistics = response.data.map((item) => item.attributes);

    return { data: statistics };
  } catch (error) {
    const message = formatErrorMessage(error);

    return { error: message };
  }
};
