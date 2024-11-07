import '@testing-library/jest-dom';
import CustomerDrawer from '..';

describe('CustomerDrawer', () => {
  it('matches snapshot', () => {
    const { container } = testLibJestUtils.render(<CustomerDrawer />);
    expect(container).toMatchSnapshot();
  });

  it('opens the drawer when the button is clicked', () => {
    const { getAllByRole, getByRole } = testLibJestUtils.render(
      <CustomerDrawer />,
    );
    const buttons = getAllByRole('button', { name: 'Add Customer' });
    const button = buttons[0];
    testLibJestUtils.fireEvent.click(button);
    expect(getByRole('heading', { name: 'Add Customer' })).toBeInTheDocument();
  });

  it('closes the drawer when the close button is clicked', async () => {
    const { getAllByRole, getByTestId, queryByTestId } =
      testLibJestUtils.render(<CustomerDrawer />);
    const buttons = getAllByRole('button', { name: 'Add Customer' });
    const addButton = buttons[0];
    testLibJestUtils.fireEvent.click(addButton);

    const closeButton = getByTestId('close-button');
    expect(queryByTestId('customer-drawer')).toBeInTheDocument();

    testLibJestUtils.fireEvent.click(closeButton);
    const getIdCustomerDrawer = queryByTestId('customer-drawer');

    await testLibJestUtils.waitFor(() => {
      expect(getIdCustomerDrawer).not.toBeInTheDocument();
    });
  });
});
