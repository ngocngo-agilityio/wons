// Mocks
import { MOCK_INVOICES } from '@/mocks';

// UI
import RecentServicesSection from '../index';

// Api
import { getInvoiceProducts } from '@/api';
import { MESSAGES } from '@/constants';
import RecentServicesSkeleton from '../RecentServicesSkeleton';

jest.mock('@/api', () => ({
  ...jest.requireActual('@/api'),
  getInvoiceProducts: jest.fn(),
}));

describe('RecentServicesSection', () => {
  const renderUI = async () =>
    testLibJestUtils.render(
      await RecentServicesSection({
        searchParams: {
          sortBy: 'title',
          order: '',
          startTime: '',
          endTime: '',
        },
      }),
    );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should match snapshot', async () => {
    (getInvoiceProducts as jest.Mock).mockResolvedValue({
      data: MOCK_INVOICES,
    });

    const { container } = await renderUI();

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with search params is undefined', async () => {
    (getInvoiceProducts as jest.Mock).mockResolvedValue({
      data: MOCK_INVOICES,
    });

    const { container } = testLibJestUtils.render(
      await RecentServicesSection({
        // TODO: I must to use any type to test null
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        searchParams: null as any,
      }),
    );

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with sortBy is not title', async () => {
    (getInvoiceProducts as jest.Mock).mockResolvedValue({
      data: MOCK_INVOICES,
    });

    const { container } = testLibJestUtils.render(
      await RecentServicesSection({
        // TODO: I must to use any type to test null
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        searchParams: {
          sortBy: 'test',
          order: '',
          startTime: '',
          endTime: '',
        },
      }),
    );

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with error', async () => {
    (getInvoiceProducts as jest.Mock).mockResolvedValue({
      error: MESSAGES.ERROR.UNKNOWN_ERROR,
    });

    const { container } = await renderUI();

    expect(container).toMatchSnapshot();
  });

  it('not found', async () => {
    (getInvoiceProducts as jest.Mock).mockResolvedValue({
      data: null,
    });

    await expect(renderUI()).rejects.toThrow('NEXT_NOT_FOUND');
  });
});

describe('skeleton', () => {
  it('should match snapshot', () => {
    const { container } = testLibJestUtils.render(<RecentServicesSkeleton />);

    expect(container).toMatchSnapshot();
  });
});
