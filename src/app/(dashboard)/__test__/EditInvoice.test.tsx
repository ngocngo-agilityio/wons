import { render, waitFor } from '@testing-library/react';

import EditInvoicePage from '@/app/(dashboard)/edit-invoice/page';

jest.mock('@/ui', () => ({
  EditInvoice: () => <div data-testid="edit-invoice">Edit Invoice</div>,
}));

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  notFound: jest.fn(),
}));

jest.mock('react-scan', () => ({
  scan: jest.fn(() => {}),
}));

describe('Edit Invoice Page render', () => {
  it('should render and match with snapshot', async () => {
    const { container } = render(
      await EditInvoicePage({ searchParams: { id: 1 } }),
    );

    await waitFor(() => {
      expect(container).toBeInTheDocument();
    });

    expect(container).toMatchSnapshot();
  });
});
