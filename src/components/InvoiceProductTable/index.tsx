'use client';

import { Autocomplete, Button, Input, Table, Text } from '@/components';
import { IProduct, TInvoiceProduct } from '@/models';
import { formatTotalAmount } from '@/utils';
import { Dispatch, Key, SetStateAction } from 'react';
import { FaTrash } from 'react-icons/fa';
import { TbSquareRoundedPlusFilled } from 'react-icons/tb';

interface InvoiceProductTableProps {
  products: (IProduct & { id: number })[];
  errorProducts: string;
  productsValues: TInvoiceProduct<
    IProduct & {
      id: number;
    }
  >[];
  setProductsValues: Dispatch<
    SetStateAction<
      TInvoiceProduct<
        IProduct & {
          id: number;
        }
      >[]
    >
  >;
  setErrorProducts: Dispatch<SetStateAction<string>>;
}

const initInvoiceProduct = {
  id: '',
  quantity: 0,
  price: 0,
  product: {
    data: {
      id: 0,
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
  const handleAddProduct = () => {
    setErrorProducts('');
    setProductsValues((prev) => [...prev, initInvoiceProduct]);
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
    }
  };

  const optionsProducts = products.map((product) => ({
    value: product.id.toString(),
    label: product.title,
  }));

  const columnTable = [
    {
      header: 'Product Name',
      accessor: (data: TInvoiceProduct<IProduct & { id: number }>) => {
        const optionsElse = optionsProducts.filter(
          ({ value }) =>
            !productsValues.some(
              ({ product }) => product.data.id.toString() === value,
            ),
        );

        const current = optionsProducts.filter(
          ({ value }) => value === data.product.data.id.toString(),
        );

        return (
          <Autocomplete
            value={data.product.data.id}
            onSelectionChange={(key) =>
              handleChangeProductName(key, data.product.data.id)
            }
            options={[...current, ...optionsElse]}
            className="!text-blue-500 text-[14.22px] leading-[18.51px]"
          />
        );
      },
      isSort: true,
    },
    {
      header: 'Rate',
      accessor: ({ product }: TInvoiceProduct<IProduct>) => {
        return <Text text={`$${product.data.price}`} className="text-end" />;
      },
      isSort: true,
    },
    {
      header: 'QTY',
      accessor: ({ quantity }: TInvoiceProduct<IProduct>) => (
        <Input
          value={quantity.toString()}
          classNames={{
            base: 'w-[65px]',
            inputWrapper: 'bg-white shadow-none px-2',
          }}
          endContent={<Text text="Pcs" />}
        />
      ),
      isSort: true,
    },
    {
      header: 'Amount',
      accessor: ({ product, quantity }: TInvoiceProduct<IProduct>) => (
        <Text
          className="text-end text-teal-500 pr-3"
          text={
            quantity === 0
              ? '$0'
              : `$${formatTotalAmount(product.data.price, quantity)}`
          }
        />
      ),
      isSort: true,
    },
    {
      accessor: () => (
        <Button
          variant="ghost"
          className="rounded-[100%] p-[10px] !bg-pink-500/5"
          endContent={<FaTrash className="text-pink-500" />}
        />
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <Text
          text="Product Description"
          className="font-medium text-[16px] leading-[20.83px]"
        />
        <Button
          variant="ghost"
          className="!bg-white p-0"
          isDisabled={productsValues.length === products.length}
          onClick={handleAddProduct}
          endContent={
            <TbSquareRoundedPlusFilled size={34} className="text-blue-500" />
          }
        />
      </div>

      <div className="mt-[17px]">
        <Table
          newData={initInvoiceProduct}
          columns={columnTable}
          data={productsValues}
          variant="secondary"
        />
        {errorProducts && (
          <Text text={errorProducts} className="text-red-400" />
        )}
      </div>
    </div>
  );
};

export default InvoiceProductTable;