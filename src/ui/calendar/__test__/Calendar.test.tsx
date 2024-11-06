import Calendar from '..';

describe('Calendar', () => {
  it('should match snapshot', async () => {
    const { container } = testLibJestUtils.render(await Calendar());

    expect(container).toMatchSnapshot();
  });
});
