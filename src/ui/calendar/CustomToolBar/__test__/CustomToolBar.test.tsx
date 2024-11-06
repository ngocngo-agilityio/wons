import { Views } from 'react-big-calendar';

// UI
import CustomToolBar from '..';

describe('CustomToolBar', () => {
  const renderComponent = (props?: Record<string, string>) =>
    testLibJestUtils.render(
      <CustomToolBar
        date={new Date('2024-11-05')}
        view={Views.WEEK}
        label="test"
        views={[]}
        localizer={{
          messages: {},
        }}
        onNavigate={jest.fn()}
        onView={jest.fn()}
        {...props}
      />,
    );

  it('should match snapshot with week', () => {
    const { container } = renderComponent();

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with month', () => {
    const { container } = renderComponent({
      view: Views.MONTH,
    });

    expect(container).toMatchSnapshot();
  });
});
