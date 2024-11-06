// types
import { StrapiModel } from '@/types/strapi';
import { TProductInvoiceResponse } from '@/types';

// models
import { IProduct } from '@/models';

export const MOCK_PRODUCTS_WITH_STRAPI_MODEL: StrapiModel<IProduct>[] = [
  {
    id: 1,
    attributes: {
      title: 'Product 1',
      price: 100,
      rating: 5,
      imageUrl:
        'https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp',
    },
  },
  {
    id: 2,
    attributes: {
      title: 'Product 2',
      price: 200,
      rating: 4.5,
      imageUrl:
        'https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp',
    },
  },
  {
    id: 3,
    attributes: {
      title: 'Product 3',
      price: 200,
      rating: 4.5,
      imageUrl:
        'https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp',
    },
  },
];

export const MOCK_PRODUCTS_WITHOUT_ATTRIBUTES: Omit<IProduct, 'id'>[] = [
  {
    title: 'Product 1',
    price: 100,
    rating: 5,
    imageUrl:
      'https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp',
  },
  {
    title: 'Product 2',
    price: 200,
    rating: 4,
    imageUrl:
      'https://img-cdn.pixlr.com/image-generator/history/another-product/medium.webp',
  },
  {
    title: 'Product 3',
    price: 300,
    rating: 4.5,
    imageUrl:
      'https://img-cdn.pixlr.com/image-generator/history/third-product/medium.webp',
  },
];

export const MOCK_PRODUCTS_TOP_SELLING = [
  {
    id: 1,
    attributes: {
      price: 1000,
      createdAt: '2024-08-27T04:20:56.562Z',
      updatedAt: '2024-09-23T02:52:07.552Z',
      publishedAt: '2024-09-10T04:14:24.732Z',
      rating: 4,
      title: 'I phone 12',
      imageUrl:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D',
      brand: 'Apple',
      negotiable: true,
      description:
        'This the New creation Of apple  This the New creation Of apple This the New creation Of apple This the New creation Of apple.',
    },
  },
  {
    id: 2,
    attributes: {
      price: 1200,
      createdAt: '2024-08-27T04:21:20.293Z',
      updatedAt: '2024-09-23T02:58:11.083Z',
      publishedAt: '2024-09-10T04:14:40.546Z',
      rating: 4,
      title: 'Macbook m1',
      imageUrl:
        'https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTExL3JtMzYyLTAxYS1tb2NrdXAuanBn.jpg',
      brand: 'Apple',
      negotiable: false,
      description:
        'This the New creation Of apple  This the New creation Of apple This the New creation Of apple This the New creation Of apple.',
    },
  },
  {
    id: 3,
    attributes: {
      price: 1000,
      createdAt: '2024-09-09T07:45:09.821Z',
      updatedAt: '2024-09-23T02:53:33.888Z',
      publishedAt: '2024-09-10T04:14:34.734Z',
      rating: 2,
      title: 'Samsung A13',
      imageUrl:
        'https://img.freepik.com/free-photo/organic-cosmetic-product-with-dreamy-aesthetic-fresh-background_23-2151382816.jpg',
      brand: 'Samsung',
      negotiable: true,
      description:
        "Discover Samsung's newest creation, combining innovation with cutting-edge technology. Experience the future with enhanced performance and sleek design.",
    },
  },
  {
    id: 4,
    attributes: {
      price: 1500,
      createdAt: '2024-09-09T07:45:45.847Z',
      updatedAt: '2024-09-23T02:54:18.198Z',
      publishedAt: '2024-09-10T04:14:46.763Z',
      rating: 4.6,
      title: 'Macbook pro m3',
      imageUrl:
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D',
      brand: 'Apple',
      negotiable: false,
      description:
        'This the New creation Of apple  This the New creation Of apple This the New creation Of apple This the New creation Of apple.',
    },
  },
  {
    id: 5,
    attributes: {
      price: 3,
      createdAt: '2024-09-10T04:18:27.070Z',
      updatedAt: '2024-09-23T02:57:58.388Z',
      publishedAt: '2024-09-10T04:18:27.725Z',
      rating: 2,
      title: 'Samsung Laptop',
      imageUrl:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D',
      brand: 'Samsung',
      negotiable: false,
      description:
        "Discover Samsung's newest creation, combining innovation with cutting-edge technology. Experience the future with enhanced performance and sleek design.",
    },
  },
];

