'use client';

import {
  ChangeEvent,
  Dispatch,
  Key,
  memo,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import clsx from 'clsx';

// icons
import { FaTrash } from 'react-icons/fa';
import { TbSquareRoundedPlusFilled } from 'react-icons/tb';

// Components
import { Button, Input, Table, Text } from '@/components';
import { Select, SelectItem } from '@nextui-org/react';

// Constants
import { MAX_QUANTITY_PRODUCTS, ORDER, REGEX } from '@/constants';

// Models
import { IProduct } from '@/models';

// Utils
import { formatTotalAmount, sortProducts } from '@/utils';

// Types
import { TInvoiceProductTable } from '@/types';
import isEqual from 'react-fast-compare';
import { Controller, useForm } from 'react-hook-form';

interface InvoiceProductTableProps {
  products: (IProduct & { id: number })[];
  errorProducts: string;
  productsValues: TInvoiceProductTable[];
  setProductsValues: Dispatch<SetStateAction<TInvoiceProductTable[]>>;
  setErrorProducts: Dispatch<SetStateAction<string>>;
}

const initInvoiceProduct = {
  id: undefined,
  quantity: 0,
  price: 0,
  product: {
    data: {
      id: 0,
      name: '',
      price: 0,
      imageUrl: '',
      title: '',
      rating: 0,
    },
  },
};

const InvoiceProductTable = ({
  setErrorProducts,
  setProductsValues,
  products,
  errorProducts,
  productsValues,
}: InvoiceProductTableProps) => {
  const { ASC, DESC } = ORDER;
  const [order, setOrder] = useState<string>(ASC);
  const [sortBy, setSortBy] = useState<string>('');

  const { control, setError, clearErrors } = useForm();

  useEffect(() => {
    if (!productsValues.length) {
      setProductsValues([initInvoiceProduct]);
    }
  }, [productsValues.length, setProductsValues]);

  const handleAddProduct = () => {
    setErrorProducts('');
    const newProduct = {
      ...initInvoiceProduct,
      id: Date.now(),
      product: {
        ...initInvoiceProduct.product,
        data: {
          ...initInvoiceProduct.product.data,
          id: Date.now(),
        },
      },
    };

    setProductsValues((prev) => [...prev, newProduct]);
  };

  const handleChangeProductName = (key: Key | null, id: number) => {
    const product = products.find((product) => product.id.toString() === key);
    setErrorProducts('');

    if (product) {
      setProductsValues((prevProducts) => {
        if (prevProducts.length === 0)
          return [
            { product: { data: product }, quantity: 1, price: product.price },
          ];

        return prevProducts.map((p) =>
          p.product.data.id === id
            ? { product: { data: product }, quantity: 1, price: product.price }
            : p,
        );
      });

      clearErrors(`productName_${id}`);
    }
  };

  const optionsProducts = products.map((product) => ({
    value: product.id.toString(),
    label: product.title,
  }));

  const columnTable = [
    {
      header: 'Product Name',
      accessor: (data: TInvoiceProductTable) => {
        const optionsElse = optionsProducts.filter(
          ({ value }) =>
            !productsValues.some(
              ({ product }) => product.data?.id?.toString() === value,
            ),
        );

        const current = optionsProducts.filter(
          ({ value }) => value === data.product?.data?.id?.toString(),
        );

        return (
          <Controller
            control={control}
            name={`productName_${data.product.data.id}`}
            render={({ field, fieldState: { error } }) => (
              <Select
                {...field}
                classNames={{
                  trigger: clsx(
                    'bg-gray-50 dark:bg-gray-600 hover:data-[hover=true]:bg-gray-200/50 dark:hover:data-[hover=true]:bg-gray-900 focus:bg-gray-50 dark:focus:bg-gray-600 w-40',
                  ),
                }}
                selectedKeys={
                  data.product?.data?.id?.toString()
                    ? [data.product.data.id.toString()]
                    : []
                }
                onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                  const selectedValue: Key | null = event.target.value;
                  handleChangeProductName(selectedValue, data.product.data.id);
                  field.onChange(selectedValue);
                }}
                aria-label="Product Name field"
                onClose={() => {
                  if (!field.value) {
                    setError(`productName_${data.product.data.id}`, {
                      type: 'manual',
                      message: 'This field is required',
                    });
                  } else {
                    clearErrors(`productName_${data.product.data.id}`);
                    setError(`productName_${data.product.data.id}`, {
                      type: 'manual',
                      message: '',
                    });
                  }
                }}
                isInvalid={!!error?.message}
                errorMessage={error?.message}
              >
                {[...current, ...optionsElse].map(
                  ({ value, label }: { value: string; label: string }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ),
                )}
              </Select>
            )}
          />
        );
      },
      value: 'title',
      isSort: true,
    },
    {
      header: 'Rate',
      accessor: ({ product }: TInvoiceProductTable) => {
        return <Text text={`$${product.data.price}`} />;
      },
      value: 'price',
      isSort: true,
    },
    {
      header: 'QTY',
      accessor: ({ quantity, product }: TInvoiceProductTable) => (
        <Input
          value={quantity.toString()}
          classNames={{
            base: 'w-[65px]',
            inputWrapper: 'bg-white dark:bg-gray-400 shadow-none px-2',
          }}
          onChange={(e) => handleUpdateQuantity(e, product.data.id)}
          endContent={<Text text="Pcs" />}
          aria-label="Quantity field"
        />
      ),
      isSort: true,
      value: 'quantity',
    },
    {
      header: 'Amount',
      accessor: ({ product, quantity }: TInvoiceProductTable) => (
        <Text
          className="text-end text-teal-700 pr-3"
          text={
            quantity === 0
              ? '$0'
              : `$${formatTotalAmount(product.data.price, quantity)}`
          }
        />
      ),
      value: 'amount',
      isSort: true,
    },
    {
      accessor: ({ product }: TInvoiceProductTable) => (
        <Button
          variant="ghost"
          className="rounded-full block p-[10px] bg-pink-500/5 dark:bg-pink-500/5"
          data-id={product.data.id}
          endContent={<FaTrash className="text-pink-500" />}
          onClick={() => handleRemoveProduct(product.data.id)}
          aria-label="Remove product"
        />
      ),
    },
  ];

  const handleUpdateQuantity = (
    e: ChangeEvent<HTMLInputElement>,
    id: number,
  ) => {
    const { value } = e.target;
    setErrorProducts('');

    // Find the product to update
    const product = products.find((product) => product.id === id);

    if (product) {
      // Validate and parse the value directly
      const parsedValue = Number(value);

      // Check if the value is a valid positive integer within the range of 0 to 99
      const isValidQuantity =
        !isNaN(parsedValue) &&
        parsedValue >= 0 &&
        parsedValue <= MAX_QUANTITY_PRODUCTS &&
        REGEX.INTEGER.test(value);

      if (isValidQuantity || value === '') {
        setProductsValues((prevProducts) =>
          prevProducts.map((p) =>
            p.product.data.id === id
              ? { ...p, quantity: isValidQuantity ? parsedValue : 0 }
              : p,
          ),
        );
      }
    }
  };

  const handleRemoveProduct = (id: number) => {
    setProductsValues((prev) =>
      prev.filter((product) => product.product.data.id !== id),
    );
  };

  // If `productsValues` is empty, we fallback to showing the initial invoice product.
  const dataTable =
    productsValues.length > 0 ? productsValues : [initInvoiceProduct];

  const handleSort = useCallback(
    (sortBy: string) => {
      setSortBy(sortBy);
      const newOrder = sortProducts(
        order,
        sortBy,
        ASC,
        DESC,
        productsValues,
        setProductsValues,
      );
      setOrder(newOrder);
    },
    [ASC, DESC, order, productsValues, setProductsValues],
  );

  return (
    <>
      <section className="flex items-center justify-between">
        <Text
          text="Product Description"
          size="xl"
          className="font-medium leading-[20.83px]"
        />
        <Button
          aria-label="Add new product"
          variant="ghost"
          className="bg-white block dark:bg-gray-400 p-0"
          isDisabled={productsValues.length === products.length}
          onClick={handleAddProduct}
          endContent={
            <TbSquareRoundedPlusFilled
              size={34}
              className="text-blue-500 dark:text-purple-600"
            />
          }
        />
      </section>

      <div className="mt-[17px]">
        <Table
          isStripedRow
          variant="secondary"
          columns={columnTable}
          data={dataTable}
          onSort={handleSort}
          sortBy={sortBy}
          order={order}
        />
        {errorProducts && (
          <Text text={errorProducts} className="text-red-400" />
        )}
      </div>
    </>
  );
};

export default memo(InvoiceProductTable, isEqual);
