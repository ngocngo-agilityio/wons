// Api
import { getCustomers, getInvoiceById, getProducts } from '@/api';

// Mocks
import {
  MOCK_PRODUCTS_WITH_STRAPI_MODEL,
  CUSTOMER_MOCK,
  MOCK_INVOICES_WITH_CUSTOMER,
} from '@/mocks';

// UI
import { EditInvoice } from '@/ui';

jest.mock('react-scan', () => ({
  scan: jest.fn(() => {}),
}));

jest.mock('@/api', () => ({
  ...jest.requireActual('@/api'),
  getProducts: jest.fn(),
  getCustomers: jest.fn(),
  getInvoiceById: jest.fn(),
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

describe('EditInvoice Component Test', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render all content with resolved data and match snapshot', async () => {
    (getProducts as jest.Mock).mockResolvedValue({
      data: MOCK_PRODUCTS_WITH_STRAPI_MODEL,
    });

    (getCustomers as jest.Mock).mockResolvedValue({
      data: CUSTOMER_MOCK,
    });

    (getInvoiceById as jest.Mock).mockResolvedValue({
      data: {
        ...MOCK_INVOICES_WITH_CUSTOMER[0],
        data: MOCK_INVOICES_WITH_CUSTOMER,
      },
    });

    const { container } = testLibJestUtils.render(
      await EditInvoice({
        id: 1,
      }),
    );

    await testLibJestUtils.waitFor(() => {
      expect(container).toMatchSnapshot();
    });
  });

  it('match snapshot with data null', async () => {
    (getProducts as jest.Mock).mockResolvedValue({
      data: null,
    });

    (getCustomers as jest.Mock).mockResolvedValue({
      data: null,
    });

    (getInvoiceById as jest.Mock).mockResolvedValue({
      data: null,
    });

    const { container } = testLibJestUtils.render(
      await EditInvoice({
        id: 1,
      }),
    );

    await testLibJestUtils.waitFor(() => {
      expect(container).toMatchSnapshot();
    });
  });
});
