import AccountSuccessPage from '../account-success/page';

jest.mock('react-scan', () => ({
  scan: jest.fn(() => {}),
}));

describe('Account success page', () => {
  it('match snapshot', () => {
    const { container } = testLibJestUtils.render(<AccountSuccessPage />);

    expect(container).toMatchSnapshot();
  });
});
