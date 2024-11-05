import { screen } from '@testing-library/react';

// Libraries
import { usePathname } from 'next/navigation';

// Themes
import { colors } from '@/themes';

// Components
import NavigateList from '../index';

// Types
import { SidebarState } from '@/types';

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  usePathname: jest.fn(),
}));

jest.mock('next-themes', () => ({
  useTheme: jest.fn(() => ({ theme: 'light' })),
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

  it('should apply active color when pathname matches url', () => {
    (usePathname as jest.Mock).mockReturnValue('/customers');

    renderComponent();

    const customerIcon = screen.getByTestId('customer-icon');

    expect(customerIcon).toHaveStyle({ color: colors.purple[600] });
  });
});
