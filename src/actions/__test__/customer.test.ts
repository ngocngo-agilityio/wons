import { revalidateTag } from 'next/cache';

// services
import { httpClient } from '@/services';

// utils
import { formatErrorMessage } from '@/utils';

// constants
import { API_PATH } from '@/constants';

// models
import { ICustomer } from '@/models';

// Mocks
import { MOCK_INVOICES_WITH_CUSTOMER } from '@/mocks';

// actions
import {
  createCustomer,
  deleteCustomer,
  updateCustomer,
} from '@/actions/customer';

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

describe('createCustomer', () => {
  const MOCK_API_PATH = API_PATH.CUSTOMERS;

  const CUSTOMER_FORM_DATA_MOCK: Partial<ICustomer> = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '1234567890',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new customer successfully', async () => {
    (httpClient.genericRequest as jest.Mock).mockResolvedValue({
      data: {
        id: 1,
        ...CUSTOMER_FORM_DATA_MOCK,
      },
    });

    const result = await createCustomer(CUSTOMER_FORM_DATA_MOCK);

    expect(httpClient.genericRequest).toHaveBeenCalledWith({
      method: Method.Post,
      endpoint: MOCK_API_PATH,
      body: {
        data: {
          ...CUSTOMER_FORM_DATA_MOCK,
          fullName: `${CUSTOMER_FORM_DATA_MOCK.firstName} ${CUSTOMER_FORM_DATA_MOCK.lastName}`,
        },
      },
    });

    expect(revalidateTag).toHaveBeenCalledWith(MOCK_API_PATH);
    expect(result).toEqual({ success: true });
  });

  it('should return an error message when creating a customer fails', async () => {
    const MOCK_ERROR = new Error('Request failed');
    (httpClient.genericRequest as jest.Mock).mockRejectedValue(MOCK_ERROR);
    (formatErrorMessage as jest.Mock).mockReturnValue('Something went wrong.');

    const result = await createCustomer(CUSTOMER_FORM_DATA_MOCK);

    expect(httpClient.genericRequest).toHaveBeenCalledWith({
      method: Method.Post,
      endpoint: MOCK_API_PATH,
      body: {
        data: {
          ...CUSTOMER_FORM_DATA_MOCK,
          fullName: `${CUSTOMER_FORM_DATA_MOCK.firstName} ${CUSTOMER_FORM_DATA_MOCK.lastName}`,
        },
      },
    });

    expect(formatErrorMessage).toHaveBeenCalledWith(MOCK_ERROR);
    expect(result).toEqual({ error: 'Something went wrong.' });
    expect(revalidateTag).not.toHaveBeenCalled();
  });
});

describe('deleteCustomer', () => {
  const customerID = MOCK_INVOICES_WITH_CUSTOMER[0].attributes.customer.data.id;
  const invoiceID = MOCK_INVOICES_WITH_CUSTOMER[0].id;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls success', async () => {
    (httpClient.getRequest as jest.Mock).mockResolvedValue({
      data: MOCK_INVOICES_WITH_CUSTOMER,
    });
    (httpClient.genericRequest as jest.Mock).mockResolvedValue({
      endpoint: `${API_PATH.INVOICES}/${invoiceID}`,
    });
    (httpClient.genericRequest as jest.Mock).mockResolvedValue({
      endpoint: `${API_PATH.CUSTOMERS}/${customerID}`,
    });

    const result = await deleteCustomer(
      MOCK_INVOICES_WITH_CUSTOMER[0].attributes.customer.data.id,
    );

    expect(httpClient.genericRequest).toHaveBeenCalledWith({
      method: Method.Delete,
      endpoint: `${API_PATH.INVOICES}/${invoiceID}`,
    });
    expect(httpClient.genericRequest).toHaveBeenCalledWith({
      method: Method.Delete,
      endpoint: `${API_PATH.CUSTOMERS}/${customerID}`,
    });

    expect(revalidateTag).toHaveBeenCalledWith(API_PATH.CUSTOMERS);
    expect(revalidateTag).toHaveBeenCalledWith(API_PATH.INVOICES);
    expect(result).toEqual({ success: true });
  });

  it('calls failed', async () => {
    const MOCK_ERROR = new Error('Request failed');
    (httpClient.getRequest as jest.Mock).mockResolvedValue({
      data: undefined,
    });
    (httpClient.genericRequest as jest.Mock).mockRejectedValue(MOCK_ERROR);
    (formatErrorMessage as jest.Mock).mockReturnValue('Something went wrong.');

    const result = await deleteCustomer(customerID);

    expect(revalidateTag).not.toHaveBeenCalled();
    expect(result).toEqual({ error: 'Something went wrong.' });
  });
});

describe('updateCustomer', () => {
  const newData = { email: 'test@gmai.com' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully update customer', async () => {
    const MOCK_RESPONSE = {
      id: 4,
      attributes: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@gmai.com',
        phone: '1234567890',
      },
    };

    (httpClient.genericRequest as jest.Mock).mockResolvedValue(MOCK_RESPONSE);

    await updateCustomer(1, newData);

    expect(httpClient.genericRequest).toHaveBeenCalledTimes(1);
  });

  it('should return an error with formatted message when update customer fails', async () => {
    const MOCK_ERROR = new Error('Request failed');
    const FORMATTED_ERROR_MESSAGE = 'Something went wrong.';

    (httpClient.genericRequest as jest.Mock).mockRejectedValue(MOCK_ERROR);

    (formatErrorMessage as jest.Mock).mockReturnValue(FORMATTED_ERROR_MESSAGE);

    const result = await updateCustomer(1, newData);

    expect(result).toEqual({ error: FORMATTED_ERROR_MESSAGE });
    expect(httpClient.genericRequest).toHaveBeenCalled();
    expect(formatErrorMessage).toHaveBeenCalledWith(MOCK_ERROR);
  });
});
