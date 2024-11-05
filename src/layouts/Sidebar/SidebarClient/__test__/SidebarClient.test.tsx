import { screen, fireEvent } from '@testing-library/react';

// Mocks
import { MOCK_DEFAULT_AVATAR } from '@/mocks';

// Components
import SidebarClient from '../index';

// Types
import { Role } from '@/types';

describe('SidebarClient', () => {
  const renderComponent = () =>
    testLibJestUtils.render(
      <SidebarClient
        avatar={MOCK_DEFAULT_AVATAR}
        fullName="Super Admin"
        role={Role.Admin}
      />,
    );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should match snapshot', () => {
    const { container } = renderComponent();

    expect(container).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('is sidebar closed', () => {
    // Update initial sidebarState in localStorage
    localStorage.setItem('showSidebar', 'open');

    renderComponent();

    const toggleSidebarButton = screen.getByRole('button', {
      name: /toggle sidebar/i,
    });

    fireEvent.click(toggleSidebarButton);

    const sidebarState = localStorage.getItem('showSidebar');

    expect(sidebarState).toEqual('closed');
  });

  it('is sidebar open', () => {
    // Update initial sidebarState in localStorage
    localStorage.setItem('showSidebar', 'closed');

    renderComponent();

    const toggleSidebarButton = screen.getByRole('button', {
      name: /toggle sidebar/i,
    });

    fireEvent.click(toggleSidebarButton);

    const sidebarState = localStorage.getItem('showSidebar');

    expect(sidebarState).toEqual('open');
  });
});
