// UI
import InvoiceDetailsSection from '../section';

// Mocks
import { MOCK_INVOICE_DETAILS } from '@/mocks';

// Apis
import { getInvoiceById } from '@/api';

jest.mock('@/api', () => ({
  ...jest.requireActual('@/api'),
  getInvoiceById: jest.fn(),
}));

describe('Invoice details', () => {
  it('should match snapshot', async () => {
    (getInvoiceById as jest.Mock).mockResolvedValue(MOCK_INVOICE_DETAILS);

    const { container } = testLibJestUtils.render(
      await InvoiceDetailsSection({ id: 4 }),
    );

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with notFound', async () => {
    (getInvoiceById as jest.Mock).mockResolvedValue({ data: null });

    await expect(InvoiceDetailsSection({ id: 4 })).rejects.toThrow(
      'NEXT_NOT_FOUND',
    );
  });
});