export const MOCK_INVOICE_PRODUCTS = [
  {
    id: 5,
    attributes: {
      price: 1600,
      createdAt: '2024-09-22T22:21:05.920Z',
      updatedAt: '2024-09-23T02:58:57.822Z',
      publishedAt: '2024-09-22T22:21:05.914Z',
      quantity: 1,
    },
  },
  {
    id: 6,
    attributes: {
      price: 1000,
      createdAt: '2024-09-22T22:22:39.895Z',
      updatedAt: '2024-09-22T22:22:39.895Z',
      publishedAt: '2024-09-22T22:22:39.893Z',
      quantity: 1,
    },
  },
  {
    id: 7,
    attributes: {
      price: 1600,
      createdAt: '2024-09-22T22:23:25.215Z',
      updatedAt: '2024-09-23T02:59:05.936Z',
      publishedAt: '2024-09-22T22:23:25.212Z',
      quantity: 1,
    },
  },
  {
    id: 8,
    attributes: {
      price: 1400,
      createdAt: '2024-09-22T22:24:22.140Z',
      updatedAt: '2024-09-23T02:59:14.013Z',
      publishedAt: '2024-09-22T22:24:22.139Z',
      quantity: 2,
    },
  },
  {
    id: 9,
    attributes: {
      price: 1000,
      createdAt: '2024-09-22T22:25:15.043Z',
      updatedAt: '2024-09-22T22:25:15.043Z',
      publishedAt: '2024-09-22T22:25:15.041Z',
      quantity: 1,
    },
  },
];

export const MOCK_PRODUCTS: (IProduct & { id: number })[] = [
  {
    id: 1,
    imageUrl:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D',
    title: 'Iphone 12',
    price: 1000,
    rating: 4,
    createdAt: '2024-08-27T04:20:56.562Z',
    updatedAt: '2024-09-23T02:52:07.552Z',
    publishedAt: '2024-09-10T04:14:24.732Z',
    totalSale: 100,
  },
  {
    id: 2,
    imageUrl:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D',
    title: 'Iphone 13',
    price: 2000,
    rating: 5,
    createdAt: '2024-09-22T22:25:15.043Z',
    updatedAt: '2024-09-22T22:25:15.043Z',
    publishedAt: '2024-09-22T22:25:15.041Z',
    totalSale: 969,
  },
];

