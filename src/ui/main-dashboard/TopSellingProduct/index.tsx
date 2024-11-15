// Components
import { getAllProducts } from '@/api';
import { NoProductAvailable, ProductCard } from '@/components';

// Layouts
import { TableLayout } from '@/layouts';

// Constants
import { LIMIT_NUMBERS } from '@/constants';

const TopSellingProducts = async () => {
  const { data: topProducts = [] } = await getAllProducts({
    limitNumber: LIMIT_NUMBERS.TOP_SELLING_PRODUCTS,
  });

  return (
    <TableLayout title="Top Selling Products" className="h-full md:p-5">
      <div className="mt-8">
        {topProducts?.length ? (
          topProducts.map(
            (
              {
                id,
                attributes: {
                  imageUrl = '',
                  title = 'Product Title',
                  price = 0,
                  rating = 0,
                },
              },
              index,
            ) => {
              const hasBorder = index < topProducts.length - 1;
              return (
                <div key={id} className="mb-6 w-full">
                  <ProductCard
                    url={imageUrl}
                    title={title}
                    price={price}
                    rating={rating}
                    className="shadow-none"
                  />
                  {hasBorder && (
                    <div className="border-solid border-[1px] border-gray-150 dark:border-gray-350 my-8" />
                  )}
                </div>
              );
            },
          )
        ) : (
          <NoProductAvailable message="No top selling products at the moment" />
        )}
      </div>
    </TableLayout>
  );
};

export default TopSellingProducts;
