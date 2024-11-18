'use client';

import { useSession } from 'next-auth/react';

// Constants
import { IMAGES, ROLES } from '@/constants';

// Components
import SidebarClient from './SidebarClient';

const Sidebar = () => {
  const { data: session } = useSession();

  const { user } = session || {};
  const {
    avatar = IMAGES.AVATAR_DEFAULT,
    fullName = '',
    role = ROLES[0],
  } = user || {};

  return (
    <aside>
      <SidebarClient avatar={avatar} fullName={fullName} role={role.name} />
    </aside>
  );
};

export default Sidebar;
