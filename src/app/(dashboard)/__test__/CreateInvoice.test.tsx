import { render, waitFor } from '@testing-library/react';

// Pages
import CreateInvoicePage from '@/app/(dashboard)/create-invoice/page';

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  notFound: jest.fn(),
}));

jest.mock('react-scan', () => ({
  scan: jest.fn(() => {}),
}));

describe('CreateInvoice Page render', () => {
  it('should render and match with snapshot', async () => {
    const { container } = render(await CreateInvoicePage());

    await waitFor(() => {
      expect(container).toBeInTheDocument();
    });

    expect(container).toMatchSnapshot();
  });
});
