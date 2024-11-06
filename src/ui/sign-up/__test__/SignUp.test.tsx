// Mocks
import { MOCK_AUTH } from '@/mocks';

// UI
import SignUpForm from '../index';
import { authenticate, signUp } from '@/actions';
import { MESSAGES } from '@/constants';

const mockShowToast = jest.fn();
jest.mock('@/hooks', () => ({
  ...jest.requireActual('@/hooks'),
  useToast: () => ({ showToast: mockShowToast }),
}));

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useRouter: jest.fn(() => ({ push: mockPush })),
}));

jest.mock('@/actions', () => ({
  ...jest.requireActual('@/actions'),
  authenticate: jest.fn(),
  signUp: jest.fn(),
}));

describe('Sign up', () => {
  it('should match snapshot', () => {
    const { container } = testLibJestUtils.render(<SignUpForm />);

    expect(container).toMatchSnapshot();
  });

  it('calls sign up', async () => {
    const { getByLabelText, getByTestId, getByText } = testLibJestUtils.render(
      <SignUpForm />,
    );

    testLibJestUtils.fireEvent.change(getByLabelText('Full Name'), {
      target: {
        value: MOCK_AUTH[0].fullName,
      },
    });
    testLibJestUtils.fireEvent.change(getByLabelText('Email Address'), {
      target: {
        value: MOCK_AUTH[0].email,
      },
    });
    testLibJestUtils.fireEvent.change(getByLabelText('Username'), {
      target: {
        value: MOCK_AUTH[0].username,
      },
    });
    testLibJestUtils.fireEvent.change(getByLabelText('Password'), {
      target: {
        value: 'Abcd@1234',
      },
    });
    testLibJestUtils.fireEvent.click(getByTestId('policy'));

    await testLibJestUtils.waitFor(() => {
      expect(getByText('Create account')).toBeEnabled();
    });

    await testLibJestUtils.waitFor(() => {
      testLibJestUtils.fireEvent.submit(getByTestId('sign-up-form'));
    });

    await testLibJestUtils.waitFor(() => {
      expect(mockPush).toHaveBeenCalled();
    });
  });

  it('calls sign up with authenticate success', async () => {
    (authenticate as jest.Mock).mockResolvedValue(true);

    const { getByLabelText, getByTestId, getByText } = testLibJestUtils.render(
      <SignUpForm />,
    );

    testLibJestUtils.fireEvent.change(getByLabelText('Full Name'), {
      target: {
        value: MOCK_AUTH[0].fullName,
      },
    });
    testLibJestUtils.fireEvent.change(getByLabelText('Email Address'), {
      target: {
        value: MOCK_AUTH[0].email,
      },
    });
    testLibJestUtils.fireEvent.change(getByLabelText('Username'), {
      target: {
        value: MOCK_AUTH[0].username,
      },
    });
    testLibJestUtils.fireEvent.change(getByLabelText('Password'), {
      target: {
        value: 'Abcd@1234',
      },
    });
    testLibJestUtils.fireEvent.click(getByTestId('policy'));

    await testLibJestUtils.waitFor(() => {
      expect(getByText('Create account')).toBeEnabled();
    });

    await testLibJestUtils.waitFor(() => {
      testLibJestUtils.fireEvent.submit(getByTestId('sign-up-form'));
    });

    await testLibJestUtils.waitFor(() => {
      expect(mockShowToast).toHaveBeenCalled();
    });
  });

  it('calls sign up failed', async () => {
    (signUp as jest.Mock).mockResolvedValue({
      error: MESSAGES.ERROR_API.EMAIL_OR_USERNAME_EXIST,
    });

    const { getByLabelText, getByTestId, getByText } = testLibJestUtils.render(
      <SignUpForm />,
    );

    testLibJestUtils.fireEvent.change(getByLabelText('Full Name'), {
      target: {
        value: MOCK_AUTH[0].fullName,
      },
    });
    testLibJestUtils.fireEvent.change(getByLabelText('Email Address'), {
      target: {
        value: MOCK_AUTH[0].email,
      },
    });
    testLibJestUtils.fireEvent.change(getByLabelText('Username'), {
      target: {
        value: MOCK_AUTH[0].username,
      },
    });
    testLibJestUtils.fireEvent.change(getByLabelText('Password'), {
      target: {
        value: 'Abcd@1234',
      },
    });
    testLibJestUtils.fireEvent.click(getByTestId('policy'));

    await testLibJestUtils.waitFor(() => {
      expect(getByText('Create account')).toBeEnabled();
    });

    await testLibJestUtils.waitFor(() => {
      testLibJestUtils.fireEvent.submit(getByTestId('sign-up-form'));
    });

    await testLibJestUtils.waitFor(() => {
      expect(mockShowToast).toHaveBeenCalled();
    });
  });
});
