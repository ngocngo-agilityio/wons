import { useRouter } from 'next/navigation';

// Constants
import { MESSAGES } from '@/constants';

// Components
import SignInForm from '../index';

const mockOnSubmit = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockedUseRouter = useRouter as jest.Mock;

const props = {
  onSubmit: mockOnSubmit,
};

describe('SignInForm', () => {
  mockedUseRouter.mockReturnValue({
    pathname: '/',
    push: jest.fn(),
    replace: jest.fn(),
  });

  const renderComponent = () =>
    testLibJestUtils.render(<SignInForm {...props} />);

  it('should match snapshot for SignInForm', () => {
    const { container } = renderComponent();

    expect(container).toMatchSnapshot();
  });

  it('should call onSubmit with correct data when form is valid', async () => {
    const { getByLabelText, getByRole } = renderComponent();

    // Fill form with valid data
    testLibJestUtils.fireEvent.change(getByLabelText(/Email Address/i), {
      target: { value: 'test@example.com' },
    });
    testLibJestUtils.fireEvent.change(getByLabelText(/Password/i), {
      target: { value: 'Password@123' },
    });

    // Submit the form
    testLibJestUtils.fireEvent.click(getByRole('button', { name: /Sign in/i }));

    // Wait for the form to submit and check the onSubmit was called with correct data
    await testLibJestUtils.waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        identifier: 'test@example.com',
        password: 'Password@123',
      });
    });
  });

  it('should show validation errors for empty fields', async () => {
    const { findByText, getByLabelText } = renderComponent();

    testLibJestUtils.fireEvent.change(getByLabelText(/Email Address/i), {
      target: { value: '' },
    });

    testLibJestUtils.fireEvent.blur(getByLabelText(/Email Address/i));

    // Check for validation messages
    await testLibJestUtils.waitFor(() => {
      expect(findByText(MESSAGES.ERROR.FIELD_REQUIRED)).toBeTruthy();
    });
  });

  it('should show validation errors for invalid email ', async () => {
    const { findByText, getByLabelText } = renderComponent();

    testLibJestUtils.fireEvent.change(getByLabelText(/Email Address/i), {
      target: { value: 'emailInvalid' },
    });

    testLibJestUtils.fireEvent.blur(getByLabelText(/Email Address/i));

    // Check for validation messages
    await testLibJestUtils.waitFor(() => {
      expect(findByText(MESSAGES.ERROR.EMAIL_INVALID)).toBeTruthy();
    });
  });
});
