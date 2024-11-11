'use client';

import { Key, memo, useCallback, useEffect, useState } from 'react';
import isEqual from 'react-fast-compare';

// constants
import { ORDER } from '@/constants';

// Hocs
import { withAccountState } from '@/hocs/withAccountState';

// Types
import { TProductInvoiceResponse } from '@/types';

// Utils
import {
  calcTotalAmount,
  formatPrice,
  formatTotalAmount,
  getSerialNumberWithMedal,
} from '@/utils';

// Components
import { DropdownActions, ImageFallback, Table, Text } from '@/components';

type ProductTableProps = {
  data: TProductInvoiceResponse[];
  isAdmin: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onRowAction?: (key: Key) => void;
};

const ProductTable = ({
  data = [],
  isAdmin,
  onEdit,
  onDelete,
  onRowAction,
}: ProductTableProps): JSX.Element => {
  const { ASC, DESC } = ORDER;
  const [productsBySort, setProductsBySort] =
    useState<TProductInvoiceResponse[]>(data);
  const [order, setOrder] = useState<string>(ASC);
  const [sortBy, setSortBy] = useState<string>('');

  useEffect(() => {
    setProductsBySort(data);
  }, [data]);

  const columns = [
    {
      header: 'SN',
      accessor: (productData: TProductInvoiceResponse) =>
        getSerialNumberWithMedal<TProductInvoiceResponse>(data, productData),
      isSort: true,
      value: 'id',
    },
    {
      header: 'Name',
      accessor: (productData: TProductInvoiceResponse) => {
        const { attributes } = productData || {};
        const { product } = attributes || {};
        const { data } = product || {};
        const { attributes: attributesProduct } = data || {};
        const { imageUrl = '', title = '' } = attributesProduct || {};

        return (
          <div className="flex gap-3.5 items-center h-[40px]">
            <ImageFallback
              width={40}
              height={40}
              sizes="40px"
              src={imageUrl}
              alt="customer avatar"
              className="rounded-full h-full object-cover"
            />
            <Text
              size="md"
              text={title}
              textColor="text-blue-500 dark:text-purple-500"
              className="text-nowrap"
            />
          </div>
        );
      },
      isSort: true,
      value: 'title',
    },
    {
      header: 'Price',
      accessor: (productData: TProductInvoiceResponse) => {
        const { attributes } = productData || {};
        const { product } = attributes || {};
        const { data } = product || {};
        const { attributes: attributesProduct } = data || {};
        const { price = 0 } = attributesProduct || {};

        return (
          <Text
            size="md"
            text={`$${formatPrice(price)}`}
            className="text-nowrap"
          />
        );
      },
      isSort: true,
      value: 'price',
    },
    {
      header: 'Total Order',
      accessor: (productData: TProductInvoiceResponse) => {
        const { attributes } = productData || {};
        const { quantity = 0 } = attributes || {};

        return (
          <Text
            size="md"
            text={`${quantity.toString()} Piece`}
            className="text-nowrap"
          />
        );
      },
      isSort: true,
      value: 'quantity',
    },
    {
      header: 'Total Sales',
      accessor: (productData: TProductInvoiceResponse) => {
        const { attributes } = productData || {};
        const { quantity = 0 } = attributes || {};
        const { product } = attributes || {};
        const { data } = product || {};
        const { attributes: attributesProduct } = data || {};
        const { price = 0 } = attributesProduct || {};

        return (
          <Text
            size="md"
            text={
              quantity === 0 ? '$0' : `$${formatTotalAmount(price, quantity)}`
            }
            textColor="text-teal-600 dark:text-teal-300"
            className="text-nowrap"
          />
        );
      },
      isSort: true,
      value: 'totalSale',
    },
    {
      ...(isAdmin && {
        accessor: (customerData: TProductInvoiceResponse) => {
          const { id } = customerData || {};
          return (
            <DropdownActions id={id} onEdit={onEdit} onDelete={onDelete} />
          );
        },
      }),
    },
  ].filter((item) => Object.keys(item).length !== 0);

  /**
   * Handles sorting of products based on the selected value
   * @param {string} value - The value to sort by (id, title, price, quantity, totalSale)
   *
   * Previous product and Behind product represent two products being compared for sorting
   * @param {object} previousProduct - The first product to compare
   * @param {object} behindProduct - The second product to compare
   */
  const handleSort = useCallback(
    (value: string) => {
      setSortBy(value);
      setOrder((prev) => (prev === ASC ? DESC : ASC));

      const isASC = order === ASC;

      switch (value) {
        case 'id':
          setProductsBySort(data);

          setProductsBySort((prev) =>
            prev.toSorted((previousProduct, behindProduct) =>
              isASC
                ? prev.indexOf(behindProduct) - prev.indexOf(previousProduct)
                : prev.indexOf(previousProduct) - prev.indexOf(behindProduct),
            ),
          );
          break;

        case 'title':
          setProductsBySort((prev) =>
            prev.toSorted((previousProduct, behindProduct) => {
              const { title: titleFirst = '' } =
                previousProduct?.attributes?.product?.data?.attributes ?? {};
              const { title: titleSecond = '' } =
                behindProduct?.attributes?.product?.data?.attributes ?? {};

              return isASC
                ? titleSecond.localeCompare(titleFirst)
                : titleFirst.localeCompare(titleSecond);
            }),
          );
          break;

        case 'price':
          setProductsBySort((prev) =>
            prev.toSorted((previousProduct, behindProduct) => {
              const { price: priceFirst = 0 } =
                previousProduct?.attributes?.product?.data?.attributes ?? {};
              const { price: priceSecond = 0 } =
                behindProduct?.attributes?.product?.data?.attributes ?? {};

              return isASC
                ? priceSecond - priceFirst
                : priceFirst - priceSecond;
            }),
          );
          break;

        case 'quantity':
          setProductsBySort((prev) =>
            prev.toSorted((previousProduct, behindProduct) => {
              const { quantity: quantityFirst = 0 } =
                previousProduct?.attributes ?? {};
              const { quantity: quantitySecond = 0 } =
                behindProduct?.attributes ?? {};

              return isASC
                ? quantitySecond - quantityFirst
                : quantityFirst - quantitySecond;
            }),
          );
          break;

        case 'totalSale':
          setProductsBySort((prev) =>
            prev.toSorted((previousProduct, behindProduct) => {
              const { quantity: quantityFirst = 0 } =
                previousProduct?.attributes ?? {};
              const { price: priceFirst = 0 } =
                previousProduct?.attributes?.product?.data?.attributes ?? {};
              const { quantity: quantitySecond = 0 } =
                behindProduct?.attributes ?? {};
              const { price: priceSecond = 0 } =
                behindProduct?.attributes?.product?.data?.attributes ?? {};

              return isASC
                ? calcTotalAmount(priceFirst, quantityFirst) -
                    calcTotalAmount(priceSecond, quantitySecond)
                : calcTotalAmount(priceSecond, quantitySecond) -
                    calcTotalAmount(priceFirst, quantityFirst);
            }),
          );
          break;
        default:
          return data;
      }
    },
    [data, order],
  );

  return (
    <div className="flex flex-col gap-10">
      <Table
        isStriped
        variant="secondary"
        columns={columns}
        data={productsBySort}
        order={order}
        sortBy={sortBy}
        onRowAction={onRowAction}
        onSort={handleSort}
      />
    </div>
  );
};

export default withAccountState<ProductTableProps>(memo(ProductTable, isEqual));
