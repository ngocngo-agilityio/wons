import userEvent from '@testing-library/user-event';

// Mocks
import { MOCK_CUSTOMERS_WITH_ATTRIBUTES } from '@/mocks';

// Components
import CustomerListClient from '../CustomerListClient';

// Contexts
import { ToastProvider } from '@/contexts';

// Actions
import { deleteCustomer, updateCustomer } from '@/actions';

// Constants
import { MESSAGES, ORDER } from '@/constants';

const mockShowToast = jest.fn();
jest.mock('@/hooks', () => ({
  ...jest.requireActual('@/hooks'),
  useToast: () => ({ showToast: mockShowToast }),
}));

const mockReplace = jest.fn();
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useRouter: jest.fn(() => ({ replace: mockReplace, push: mockPush })),
}));

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({
    data: {
      user: {
        role: {
          id: 3,
        },
      },
    },
  })),
}));

jest.mock('@/actions', () => ({
  ...jest.requireActual('@/actions'),
  updateCustomer: jest.fn(),
  deleteCustomer: jest.fn(),
}));

const originalFetch = global.fetch;

beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({}),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      redirected: false,
      statusText: 'OK',
      type: 'basic',
      url: '',
      clone: jest.fn(),
      body: null,
      bodyUsed: false,
      arrayBuffer: jest.fn(),
      blob: jest.fn(),
      formData: jest.fn(),
      text: jest.fn(),
    } as Response),
  );
});

afterAll(() => {
  global.fetch = originalFetch;
});

