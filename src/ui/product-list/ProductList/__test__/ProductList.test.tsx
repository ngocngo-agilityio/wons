import ProductList from '..';

describe('Product list', () => {
  it('should match snapshot', async () => {
    const { container } = testLibJestUtils.render(
      await ProductList({
        searchParams: {
          sortBy: 'title',
          order: 'desc',
          startTime: '',
          endTime: '',
        },
      }),
    );

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with search params is undefined', async () => {
    const { container } = testLibJestUtils.render(
      await ProductList({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        searchParams: null as any,
      }),
    );

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with sortBy is not title', async () => {
    const { container } = testLibJestUtils.render(
      await ProductList({
        searchParams: {
          sortBy: 'test',
          order: 'desc',
          startTime: '',
          endTime: '',
        },
      }),
    );

    expect(container).toMatchSnapshot();
  });
});