export const MOCK_PRODUCT_LIST: TProductInvoiceResponse[] = [
  {
    id: 4,
    attributes: {
      price: 1600,
      createdAt: '2024-09-22T22:23:25.215Z',
      updatedAt: '2024-09-23T02:59:05.936Z',
      publishedAt: '2024-09-22T22:23:25.212Z',
      quantity: 5,
      product: {
        data: {
          id: 4,
          attributes: {
            price: 1500,
            createdAt: '2024-09-09T07:45:45.847Z',
            updatedAt: '2024-09-23T02:54:18.198Z',
            publishedAt: '2024-09-10T04:14:46.763Z',
            rating: 4.6,
            title: 'Macbook pro m3',
            imageUrl:
              'https://images.unsplash.com/photo-1523275335684-37898b6baf30?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D',
            brand: 'Apple',
            negotiable: false,
            description:
              'This the New creation Of apple  This the New creation Of apple This the New creation Of apple This the New creation Of apple.',
            id: 0,
          },
        },
      },
      // totalSale: 7500,
    },
  },
  {
    id: 3,
    attributes: {
      price: 1000,
      createdAt: '2024-09-22T22:22:39.895Z',
      updatedAt: '2024-09-22T22:22:39.895Z',
      publishedAt: '2024-09-22T22:22:39.893Z',
      quantity: 5,
      product: {
        data: {
          id: 3,
          attributes: {
            price: 1000,
            createdAt: '2024-09-09T07:45:09.821Z',
            updatedAt: '2024-09-23T02:53:33.888Z',
            publishedAt: '2024-09-10T04:14:34.734Z',
            rating: 2,
            title: 'Samsung A13',
            imageUrl:
              'https://img.freepik.com/free-photo/organic-cosmetic-product-with-dreamy-aesthetic-fresh-background_23-2151382816.jpg',
            brand: 'Samsung',
            negotiable: true,
            description:
              "Discover Samsung's newest creation, combining innovation with cutting-edge technology. Experience the future with enhanced performance and sleek design.",
            id: 0,
          },
        },
      },
    },
  },
  {
    id: 2,
    attributes: {
      price: 1600,
      createdAt: '2024-09-22T22:21:05.920Z',
      updatedAt: '2024-09-23T02:58:57.822Z',
      publishedAt: '2024-09-22T22:21:05.914Z',
      quantity: 2,
      product: {
        data: {
          id: 2,
          attributes: {
            price: 1200,
            createdAt: '2024-08-27T04:21:20.293Z',
            updatedAt: '2024-09-23T02:58:11.083Z',
            publishedAt: '2024-09-10T04:14:40.546Z',
            rating: 4,
            title: 'Macbook m1',
            imageUrl:
              'https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTExL3JtMzYyLTAxYS1tb2NrdXAuanBn.jpg',
            brand: 'Apple',
            negotiable: false,
            description:
              'This the New creation Of apple  This the New creation Of apple This the New creation Of apple This the New creation Of apple.',
            id: 0,
          },
        },
      },
    },
  },
  {
    id: 5,
    attributes: {
      price: 3,
      createdAt: '2024-09-22T22:26:14.821Z',
      updatedAt: '2024-09-22T22:26:14.821Z',
      publishedAt: '2024-09-22T22:26:14.818Z',
      quantity: 3,
      product: {
        data: {
          id: 5,
          attributes: {
            price: 3,
            createdAt: '2024-09-10T04:18:27.070Z',
            updatedAt: '2024-09-23T02:57:58.388Z',
            publishedAt: '2024-09-10T04:18:27.725Z',
            rating: 2,
            title: 'Samsung Laptop',
            imageUrl:
              'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D',
            brand: 'Samsung',
            negotiable: false,
            description:
              "Discover Samsung's newest creation, combining innovation with cutting-edge technology. Experience the future with enhanced performance and sleek design.",
            id: 0,
          },
        },
      },
    },
  },
  {
    id: 1,
    attributes: {
      price: 0,
      quantity: 0,
      product: {
        data: {
          id: 1,
          attributes: {
            price: 1000,
            createdAt: '2024-08-27T04:20:56.562Z',
            updatedAt: '2024-09-23T02:52:07.552Z',
            publishedAt: '2024-09-10T04:14:24.732Z',
            rating: 4,
            title: 'I phone 12',
            imageUrl:
              'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D',
            brand: 'Apple',
            negotiable: true,
            description:
              'This the New creation Of apple  This the New creation Of apple This the New creation Of apple This the New creation Of apple.',
            id: 0,
          },
        },
      },
    },
  },
  {
    id: 6,
    attributes: {
      price: 0,
      quantity: 0,
      product: {
        data: {
          id: 6,
          attributes: {
            price: 12312,
            createdAt: '2024-11-05T02:11:28.673Z',
            updatedAt: '2024-11-05T02:11:28.673Z',
            publishedAt: '2024-11-05T02:11:28.671Z',
            rating: 4,
            title: 'aaaaa',
            imageUrl: 'https://dev.perlinks.com/api/get-image/laxqG',
            brand: 'samsung',
            negotiable: true,
            description: 'ấdasdada',
            id: 0,
          },
        },
      },
    },
  },
];
