// Components
import UserDetailContainer from '..';

// Mocks
import { MOCK_AUTH } from '@/mocks';
import { useSession } from 'next-auth/react';

jest.mock('@/configs', () => ({
  auth: jest.fn(),
}));

jest.mock('@/actions', () => ({
  updateUser: jest.fn(),
}));

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

describe('UserDetailContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('match snapshot', async () => {
    (useSession as jest.Mock).mockReturnValue({ data: MOCK_AUTH[0] });
    const { container } = testLibJestUtils.render(<UserDetailContainer />);

    expect(container).toMatchSnapshot();
  });

  it('match snapshot with data null', async () => {
    (useSession as jest.Mock).mockReturnValue({ data: null });
    const { container } = testLibJestUtils.render(<UserDetailContainer />);

    expect(container).toMatchSnapshot();
  });
});
