'use client';

import { memo, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Chip, Listbox, ListboxItem } from '@nextui-org/react';
import clsx from 'clsx';

// Themes
import { colors } from '@/themes';

// Constants
import { ROUTES, THEME_MODES } from '@/constants';

// Components
import {
  AiFillCustomerService,
  CalendarIcon,
  DashboardIcon,
  FaProductHunt,
  InvoiceIcon,
  MessageIcon,
  NotificationIcon,
  ScheduleIcon,
  SettingIcon,
} from '@/components/common';

// Types
import { SidebarState } from '@/types';

interface INavigateList {
  toggle?: string;
}

const NavigateList = ({ toggle = SidebarState.Open }: INavigateList) => {
  const pathname = usePathname();
  const { theme } = useTheme();
  const {
    CUSTOMER,
    PRODUCT,
    CALENDAR,
    DASHBOARD,
    INVOICE,
    MESSAGES,
    NOTIFICATION,
    SCHEDULE,
    SETTINGS,
  } = ROUTES;
  const { LIGHT, DARK } = THEME_MODES;
  const iconColor = {
    [DARK]: colors.white,
    [LIGHT]: colors.blue[800],
  };
  const isOpenSidebar = toggle === SidebarState.Open;
  const isClosedSidebar = toggle === SidebarState.Closed;

  const mappingIconColor = (url: string): Record<string, string | number> => {
    if (pathname === url) return { color: colors.purple[600], opacity: 1 };

    return { color: iconColor[theme as string], opacity: 0.4 };
  };

  const MAPPING_SIDEBAR_CONTENTS = useMemo(
    () => [
      {
        id: 'sb_dashboard',
        href: DASHBOARD,
        content: 'Dashboard',
        startContent: <DashboardIcon {...mappingIconColor(DASHBOARD)} />,
      },
      {
        id: 'sb_customer',
        href: CUSTOMER,
        content: 'Customer',
        startContent: (
          <AiFillCustomerService
            {...mappingIconColor(CUSTOMER)}
            className="w-5 h-5"
            data-testid="customer-icon"
          />
        ),
      },
      {
        id: 'sb_product',
        href: PRODUCT,
        content: 'Product',
        startContent: (
          <FaProductHunt {...mappingIconColor(PRODUCT)} className="w-5 h-5" />
        ),
      },
      {
        id: 'sb_invoice',
        href: INVOICE,
        content: 'Invoice',
        startContent: <InvoiceIcon {...mappingIconColor(INVOICE)} />,
      },
      {
        id: 'sb_schedule',
        href: SCHEDULE,
        content: 'Schedule',
        startContent: <ScheduleIcon {...mappingIconColor(SCHEDULE)} />,
      },
      {
        id: 'sb_calendar',
        href: CALENDAR,
        content: 'Calendar',
        startContent: <CalendarIcon {...mappingIconColor(CALENDAR)} />,
      },
      {
        id: 'sb_messages',
        href: MESSAGES,
        content: 'Messages',
        startContent: <MessageIcon {...mappingIconColor(MESSAGES)} />,
        endContent: (
          <Chip
            classNames={{
              base: 'bg-red-500',
              content: 'text-white font-medium text-xs',
            }}
          >
            49
          </Chip>
        ),
      },
      {
        id: 'sb_notification',
        href: NOTIFICATION,
        content: 'Notification',
        startContent: <NotificationIcon {...mappingIconColor(NOTIFICATION)} />,
      },
      {
        id: 'sb_settings',
        href: SETTINGS,
        content: 'Settings',
        startContent: <SettingIcon {...mappingIconColor(SETTINGS)} />,
      },
    ],
    [mappingIconColor],
  );

  return (
    <Listbox aria-label="Sidebar">
      {MAPPING_SIDEBAR_CONTENTS.map(
        ({ id, href, startContent, endContent, content }) => (
          <ListboxItem
            aria-label={content}
            as={Link}
            key={id}
            href={href}
            startContent={isOpenSidebar && startContent}
            endContent={isOpenSidebar && endContent}
            className={clsx(
              'dark:hover:bg-blue-800 mb-5 gap-4 items-center',
              isClosedSidebar && 'max-w-fit',
              pathname === href
                ? `text-blue-500 dark:text-purple-600 pointer-events-none before:block before:absolute before:h-12 before:-top-2 before:rounded-r-5 before:bg-gray-200/20 ${isOpenSidebar ? 'before:w-[60px] before:-left-7' : 'before:w-[53px] before:-left-[22px]'}`
                : 'text-blue-800 dark:text-white opacity-80',
            )}
            classNames={{
              title: ['text-xl font-medium'],
            }}
          >
            {isOpenSidebar ? content : startContent}
          </ListboxItem>
        ),
      )}
    </Listbox>
  );
};

export default memo(NavigateList);
