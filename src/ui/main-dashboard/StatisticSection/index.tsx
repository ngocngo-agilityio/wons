// Icons
import { FaHeart, FaShoppingBag } from 'react-icons/fa';
import { IoGameControllerSharp } from 'react-icons/io5';
import { MdWork } from 'react-icons/md';

// Components
import { StatisticCard, NoProductAvailable } from '@/components';

// apis
import { getAllStatistics } from '@/api';

const StatisticSection = async () => {
  const { data: statisticsData = [] } = await getAllStatistics();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8">
      {statisticsData?.length ? (
        statisticsData
          .map((stat) => [
            {
              value: `${stat.favoriteServices}+`,
              label: 'Favorite',
              icon: <FaHeart className="h-5 w-5 text-[#605cf8]" />,
              lightBgColor: 'bg-gray-50',
              darkBgColor: 'dark:bg-[#4a5463]',
            },
            {
              value: `${stat.newSales}+`,
              label: 'New Sales',
              icon: <IoGameControllerSharp className="h-5 w-5 text-teal-500" />,
              lightBgColor: 'bg-[#ceeeec]',
              darkBgColor: 'dark:bg-[#366263]',
            },
            {
              value: `${stat.newLeads}+`,
              label: 'New Leads',
              icon: <FaShoppingBag className="h-5 w-5 text-pink-500" />,
              lightBgColor: 'bg-[#fff0f8]',
              darkBgColor: 'dark:bg-[#4a455c]',
            },
            {
              value: `${stat.referrals}+`,
              label: 'Referral',
              icon: <MdWork className="h-5 w-5 text-[#605cf8]" />,
              lightBgColor: 'bg-gray-50',
              darkBgColor: 'dark:bg-[#4a5463]',
            },
          ])
          .flat()
          .map((stat, index) => {
            const hasBorder = index < statisticsData.length - 1;
            return (
              <div key={index} className="w-full">
                <StatisticCard
                  statistic={stat.value}
                  label={stat.label}
                  icon={stat.icon}
                  lightBgColor={stat.lightBgColor}
                  darkBgColor={stat.darkBgColor}
                />
                {hasBorder && (
                  <div className="border-t border-gray-300 dark:border-gray-600 my-8" />
                )}
              </div>
            );
          })
      ) : (
        <NoProductAvailable message="No statistics available at the moment" />
      )}
    </div>
  );
};

export default StatisticSection;
