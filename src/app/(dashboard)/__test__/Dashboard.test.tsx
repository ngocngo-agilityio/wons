// Mocks
import { MOCK_INVOICES, MOCK_PRODUCTS_WITH_STRAPI_MODEL } from '@/mocks';

// Page
import DashboardPage from '../page';

jest.mock('react-scan', () => ({
  scan: jest.fn(() => {}),
}));

jest.mock('@/api', () => ({
  ...jest.requireActual('@/api'),
  getInvoiceProducts: jest.fn(() => ({
    data: MOCK_INVOICES,
  })),
  getAllStatistics: jest.fn(() => ({
    data: [
      {
        favoriteServices: 5,
        newSales: 10,
        newLeads: 15,
        referrals: 20,
      },
    ],
  })),
  getAllProducts: jest.fn(() => ({
    data: MOCK_PRODUCTS_WITH_STRAPI_MODEL,
  })),
}));

describe('dashboard page', () => {
  const renderPage = (props?: Record<string, null>) =>
    testLibJestUtils.render(
      <DashboardPage
        searchParams={{
          sortBy: '',
          order: '',
          startTime: '',
          endTime: '',
        }}
        {...props}
      />,
    );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should match snapshot', async () => {
    const { container } = renderPage();

    await testLibJestUtils.waitFor(() => {
      expect(container).toMatchSnapshot();
    });
  });
});
