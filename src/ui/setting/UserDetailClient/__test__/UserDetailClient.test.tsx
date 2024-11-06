import userEvent from '@testing-library/user-event';

// Constants
import { IMAGES, MESSAGES } from '@/constants';

// Components
import UserDetailClient from '../index';
import { updateUser } from '@/actions';

const mockShowToast = jest.fn();

jest.mock('@/hooks', () => ({
  ...jest.requireActual('@/hooks'),
  useToast: () => ({ showToast: mockShowToast }),
}));

jest.mock('@/actions', () => ({
  ...jest.requireActual('@/actions'),
  updateUser: jest.fn(),
}));

const mockUser = {
  avatar: IMAGES.AVATAR_DEFAULT,
  username: 'admin',
  fullName: 'Super Admin',
  email: 'admin1@gmail.com',
  role: 'Admin',
};

describe('UserDetailClient', () => {
  beforeEach(() => {
    global.URL.createObjectURL = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const onEditMock = jest.fn();
  const renderUserDetailClient = (props?: Record<string, null>) =>
    testLibJestUtils.render(
      <UserDetailClient
        user={mockUser}
        id={1}
        onEdit={onEditMock}
        {...props}
      />,
    );

  it('match snapshot with user null', () => {
    const { container } = renderUserDetailClient();

    expect(container).toMatchSnapshot();
  });

  it('match snapshot', () => {
    const { container } = renderUserDetailClient({ user: null });

    expect(container).toMatchSnapshot();
  });

  it('calls edit', async () => {
    const { getByText, getByTestId, getByLabelText } = renderUserDetailClient();

    testLibJestUtils.fireEvent.click(getByText('Edit Profile'));

    await userEvent.upload(
      getByTestId('avatar-upload'),
      new File(['image'], 'test.png', { type: 'image/png' }),
    );
    testLibJestUtils.fireEvent.change(getByLabelText('Full Name'), {
      target: {
        value: 'test',
      },
    });
    testLibJestUtils.fireEvent.submit(getByTestId('user-detail-form'));
    onEditMock.mockResolvedValue({ error: '' });

    testLibJestUtils.waitFor(() => {
      expect(onEditMock).toHaveBeenCalled();
      expect(mockShowToast).toHaveBeenCalledWith({
        description: MESSAGES.SUCCESS.UPDATE_PROFILE,
        status: MESSAGES.STATUS.SUCCESS,
      });
    });
  });

  it('calls edit', async () => {
    const { getByText, getByTestId, getByLabelText } = renderUserDetailClient();

    testLibJestUtils.fireEvent.click(getByText('Edit Profile'));

    testLibJestUtils.fireEvent.change(getByLabelText('Full Name'), {
      target: {
        value: 'test',
      },
    });
    testLibJestUtils.fireEvent.submit(getByTestId('user-detail-form'));
    (updateUser as jest.Mock).mockRejectedValue(
      new Error(MESSAGES.ERROR.UNKNOWN_ERROR),
    );
    onEditMock.mockResolvedValue({ error: MESSAGES.ERROR.UNKNOWN_ERROR });

    testLibJestUtils.waitFor(() => {
      expect(onEditMock).toHaveBeenCalled();
      expect(mockShowToast).toHaveBeenCalledWith({
        description: MESSAGES.ERROR.UNKNOWN_ERROR,
        status: MESSAGES.STATUS.ERROR,
      });
    });
  });
});
