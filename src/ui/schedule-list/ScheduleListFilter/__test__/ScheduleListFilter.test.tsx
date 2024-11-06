import ScheduleListFilter from '..';

describe('Schedule list filter', () => {
  it('should match snapshot', async () => {
    const { container } = testLibJestUtils.render(await ScheduleListFilter());

    expect(container).toMatchSnapshot();
  });
});
