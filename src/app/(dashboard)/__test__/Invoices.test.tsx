// Pages
import InvoiceListPage from '@/app/(dashboard)/invoices/page';

// Types
import { ISearchParams } from '@/types';

jest.mock('@/layouts', () => ({
  DashBoardLayout: () => <div>DashBoardLayout</div>,
}));

jest.mock('react-scan', () => ({
  scan: jest.fn(() => {}),
}));

describe('CustomerListPage render', () => {
  it('should render and match with snapshot', async () => {
    const { container } = testLibJestUtils.render(
      <InvoiceListPage searchParams={undefined as unknown as ISearchParams} />,
    );

    expect(container).toMatchSnapshot();
  });
});
