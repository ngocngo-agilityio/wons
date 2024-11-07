// Mocks
import { MOCK_TASK_WITH_STRING_ASSIGNEES } from '@/mocks';

// Components
import TaskForm from '../';

describe('TaskForm', () => {
  const onSubmitMock = jest.fn();
  const setResetMock = jest.fn();
  const onCloseDrawerMock = jest.fn();
  const onAvatarChangeMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should match snapshot', () => {
    const { container } = testLibJestUtils.render(
      <TaskForm
        isDisabledField={false}
        onSubmit={onSubmitMock}
        setReset={setResetMock}
        previewData={null}
        onCloseDrawer={onCloseDrawerMock}
        onAvatarChange={onAvatarChangeMock}
      />,
    );

    expect(container).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with previewData', async () => {
    const { container } = testLibJestUtils.render(
      <TaskForm
        isDisabledField={false}
        onSubmit={onSubmitMock}
        setReset={setResetMock}
        previewData={MOCK_TASK_WITH_STRING_ASSIGNEES}
        onCloseDrawer={onCloseDrawerMock}
        onAvatarChange={onAvatarChangeMock}
      />,
    );

    expect(container).toBeInTheDocument();
  });
});
