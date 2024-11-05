// Components
import SidebarFooter from '../index';

// Types
import { Role } from '@/types';

// Mocks
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({
    data: {
      user: {
        role: {
          id: 3,
        },
      },
    },
  })),
}));

describe('SidebarFooter', () => {
  const onLogoutMock = jest.fn();

  const renderComponent = () =>
    testLibJestUtils.render(
      <SidebarFooter
        toggle="open"
        avatar="https://www.w3schools.com/howto/img_avatar.png"
        fullName="Super Admin"
        role={Role.Admin}
        onLogout={onLogoutMock}
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
});
