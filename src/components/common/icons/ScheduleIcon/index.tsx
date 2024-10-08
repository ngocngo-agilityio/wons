import React, { SVGProps } from 'react';

// Themes
import { colors } from '@/themes';

interface IScheduleIcon extends SVGProps<SVGSVGElement> {
  color?: string;
  width?: number;
  height?: number;
}

const ScheduleIcon = ({
  color = colors.blue[800],
  width = 20,
  height = 20,
  ...props
}: IScheduleIcon) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    color={color}
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M4.81 0h8.381C16.28 0 18 1.78 18 4.83v10.33c0 3.1-1.72 4.84-4.809 4.84H4.81C1.77 20 0 18.26 0 15.16V4.83C0 1.78 1.77 0 4.81 0Zm.27 4.66v-.01h2.989c.431 0 .781.35.781.779 0 .441-.35.791-.781.791H5.08a.78.78 0 0 1 0-1.56Zm0 6.08h7.84a.781.781 0 0 0 0-1.561H5.08a.781.781 0 0 0 0 1.561Zm0 4.57h7.84c.399-.04.7-.381.7-.78 0-.41-.301-.75-.7-.79H5.08a.795.795 0 0 0-.75 1.21c.16.25.45.4.75.36Z"
      clipRule="evenodd"
    />
  </svg>
);
export default ScheduleIcon;
