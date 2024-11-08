'use client';

import { memo, useCallback, useState, useEffect } from 'react';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';

// Hocs
import { withAccountState } from '@/hocs/withAccountState';

// Models
import { IProductDetail } from '@/models';

// Mocks
import { productTabs } from '@/mocks';

// Constants
import { RATING_PRODUCT, MESSAGES } from '@/constants';

// hooks
import { useBreakPoints, useToast } from '@/hooks';

// Actions
import { createProduct } from '@/actions';

// Utils
import { handleUpdateImage, preventScrollFromState } from '@/utils';

// Components
import { BsPlus, Button, ProductForm } from '@/components';
import Tabs from '../Tabs';

interface ProductDrawerProps {
  isAdmin: boolean;
}

const ProductDrawer = ({ isAdmin }: ProductDrawerProps): JSX.Element => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File>();
  const [isAvatarDirty, setIsAvatarDirty] = useState(false);
  const { showToast } = useToast();
  const { isGreaterThanMd } = useBreakPoints();

  const handleOpenDrawer = useCallback(() => {
    setIsDrawerOpen(true);
  }, []);

  const handleCloseDrawer = () => {
    setAvatarFile(undefined);
    setIsAvatarDirty(false);
    setIsDrawerOpen(false);
  };

  const handleFormSubmit = useCallback(
    async (formData: IProductDetail) => {
      formData.rating = RATING_PRODUCT;

      if (avatarFile && isAvatarDirty) {
        const { url = '' } = await handleUpdateImage(avatarFile);

        formData.imageUrl = url;
      }

      const { error } = await createProduct({
        ...formData,
        title: `${formData.title}`,
      });

      if (error) {
        showToast({
          description: error,
          status: MESSAGES.STATUS.ERROR,
        });
        return;
      } else {
        showToast({
          description: MESSAGES.SUCCESS.CREATE_PRODUCT,
          status: MESSAGES.STATUS.SUCCESS,
        });
      }

      setIsDrawerOpen(false);
      setAvatarFile(undefined);
      setIsAvatarDirty(false);
    },
    [avatarFile, isAvatarDirty, showToast],
  );

  const handleAvatarChange = useCallback((avatarFile: File) => {
    setAvatarFile(avatarFile);
    setIsAvatarDirty(true);
  }, []);

  useEffect(() => {
    preventScrollFromState(isDrawerOpen);
  }, [isDrawerOpen]);

  return (
    <div className="flex flex-col md:flex-row justify-between md:items-center w-full mb-8">
      <Tabs
        tabs={productTabs}
        classNames={{
          base: 'inline-block',
          cursor: 'bg-blue-500 dark:bg-purple-600',
          tabList: 'p-0 bg-white rounded-[10px] h-[40px] dark:bg-blue-400',
          tab: 'm-0 h-[40px] rounded-[10px]',
          tabContent: 'dark:text-white',
        }}
        className="p-0 rounded-[10px]"
      />
      <div className="flex">
        {isAdmin && (
          <Button
            color="primary"
            startContent={<BsPlus size={22} className="text-white" />}
            className="text-xl font-medium md:w-auto h-10 px-2.5 w-full mt-7 md:mt-0"
            onClick={handleOpenDrawer}
          >
            Add Product
          </Button>
        )}

        {isDrawerOpen && (
          <Drawer
            open={isDrawerOpen}
            onClose={handleCloseDrawer}
            direction="right"
            size={isGreaterThanMd ? 450 : 375}
          >
            <div className="p-8 bg-white dark:bg-gray-400 h-full max-w-full overflow-y-auto">
              <ProductForm
                onCloseDrawer={handleCloseDrawer}
                key={isDrawerOpen ? 'open' : 'closed'}
                onSubmit={handleFormSubmit}
                onAvatarChange={handleAvatarChange}
              />
            </div>
          </Drawer>
        )}
      </div>
    </div>
  );
};

export default withAccountState<ProductDrawerProps>(memo(ProductDrawer));
