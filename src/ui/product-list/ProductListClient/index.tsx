'use client';

import isEqual from 'react-fast-compare';
import { Key, memo, useCallback, useState, useEffect } from 'react';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';

// Components
import {
  LoadingIndicator,
  ProductDetails,
  ProductForm,
  ProductTable,
} from '@/components';

// Types
import { TProductInvoiceResponse } from '@/types';

// Constants
import { MESSAGES } from '@/constants';

// Utils
import {
  getDataByID,
  handleUpdateImage,
  preventScrollFromState,
} from '@/utils';

// Models
import { IProductDetail } from '@/models';

// Hooks
import { useBreakPoints, useToast } from '@/hooks';

export type TProductListClientProps = {
  productList: TProductInvoiceResponse[];
  onEdit: (
    payload: Partial<IProductDetail>,
    id: number,
  ) => Promise<{
    success?: boolean;
    error?: string;
  }>;
  onDelete: (id: number) => Promise<{
    success?: boolean;
    error?: string;
  }>;
};

const ProductListClient = ({
  productList,
  onDelete,
  onEdit,
}: TProductListClientProps) => {
  const [toggleProductDetails, setToggleProductDetails] =
    useState<boolean>(false);
  const [productDetailsByID, setProductDetailsByID] =
    useState<TProductInvoiceResponse>();
  const [avatarFile, setAvatarFile] = useState<File>();
  const [isAvatarDirty, setIsAvatarDirty] = useState(false);
  const [toggleEditProduct, setToggleEditProduct] = useState<boolean>(false);
  const [idProduct, setIdProduct] = useState<number>(0);
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { isGreaterThanLg } = useBreakPoints();

  // Func
  const handleDeleteProduct = useCallback(
    async (id: number) => {
      setIsLoading(true);

      const res = await onDelete(id);

      setIsLoading(false);

      const { error } = res || {};

      showToast({
        description: error || MESSAGES.SUCCESS.DELETE_CUSTOMER,
        status: error ? MESSAGES.STATUS.ERROR : MESSAGES.STATUS.SUCCESS,
      });
    },
    [onDelete, showToast],
  );

  const handleCloseProductDetail = useCallback(
    () => setToggleProductDetails(false),
    [],
  );

  const handleOpenProductDetail = useCallback(
    (key: Key) => {
      const productByID = getDataByID<TProductInvoiceResponse>(
        productList,
        Number(key),
      );
      setProductDetailsByID(productByID);
      setToggleProductDetails(true);
    },
    [productList],
  );

  const handleOpenDrawer = useCallback(
    (id: number) => {
      const productByID = getDataByID<TProductInvoiceResponse>(productList, id);
      const { attributes } = productByID ?? {};
      const { product } = attributes || {};
      const { data } = product || {};
      const { attributes: productAttributes } = data || {};

      const brand = productAttributes?.brand?.toLowerCase();

      setProductDetailsByID({
        ...productByID,
        attributes: {
          ...attributes,
          product: {
            data: {
              ...data,
              attributes: {
                ...productAttributes,
                brand,
              },
            },
          },
        },
      });

      setIdProduct(data.id);
      setToggleEditProduct(true);
    },
    [productList],
  );

  const handleCloseDrawer = useCallback(() => {
    setToggleEditProduct(false);
    setProductDetailsByID(undefined);
  }, []);

  const handleAvatarChange = useCallback((avatarFile: File) => {
    setAvatarFile(avatarFile);
    setIsAvatarDirty(true);
  }, []);

  const handleEditProduct = useCallback(
    async (formData: IProductDetail) => {
      if (avatarFile && isAvatarDirty) {
        const { url = '' } = await handleUpdateImage(avatarFile);

        formData.imageUrl = url;
      }

      const { error } = (await onEdit(formData, idProduct)) ?? {};

      showToast({
        description: error ?? MESSAGES.SUCCESS.UPDATE_PRODUCT,
        status: error ? MESSAGES.STATUS.ERROR : MESSAGES.STATUS.SUCCESS,
      });

      setToggleEditProduct(false);
      setAvatarFile(undefined);
      setIsAvatarDirty(false);
    },
    [avatarFile, idProduct, isAvatarDirty, onEdit, showToast],
  );

  useEffect(() => {
    // Prevent scrolling based on toggleEditProduct and toggleProductDetails states
    const shouldDisableScroll = toggleProductDetails || toggleEditProduct;
    preventScrollFromState(shouldDisableScroll);
  }, [toggleEditProduct, toggleProductDetails]);

  return (
    <>
      {isLoading && <LoadingIndicator />}
      <ProductTable
        data={productList}
        onDelete={handleDeleteProduct}
        onEdit={handleOpenDrawer}
        onRowAction={handleOpenProductDetail}
      />
      {productDetailsByID && toggleProductDetails && (
        <Drawer
          open={toggleProductDetails}
          onClose={handleCloseProductDetail}
          direction="right"
          size={isGreaterThanLg ? 369 : 302}
          className="overflow-y-auto"
        >
          <ProductDetails product={productDetailsByID} />
        </Drawer>
      )}
      {toggleEditProduct && (
        <Drawer
          open={toggleEditProduct}
          onClose={handleCloseDrawer}
          direction="right"
          size={isGreaterThanLg ? 369 : 302}
        >
          <div className="p-8 bg-white dark:bg-gray-400 h-full max-w-full overflow-y-auto">
            <ProductForm
              previewData={
                productDetailsByID?.attributes?.product?.data?.attributes
              }
              onAvatarChange={handleAvatarChange}
              onSubmit={handleEditProduct}
              onCloseDrawer={handleCloseDrawer}
            />
          </div>
        </Drawer>
      )}
    </>
  );
};

export default memo(ProductListClient, isEqual);
