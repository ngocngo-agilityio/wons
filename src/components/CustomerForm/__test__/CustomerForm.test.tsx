import { render, fireEvent, waitFor } from '@testing-library/react';

// components
import { CustomerForm } from '@/components';

// utils
import { CUSTOMER_MOCK } from '@/mocks';

const mockOnSubmit = jest.fn();
const mockOnAvatarChange = jest.fn();

jest.mock('@/utils', () => ({
  ...jest.requireActual('@/utils'),
  uploadImage: jest.fn(),
  clearPhoneNumberFormat: jest.fn(),
  formatPhoneNumberTyping: jest.fn(),
}));

const renderComponent = (props = {}) => {
  return render(
    <CustomerForm
      onSubmit={mockOnSubmit}
      onAvatarChange={mockOnAvatarChange}
      {...props}
    />,
  );
};

describe('CustomerForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.URL.createObjectURL = jest.fn();
  });

  it('renders CustomerForm with content', () => {
    const { container } = renderComponent();

    expect(container).toMatchSnapshot();
  });

  it('renders without crashing', () => {
    const { getByLabelText } = renderComponent();
    expect(getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(getByLabelText(/Last Name/i)).toBeInTheDocument();
  });

  it('disables the submit button when fields are invalid', async () => {
    const { getByRole } = renderComponent();

    fireEvent.click(getByRole('button', { name: /Add Customer/i }));

    await waitFor(() => {
      expect(getByRole('button', { name: /Add Customer/i })).toBeDisabled();
    });
  });

  it('renders correct title for Add Customer', () => {
    const { getAllByText } = renderComponent();
    expect(getAllByText(/Add Customer/i).length).toBeGreaterThan(0);
  });

  it('renders correct title for Update Customer', () => {
    const { getByRole } = renderComponent({ previewData: CUSTOMER_MOCK });

    const heading = getByRole('heading', { name: /Update Customer/i });

    expect(heading).toBeInTheDocument();
  });
});
