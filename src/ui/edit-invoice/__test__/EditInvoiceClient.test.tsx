// Mocks
import { MOCK_INVOICES_WITH_CUSTOMER } from '@/mocks';

// Actions
import EditInvoiceClient from '../EditInvoiceClient';

const mockShowToast = jest.fn();
jest.mock('@/hooks', () => ({
  ...jest.requireActual('@/hooks'),
  useToast: () => ({ showToast: mockShowToast }),
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

describe('EditInvoiceClient section', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockOnEditInvoice = jest.fn();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderComponent = (props?: any) =>
    testLibJestUtils.render(
      <EditInvoiceClient
        invoice={{
          id: MOCK_INVOICES_WITH_CUSTOMER[0].id,
          ...MOCK_INVOICES_WITH_CUSTOMER[0].attributes,
          customerId:
            MOCK_INVOICES_WITH_CUSTOMER[0].attributes.customer.data.id.toString(),
        }}
        invoiceProducts={[
          {
            id: 6,
            price: 1000,
            quantity: 1,
            product: {
              data: {
                id: 3,
                price: 1000,
                createdAt: '2024-09-09T07:45:09.821Z',
                updatedAt: '2024-09-23T02:53:33.888Z',
                publishedAt: '2024-09-10T04:14:34.734Z',
                rating: 2,
                title: 'Samsung A13',
                imageUrl:
                  'https://img.freepik.com/free-photo/organic-cosmetic-product-with-dreamy-aesthetic-fresh-background_23-2151382816.jpg',
                brand: 'Samsung',
                negotiable: true,
                description:
                  "Discover Samsung's newest creation, combining innovation with cutting-edge technology. Experience the future with enhanced performance and sleek design.",
              },
            },
          },
        ]}
        customers={[]}
        products={[]}
        onEditInvoice={mockOnEditInvoice}
        {...props}
      />,
    );

  it('should match with snapshot', async () => {
    const { container } = renderComponent();

    await testLibJestUtils.act(async () => {
      expect(container).toMatchSnapshot();
    });
  });

  it('should match with snapshot with invoice is null', async () => {
    const { container } = renderComponent({
      invoice: {
        id: MOCK_INVOICES_WITH_CUSTOMER[0].id,
        ...MOCK_INVOICES_WITH_CUSTOMER[0].attributes,
        customerId:
          MOCK_INVOICES_WITH_CUSTOMER[0].attributes.customer.data.id.toString(),
        invoiceId: null,
      },
    });

    await testLibJestUtils.act(async () => {
      expect(container).toMatchSnapshot();
    });
  });

  it('calls edit', async () => {
    mockOnEditInvoice.mockResolvedValue({
      error: '',
      success: true,
    });
    const { getByLabelText, getByTestId, getByText } = renderComponent();

    testLibJestUtils.fireEvent.change(getByLabelText('Email'), {
      target: {
        value: `${MOCK_INVOICES_WITH_CUSTOMER[0].attributes.email}.vn`,
      },
    });

    await testLibJestUtils.waitFor(() => {
      expect(getByText('Update Invoice')).toBeEnabled();
    });

    await testLibJestUtils.waitFor(() => {
      testLibJestUtils.fireEvent.submit(getByTestId('invoice-form'));
    });

    expect(mockOnEditInvoice).toHaveBeenCalled();
  });
});
