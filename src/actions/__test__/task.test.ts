import { revalidateTag } from 'next/cache';

// Constants
import { API_PATH } from '@/constants';

// Mocks
import {
  MOCK_DATA_TASKS_WITHOUT_STRAPI_MODEL,
  MOCK_TASK_WITH_STRING_ASSIGNEES,
  MOCK_TASKS,
} from '@/mocks';

// Services
import { httpClient } from '@/services';

// Apis
import { createTask, deleteTask, updateTask } from '../task';

// Utils
import { formatErrorMessage } from '@/utils';

// Types
import { Method } from '@/types';

jest.mock('@/services', () => ({
  httpClient: {
    getRequest: jest.fn(),
    genericRequest: jest.fn(),
  },
}));

jest.mock('next/cache', () => ({
  revalidateTag: jest.fn(),
}));

jest.mock('@/utils', () => ({
  formatErrorMessage: jest.fn(),
}));

describe('deleteTask', () => {
  const taskID = MOCK_TASKS.todo[0].id;

  it('calls success', async () => {
    (httpClient.genericRequest as jest.Mock).mockResolvedValue({
      method: Method.Delete,
      endpoint: `${API_PATH.TASKS}/${taskID}`,
    });

    await deleteTask(taskID);

    expect(httpClient.genericRequest).toHaveBeenCalledWith({
      method: Method.Delete,
      endpoint: `${API_PATH.TASKS}/${taskID}`,
    });
    expect(revalidateTag).toHaveBeenCalledWith(API_PATH.TASKS);
  });

  it('calls failed', async () => {
    const MOCK_ERROR = new Error('Request failed');
    (httpClient.genericRequest as jest.Mock).mockRejectedValue(MOCK_ERROR);
    (formatErrorMessage as jest.Mock).mockReturnValue('Something went wrong.');

    const result = await deleteTask(taskID);

    expect(revalidateTag).not.toHaveBeenCalled();
    expect(result).toEqual({ error: 'Something went wrong.' });
  });
});

describe('createTask', () => {
  it('calls success', async () => {
    (httpClient.genericRequest as jest.Mock).mockResolvedValue({
      data: {
        id: 1,
        ...MOCK_TASK_WITH_STRING_ASSIGNEES,
      },
    });

    const result = await createTask(MOCK_TASK_WITH_STRING_ASSIGNEES);

    expect(httpClient.genericRequest).toHaveBeenCalledWith({
      method: Method.Post,
      endpoint: API_PATH.TASKS,
      body: { data: MOCK_TASK_WITH_STRING_ASSIGNEES },
    });

    expect(revalidateTag).toHaveBeenCalledWith(API_PATH.TASKS);
    expect(result).toEqual({ success: true });
  });

  it('calls failed', async () => {
    const MOCK_ERROR = new Error('Request failed');
    (httpClient.genericRequest as jest.Mock).mockRejectedValue(MOCK_ERROR);
    (formatErrorMessage as jest.Mock).mockReturnValue('Something went wrong.');

    const result = await createTask(MOCK_TASK_WITH_STRING_ASSIGNEES);

    expect(formatErrorMessage).toHaveBeenCalledWith(MOCK_ERROR);
    expect(result).toEqual({ error: 'Something went wrong.' });
  });
});

describe('updateTask', () => {
  const taskID = 1;

  it('calls success', async () => {
    (httpClient.genericRequest as jest.Mock).mockResolvedValue({
      data: {
        id: taskID,
        ...MOCK_DATA_TASKS_WITHOUT_STRAPI_MODEL,
      },
    });

    const result = await updateTask(
      taskID,
      MOCK_DATA_TASKS_WITHOUT_STRAPI_MODEL,
    );

    expect(httpClient.genericRequest).toHaveBeenCalledWith({
      method: Method.Put,
      endpoint: `${API_PATH.TASKS}/${taskID}?populate=assignees`,
      body: { data: MOCK_DATA_TASKS_WITHOUT_STRAPI_MODEL },
      configOptions: {
        cache: 'no-store',
      },
    });

    expect(revalidateTag).toHaveBeenCalledWith(API_PATH.TASKS);
    expect(result).toEqual({ success: true });
  });

  it('calls failed', async () => {
    const MOCK_ERROR = new Error('Update failed');
    (httpClient.genericRequest as jest.Mock).mockRejectedValue(MOCK_ERROR);
    (formatErrorMessage as jest.Mock).mockReturnValue('Something went wrong.');

    const result = await updateTask(
      taskID,
      MOCK_DATA_TASKS_WITHOUT_STRAPI_MODEL,
    );

    expect(formatErrorMessage).toHaveBeenCalledWith(MOCK_ERROR);
    expect(result).toEqual({ error: 'Something went wrong.' });
  });
});
