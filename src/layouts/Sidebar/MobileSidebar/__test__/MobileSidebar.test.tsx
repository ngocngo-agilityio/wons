import { useState } from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';

// Mocks
import { MOCK_DEFAULT_AVATAR } from '@/mocks';

// Components
import MobileSidebar from '../index';

// Types
import { Role } from '@/types';

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useRouter: jest.fn().mockImplementation(() => ({
    replace: jest.fn(),
  })),
  useSearchParams: jest.fn(() => ({
    get: () => () => 'John Deo',
  })),
  usePathname: jest.fn(),
}));

const MobileSidebarTestWrapper = () => {
  const [isToggleMobileSidebar, setIsToggleMobileSidebar] = useState(false);

  return (
    <MobileSidebar
      isToggleMobileSidebar={isToggleMobileSidebar}
      avatar={MOCK_DEFAULT_AVATAR}
      fullName="Super Admin"
      role={Role.Admin}
      onOutsideClick={() => {
        setIsToggleMobileSidebar(false);
      }}
      onToggleSidebar={() => setIsToggleMobileSidebar((prev) => !prev)}
    />
  );
};

describe('MobileSidebar', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('is render correctly', () => {
    const { container } = testLibJestUtils.render(<MobileSidebarTestWrapper />);

    expect(container).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('toggles sidebar state on click', async () => {
    testLibJestUtils.render(<MobileSidebarTestWrapper />);

    const mobileSidebar = await screen.findByTestId('mobile-sidebar-section');

    await waitFor(() =>
      expect(mobileSidebar).toHaveClass(
        'fixed top-0 duration-700 z-50 -left-60',
      ),
    );

    const toggleButton = await screen.findByRole('button', {
      name: /toggle sidebar/i,
    });

    fireEvent.click(toggleButton);

    await waitFor(() =>
      expect(mobileSidebar).toHaveClass('fixed top-0 duration-700 z-50 left-0'),
    );
  });
});
