// Api
import { getTasks } from '@/api';

// UI
import TaskListBoard from '../TaskListBoard';

// Mocks
import { MOCK_TASKS } from '@/mocks';

jest.mock('@/api', () => ({
  ...jest.requireActual('@/api'),
  getTasks: jest.fn(),
}));

describe('Task List Board', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should match snapshot', async () => {
    (getTasks as jest.Mock).mockResolvedValue({ data: MOCK_TASKS.todo });

    const { container } = testLibJestUtils.render(
      await TaskListBoard({
        searchParams: {
          filters: 'superadmin',
          query: 'test',
        },
      }),
    );

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with search params is undefined', async () => {
    (getTasks as jest.Mock).mockResolvedValue({
      data: MOCK_TASKS.todo,
    });

    const { container } = testLibJestUtils.render(
      await TaskListBoard({
        // TODO: I must to use any type to test null
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        searchParams: null as any,
      }),
    );

    expect(container).toMatchSnapshot();
  });
});
