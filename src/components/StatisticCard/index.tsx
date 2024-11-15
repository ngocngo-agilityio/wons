import { Card } from '@nextui-org/react';

import { memo, ReactNode } from 'react';

// components
import { Text } from '@/components';

interface StatisticCardProps {
  statistic: string;
  label: string;
  icon: ReactNode;
  lightBgColor: string;
  darkBgColor: string;
}

const StatisticCard = ({
  statistic,
  label,
  icon,
  lightBgColor,
  darkBgColor,
}: StatisticCardProps) => (
  <Card className="p-2 sm:p-4 xl:p-8 2xl:py-10 2xl:px-8 bg-white rounded-10 dark:bg-gray-400">
    <div className="flex items-center flex-wrap">
      <div
        className={`mr-2 sm:mr-4 rounded-full flex items-center justify-center w-[50px] sm:w-[63px] h-[50px] sm:h-[63px] min-w-[40px] sm:min-w-[50px] ${lightBgColor} ${darkBgColor}`}
        style={{
          width: '60px',
          height: '60px',
          minWidth: '45px',
        }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <Text
          text={statistic}
          textColor="text-blue-400 dark:text-gray-850"
          className="font-bold text-[14px] sm:text-[18px] lg:text-[16px] xl:text-[24.06px] leading-[31.33px]"
        />
        <Text
          text={label}
          textColor="text-blue-400 dark:text-gray-850"
          customSize="text-[15.02px]"
          className=" w-full truncate overflow-hidden whitespace-nowrap leading-[19.56px]"
        />
      </div>
    </div>
  </Card>
);

export default memo(StatisticCard);
