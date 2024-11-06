// Pages
import { httpClient } from '@/services';
import InvoiceDetailsPage, { generateMetadata } from '../invoices/[id]/page';
import { ResolvingMetadata } from 'next';
import { MOCK_INVOICES_WITH_CUSTOMER } from '@/mocks';

jest.mock('@/layouts', () => ({
  DashBoardLayout: () => <div>DashBoardLayout</div>,
}));

jest.mock('@/services', () => ({
  httpClient: {
    getRequest: jest.fn(),
  },
}));

describe('InvoiceDetails', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return correct metadata', async () => {
    const mockResponse = {
      data: {
        attributes: {
          imageUrl: 'http://example.com/image.jpg',
          customer: {
            data: {
              attributes: {
                fullName: 'John Doe',
              },
            },
          },
          invoiceId: '12345',
        },
      },
    };

    (httpClient.getRequest as jest.Mock).mockResolvedValue(mockResponse);

    const parent = Promise.resolve({
      openGraph: { images: [] },
    }) as unknown as ResolvingMetadata;

    const metadata = await generateMetadata({ params: { id: 1 } }, parent);

    expect(metadata).toEqual({
      title: 'Invoice ID: 12345',
      description: 'John Doe invoice details about id, products, title,...',
      openGraph: {
        images: ['http://example.com/image.jpg'],
        title: 'Invoice ID: 12345',
        description: 'John Doe invoice details about id, products, title,...',
      },
    });
  });

  it('should return incorrect metadata', async () => {
    (httpClient.getRequest as jest.Mock).mockResolvedValue(
      MOCK_INVOICES_WITH_CUSTOMER[0],
    );

    const parent = Promise.resolve({
      openGraph: { images: null },
    }) as unknown as ResolvingMetadata;

    const metadata = await generateMetadata({ params: { id: 1 } }, parent);

    expect(metadata).toEqual({
      title: `Invoice ID: undefined`,
      description: `undefined invoice details about id, products, title,...`,
      openGraph: {
        images: [undefined],
        title: `Invoice ID: undefined`,
        description: `undefined invoice details about id, products, title,...`,
      },
    });
  });

  it('should match snapshot', async () => {
    const page = testLibJestUtils.render(
      <InvoiceDetailsPage params={{ id: 10 }} />,
    );

    expect(page).toMatchSnapshot();
  });
});