describe('CustomerListClient section', () => {
  beforeEach(() => {
    global.URL.createObjectURL = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (props?: Record<string, string>) =>
    testLibJestUtils.render(
      <ToastProvider>
        <CustomerListClient
          customerList={MOCK_CUSTOMERS_WITH_ATTRIBUTES}
          pageCount={1}
          order={ORDER.ASC}
          {...props}
        />
      </ToastProvider>,
    );

  it('should match with snapshot', async () => {
    const { container } = renderComponent();

    await testLibJestUtils.waitFor(() => {
      expect(container).toBeInTheDocument();
    });

    expect(container).toMatchSnapshot();
  });

  it('open customer details drawer', async () => {
    const { container } = renderComponent();

    await testLibJestUtils.waitFor(() => {
      testLibJestUtils.fireEvent.click(
        container.querySelector('[data-key="1"]') as Element,
      );
    });

    // Await drawer appear
    await testLibJestUtils.waitFor(() => {
      expect(container).toMatchSnapshot();
    });
  });

  it('calls edit customer', async () => {
    (updateCustomer as jest.Mock).mockResolvedValue({ success: true });

    const { getAllByTestId, getByText, getByTestId, getByLabelText } =
      renderComponent();

    testLibJestUtils.fireEvent.click(getAllByTestId('actions-btn')[0]);

    await testLibJestUtils.waitFor(() => {
      expect(getByText('Edit')).toBeTruthy();
    });

    testLibJestUtils.fireEvent.click(getByText('Edit'));

    await testLibJestUtils.waitFor(() => {
      expect(getByTestId('customer-form')).toBeTruthy();
    });

    await userEvent.upload(
      getByTestId('avatar-upload'),
      new File(['image'], 'test.png', { type: 'image/png' }),
    );

    testLibJestUtils.fireEvent.change(getByLabelText('First Name'), {
      target: {
        value: 'test',
      },
    });
    testLibJestUtils.fireEvent.submit(getByTestId('customer-form'));
    const result = await updateCustomer(1, {
      firstName: 'test',
      avatar: '',
    });

    expect(result).toEqual({ success: true });
  });

  it('calls edit customer failed', async () => {
    (updateCustomer as jest.Mock).mockResolvedValue({
      error: MESSAGES.ERROR.UNKNOWN_ERROR,
    });
    const { getAllByTestId, getByText, getByTestId, getByLabelText } =
      renderComponent();

    testLibJestUtils.fireEvent.click(getAllByTestId('actions-btn')[0]);

    await testLibJestUtils.waitFor(() => {
      expect(getByText('Edit')).toBeTruthy();
    });

    testLibJestUtils.fireEvent.click(getByText('Edit'));

    await testLibJestUtils.waitFor(() => {
      expect(getByTestId('customer-form')).toBeTruthy();
    });

    await userEvent.upload(
      getByTestId('avatar-upload'),
      new File(['image'], 'test.png', { type: 'image/png' }),
    );

    testLibJestUtils.fireEvent.change(getByLabelText('First Name'), {
      target: {
        value: 'test',
      },
    });
    testLibJestUtils.fireEvent.submit(getByTestId('customer-form'));
    const result = await updateCustomer(1, {
      firstName: 'test',
      avatar: '',
    });

    expect(result).toEqual({ error: MESSAGES.ERROR.UNKNOWN_ERROR });
  });

  it('calls delete customer', async () => {
    (deleteCustomer as jest.Mock).mockResolvedValue({ success: true });

    const { getAllByTestId, getByText } = renderComponent();

    testLibJestUtils.fireEvent.click(getAllByTestId('actions-btn')[0]);

    await testLibJestUtils.waitFor(() => {
      expect(getByText('Delete')).toBeTruthy();
    });

    testLibJestUtils.fireEvent.click(getByText('Delete'));

    await testLibJestUtils.waitFor(() => {
      expect(getByText('Delete Item')).toBeTruthy();
    });

    testLibJestUtils.fireEvent.click(getByText('Submit'));

    const result = await deleteCustomer(1);

    expect(result).toEqual({ success: true });
  });

  it('calls delete customer with data null', async () => {
    (deleteCustomer as jest.Mock).mockResolvedValue(null);

    const { getAllByTestId, getByText } = renderComponent();

    testLibJestUtils.fireEvent.click(getAllByTestId('actions-btn')[0]);

    await testLibJestUtils.waitFor(() => {
      expect(getByText('Delete')).toBeTruthy();
    });

    testLibJestUtils.fireEvent.click(getByText('Delete'));

    await testLibJestUtils.waitFor(() => {
      expect(getByText('Delete Item')).toBeTruthy();
    });

    testLibJestUtils.fireEvent.click(getByText('Submit'));

    const result = await deleteCustomer(1);

    expect(result).toBeNull();
  });

  it('calls delete customer failed', async () => {
    (deleteCustomer as jest.Mock).mockResolvedValue({
      error: MESSAGES.ERROR.UNKNOWN_ERROR,
    });

    const { getAllByTestId, getByText } = renderComponent();

    testLibJestUtils.fireEvent.click(getAllByTestId('actions-btn')[0]);

    await testLibJestUtils.waitFor(() => {
      expect(getByText('Delete')).toBeTruthy();
    });

    testLibJestUtils.fireEvent.click(getByText('Delete'));

    await testLibJestUtils.waitFor(() => {
      expect(getByText('Delete Item')).toBeTruthy();
    });

    testLibJestUtils.fireEvent.click(getByText('Submit'));

    const result = await deleteCustomer(1);

    expect(result).toEqual({ error: MESSAGES.ERROR.UNKNOWN_ERROR });
  });

  it('calls handle sort with asc', async () => {
    const { getAllByTestId } = renderComponent();

    await testLibJestUtils.waitFor(() => {
      testLibJestUtils.fireEvent.click(getAllByTestId('sort-btn')[0]);
    });

    expect(mockReplace).toHaveBeenCalled();
  });

  it('calls handle sort with desc', async () => {
    const { getAllByTestId } = renderComponent({ order: ORDER.DESC });

    await testLibJestUtils.waitFor(() => {
      testLibJestUtils.fireEvent.click(getAllByTestId('sort-btn')[0]);
    });

    expect(mockReplace).toHaveBeenCalled();
  });
});
