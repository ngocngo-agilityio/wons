// UI
import InvoiceListClient, { TInvoiceListClientProps } from '../index';

// Mocks
import { MOCK_INVOICES_WITH_CUSTOMER } from '@/mocks';

// Constants
import { MESSAGES, ORDER } from '@/constants';

// Actions
import { deleteInvoice, deleteMultipleInvoice, updateInvoice } from '@/actions';
import { waitFor } from '@testing-library/react';

jest.mock('@/actions', () => ({
  ...jest.requireActual('@/actions'),
  updateInvoice: jest.fn(),
  deleteInvoice: jest.fn(),
  deleteMultipleInvoice: jest.fn(),
}));

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

describe('InvoiceListClient section', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (props?: Partial<TInvoiceListClientProps>) =>
    testLibJestUtils.render(
      <InvoiceListClient
        invoiceList={MOCK_INVOICES_WITH_CUSTOMER}
        pageCount={1}
        {...props}
      />,
    );

  it('should match with snapshot', async () => {
    const { container } = renderComponent();

    container
      .querySelector('th.bg-gray-50')
      ?.setAttribute('data-key', 'row-header-column-tjima90t7ui');

    container
      .querySelector('th.bg-gray-50')
      ?.setAttribute('id', 'react-aria-:r0:-row-header-column-tjima90t7ui');

    await waitFor(() => {
      expect(container).toMatchSnapshot();
    });
  });

  it('should show a success message when select invoice successfully.', async () => {
    (updateInvoice as jest.MockedFn<typeof updateInvoice>).mockResolvedValue();
    const { getAllByTestId } = renderComponent();

    testLibJestUtils.fireEvent.click(getAllByTestId('star-btn')[0]);

    testLibJestUtils.waitFor(() =>
      expect(mockShowToast).toHaveBeenCalledWith({
        description: MESSAGES.SUCCESS.DELETE_INVOICE,
        status: MESSAGES.STATUS.SUCCESS,
      }),
    );
  });

  it('should show a error message when select invoice failed.', async () => {
    (updateInvoice as jest.MockedFn<typeof updateInvoice>).mockResolvedValue({
      error: MESSAGES.ERROR.UPDATE_INVOICE,
    });
    const { getAllByTestId } = renderComponent();

    testLibJestUtils.fireEvent.click(getAllByTestId('star-btn')[0]);

    testLibJestUtils.waitFor(() => expect(mockShowToast).toHaveBeenCalled());
  });

  it('should call replace when handling sort descending', async () => {
    const { getAllByTestId } = renderComponent();

    testLibJestUtils.fireEvent.click(getAllByTestId('sort-btn')[0]);

    expect(mockReplace).toHaveBeenCalled();
  });

  it('should call replace when handling sort descending', async () => {
    const { getAllByTestId } = renderComponent({ sortOrder: ORDER.DESC });

    testLibJestUtils.fireEvent.click(getAllByTestId('sort-btn')[0]);

    expect(mockReplace).toHaveBeenCalled();
  });

  it('should show a success message when delete invoice successfully.', async () => {
    (deleteInvoice as jest.MockedFn<typeof deleteInvoice>).mockResolvedValue();
    const { getAllByTestId, getByText } = renderComponent();

    // Open the delete confirm modal
    testLibJestUtils.fireEvent.click(getAllByTestId('actions-btn')[0]);
    testLibJestUtils.fireEvent.click(getByText('Delete'));

    await testLibJestUtils.waitFor(() =>
      expect(getByText('Delete Item')).toBeInTheDocument(),
    );

    // Click confirm delete invoice
    testLibJestUtils.fireEvent.click(getByText('Submit'));

    testLibJestUtils.waitFor(() =>
      expect(mockShowToast).toHaveBeenCalledWith({
        description: MESSAGES.SUCCESS.DELETE_INVOICE,
        status: MESSAGES.STATUS.SUCCESS,
      }),
    );
  });

  it('should show a error message when delete invoice failed.', async () => {
    (deleteInvoice as jest.MockedFn<typeof deleteInvoice>).mockResolvedValue({
      error: MESSAGES.ERROR.DELETE_INVOICE,
    });
    const { getAllByTestId, getByText } = renderComponent();

    // Open the delete confirm modal
    testLibJestUtils.fireEvent.click(getAllByTestId('actions-btn')[0]);
    testLibJestUtils.fireEvent.click(getByText('Delete'));

    await testLibJestUtils.waitFor(() =>
      expect(getByText('Delete Item')).toBeInTheDocument(),
    );

    // Click confirm delete invoice
    testLibJestUtils.fireEvent.click(getByText('Submit'));

    testLibJestUtils.waitFor(() =>
      expect(mockShowToast).toHaveBeenCalledWith({
        description: MESSAGES.ERROR.DELETE_INVOICE,
        status: MESSAGES.STATUS.ERROR,
      }),
    );
  });

  it('calls edit invoice', () => {
    const { getAllByTestId, getByText } = renderComponent();

    testLibJestUtils.fireEvent.click(getAllByTestId('actions-btn')[0]);
    testLibJestUtils.fireEvent.click(getByText('Edit'));

    expect(mockPush).toHaveBeenCalled();
  });

  it('calls delete multiple invoices successfully', async () => {
    (
      deleteMultipleInvoice as jest.MockedFn<typeof deleteMultipleInvoice>
    ).mockResolvedValue();
    const { container, getByTestId, getByText } = renderComponent();

    testLibJestUtils.fireEvent.click(
      container.querySelector('[aria-label="Select All"]') as Element,
    );
    testLibJestUtils.fireEvent.click(getByTestId('multiple-delete-btn'));

    await testLibJestUtils.waitFor(() =>
      expect(getByText('Delete Item')).toBeInTheDocument(),
    );

    // Click confirm delete invoice
    testLibJestUtils.fireEvent.click(getByText('Submit'));

    testLibJestUtils.waitFor(() =>
      expect(mockShowToast).toHaveBeenCalledWith({
        description: MESSAGES.SUCCESS.DELETE_INVOICE,
        status: MESSAGES.STATUS.SUCCESS,
      }),
    );
  });

  it('calls delete multiple invoices failed', async () => {
    (
      deleteMultipleInvoice as jest.MockedFn<typeof deleteMultipleInvoice>
    ).mockResolvedValue({
      error: MESSAGES.ERROR.UNKNOWN_ERROR,
    });
    const { container, getByTestId, getByText } = renderComponent();

    testLibJestUtils.fireEvent.click(
      container.querySelector('[aria-label="Select All"]') as Element,
    );
    testLibJestUtils.fireEvent.click(getByTestId('multiple-delete-btn'));

    await testLibJestUtils.waitFor(() =>
      expect(getByText('Delete Item')).toBeInTheDocument(),
    );

    // Click confirm delete invoice
    testLibJestUtils.fireEvent.click(getByText('Submit'));

    testLibJestUtils.waitFor(() =>
      expect(mockShowToast).toHaveBeenCalledWith({
        description: MESSAGES.ERROR.UNKNOWN_ERROR,
        status: MESSAGES.STATUS.ERROR,
      }),
    );
  });
});
