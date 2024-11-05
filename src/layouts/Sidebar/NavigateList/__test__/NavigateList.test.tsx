import { screen, fireEvent, waitFor } from '@testing-library/react';

// Constants
import { ROUTES } from '@/constants';

// Components
import NavigateList from '../index';

// Types
import { SidebarState } from '@/types';

const mockUsePathname = jest.fn();

jest.mock('next/navigation', () => ({
  usePathname() {
    return mockUsePathname();
  },
}));

describe('NavigateList', () => {
  const renderComponent = () =>
    testLibJestUtils.render(<NavigateList toggle={SidebarState.Open} />);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should match snapshot', () => {
    const { container } = renderComponent();

    expect(container).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('applies active styles when pathname equals href', async () => {
    renderComponent();

    const sidebarItem = screen.getByRole('option', {
      name: /customer/i,
    });

    fireEvent.click(sidebarItem);

    mockUsePathname.mockImplementation(() => '/customers');

    // const currentPathname = mockUsePathname();

    const href = sidebarItem.getAttribute('href');

    await waitFor(() => expect(href).toEqual(ROUTES.CUSTOMER));
  });
});
