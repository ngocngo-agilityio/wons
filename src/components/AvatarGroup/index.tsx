import { memo } from 'react';
import isEqual from 'react-fast-compare';
import clsx from 'clsx';

// Components
import { ImageFallback } from '@/components';

// Models
import { TUser } from '@/models';

// Types
import { StrapiModel } from '@/types';

// Utils
import { getSubarray } from '@/utils';

type AvatarGroupProps = {
  users: StrapiModel<Omit<TUser, 'id'>>[];
};

const AvatarGroup = ({ users }: AvatarGroupProps) => (
  <div className="flex items-center">
    {getSubarray<StrapiModel<Omit<TUser, 'id'>>>(users, 0, 4).map(
      ({ id, attributes }, index) => {
        const { avatar = '', username = '' } = attributes ?? {};

        return (
          <div key={id} className={clsx('w-7 h-7', index !== 0 && '-ml-3')}>
            <ImageFallback
              src={avatar}
              alt={username}
              placeholder={null}
              width={28}
              height={28}
              className="h-full rounded-full object-cover"
            />
          </div>
        );
      },
    )}
  </div>
);

export default memo(AvatarGroup, isEqual);
