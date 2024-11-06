// UI
import ScheduleListActions from '..';

describe('Schedule list actions', () => {
  it('match snapshot', async () => {
    const { container } = testLibJestUtils.render(await ScheduleListActions());

    expect(container).toMatchSnapshot();
  });
});
