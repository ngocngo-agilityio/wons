import AccountSuccessPage from '../account-success/page';

describe('Account success page', () => {
  it('match snapshot', () => {
    const { container } = testLibJestUtils.render(<AccountSuccessPage />);

    expect(container).toMatchSnapshot();
  });
});
