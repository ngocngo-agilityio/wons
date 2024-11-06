// constants
import { TableLayout } from '@/layouts';

// uis
import ProductListClient from '../ProductListClient';

// utils
import {
  aggregateProductQuantities,
  filterProductsNotInInvoice,
  formatProduct,
  sortProductsByTotalSale,
} from '@/utils';

// types
import {
  ISearchParams,
  TProductInvoiceListResponse,
  TProductInvoiceResponse,
} from '@/types';

// Constants
import { PAGE_SIZE } from '@/constants';

// services
import { getInvoiceProducts, getProducts } from '@/api';

// Actions
import { updateProduct, deleteProduct } from '@/actions';

type TProductListPageProps = {
  searchParams?: ISearchParams;
};

const ProductList = async ({ searchParams = {} }: TProductListPageProps) => {
  const {
    sortBy = '',
    order = '',
    startTime = '',
    endTime = '',
  } = searchParams ?? {};

  const filters: Record<string, string> = {
    'createdAt[$gte]': startTime,
    'createdAt[$lte]': endTime,
  };

  const result: TProductInvoiceListResponse = (await getInvoiceProducts({
    sort: sortBy
      ? `${sortBy === 'title' ? `product.${sortBy}` : sortBy}:${order}`
      : '',
    filters,
    pageSize: PAGE_SIZE[10],
  })) as TProductInvoiceListResponse;

  const { data: resultProducts = [] } = await getProducts();

  const invoiceProductIds = new Set(
    result?.data?.map((invoice) => invoice.attributes.product.data.id),
  );

  const resultFilterProductsNotInInvoice = filterProductsNotInInvoice(
    invoiceProductIds,
    resultProducts,
  );

  const resultFormatProduct = formatProduct(resultFilterProductsNotInInvoice);

  // Aggregate and sort products by total sales
  const formattedProducts: TProductInvoiceResponse[] =
    aggregateProductQuantities(result.data);

  return (
    <TableLayout title="Top Selling Products">
      <ProductListClient
        productList={sortProductsByTotalSale(
          resultFormatProduct.concat(
            formattedProducts,
          ) as TProductInvoiceResponse[],
        )}
        onEdit={updateProduct}
        onDelete={deleteProduct}
      />
    </TableLayout>
  );
};

export default ProductList;
