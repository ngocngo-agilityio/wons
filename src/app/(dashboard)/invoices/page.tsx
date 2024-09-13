// Layouts
import { DashBoardLayout } from '@/layouts';

// Sections
import { InvoiceList, InvoiceListActions } from '@/ui';

const InvoiceListPage = (): JSX.Element => (
  <main>
    <DashBoardLayout title="Invoice List" rightContent={<InvoiceListActions />}>
      <InvoiceList />
    </DashBoardLayout>
  </main>
);

export default InvoiceListPage;