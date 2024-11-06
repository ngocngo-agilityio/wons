// Types
import {
  TInvoiceDataResponse,
  TInvoiceListResponse,
  InvoiceStatus,
  TProductInvoiceResponse,
} from '@/types';

export const MOCK_INVOICES = [
  {
    id: 1,
    attributes: {
      price: 3443,
      createdAt: '2024-08-27T04:31:42.022Z',
      updatedAt: '2024-09-10T04:15:01.906Z',
      publishedAt: '2024-09-10T04:14:54.432Z',
      quantity: 3,
      product: {
        data: {
          id: 2,
          attributes: {
            price: 454354,
            createdAt: '2024-08-27T04:21:20.293Z',
            updatedAt: '2024-09-10T04:14:40.549Z',
            publishedAt: '2024-09-10T04:14:40.546Z',
            rating: 4,
            title: 'Macbook',
            imageUrl:
              'https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTExL3JtMzYyLTAxYS1tb2NrdXAuanBn.jpg',
          },
        },
      },
    },
  },
  {
    id: 2,
    attributes: {
      price: 4543,
      createdAt: '2024-08-27T04:33:06.097Z',
      updatedAt: '2024-09-10T04:15:13.503Z',
      publishedAt: '2024-09-10T04:15:07.024Z',
      quantity: 1,
      product: {
        data: {
          id: 1,
          attributes: {
            price: 3443,
            createdAt: '2024-08-27T04:20:56.562Z',
            updatedAt: '2024-09-10T04:14:24.736Z',
            publishedAt: '2024-09-10T04:14:24.732Z',
            rating: 4,
            title: 'I phone',
            imageUrl:
              'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D',
          },
        },
      },
    },
  },
];

export const MOCK_INVOICES_WITH_CUSTOMER: TInvoiceDataResponse[] = [
  {
    id: 4,
    attributes: {
      email: 'arroragaur@gmail.com',
      date: '2024-09-10',
      status: InvoiceStatus.Complete,
      address: '1254 Xo Viet Nghe Tinh, Da Nang',
      isSelected: true,
      invoiceId: '871345',
      imageUrl: '',
      customer: {
        data: {
          id: 3,
          attributes: {
            id: 1,
            email: 'arroragaur@gmail.com',
            phone: '(213) 555-5554',
            gender: 'male',
            address: 'danang',
            avatar:
              'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
            firstName: 'Arrora',
            job: 'UI/UX',
            lastName: ' Gaur',
            fullName: 'Arrora Gaur',
          },
        },
      },
      invoice_products: {
        data: [
          {
            id: 6,
            attributes: {
              price: 454354,
              createdAt: '2024-09-22T22:21:05.920Z',
              updatedAt: '2024-09-22T22:21:05.920Z',
              publishedAt: '2024-09-22T22:21:05.914Z',
              quantity: 1,
              product: {
                data: {
                  price: 3443,
                  createdAt: '2024-08-27T04:20:56.562Z',
                  updatedAt: '2024-09-10T04:14:24.736Z',
                  publishedAt: '2024-09-10T04:14:24.732Z',
                  rating: 4,
                  title: 'Macbook',
                  imageUrl:
                    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D',
                },
              },
            },
          },
        ],
      },
    },
  },
  {
    id: 2,
    attributes: {
      email: 'annejacob@gmail.com',
      date: '2024-09-10',
      status: InvoiceStatus.Complete,
      address: 'danang',
      isSelected: false,
      invoiceId: '32434',
      imageUrl: '',
      customer: {
        data: {
          id: 6,
          attributes: {
            id: 2,
            email: 'annejacob@gmail.com',
            phone: '(325) 987-6541',
            gender: 'female',
            address: '1254 Xo Viet Nghe Tinh, Da Nang',
            avatar:
              'https://cellphones.com.vn/sforum/wp-content/uploads/2024/02/anh-avatar-cute-4.jpg',
            firstName: 'Anne ',
            job: 'UI/UX',
            lastName: 'Jacob',
            fullName: 'Anne Jacob',
          },
        },
      },
      invoice_products: {
        data: [
          {
            id: 5,
            attributes: {
              price: 454354,
              createdAt: '2024-09-22T22:21:05.920Z',
              updatedAt: '2024-09-22T22:21:05.920Z',
              publishedAt: '2024-09-22T22:21:05.914Z',
              quantity: 1,
              product: {
                data: {
                  price: 3443,
                  createdAt: '2024-08-27T04:20:56.562Z',
                  updatedAt: '2024-09-10T04:14:24.736Z',
                  publishedAt: '2024-09-10T04:14:24.732Z',
                  rating: 4,
                  title: 'I phone',
                  imageUrl:
                    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D',
                },
              },
            },
          },
        ],
      },
    },
  },
];

export const MOCK_INVOICE_DETAILS = {
  data: {
    id: MOCK_INVOICES_WITH_CUSTOMER[0].id,
    attributes: {
      ...MOCK_INVOICES_WITH_CUSTOMER[0].attributes,
      invoice_products: {
        data: [
          {
            ...MOCK_INVOICES_WITH_CUSTOMER[0].attributes.invoice_products
              .data[0],
            attributes: {
              product: {
                data: {
                  attributes:
                    MOCK_INVOICES_WITH_CUSTOMER[0].attributes.invoice_products
                      .data[0].attributes.product.data,
                },
              },
            },
          },
        ],
      },
    },
  },
};

export const MOCK_INVOICES_RESPONSE: TInvoiceListResponse = {
  data: MOCK_INVOICES_WITH_CUSTOMER,
  meta: {
    pagination: {
      page: 1,
      pageSize: 10,
      pageCount: 1,
      total: 2,
    },
  },
};

export const MOCK_INVOICE_PRODUCT_RESPONSE: TProductInvoiceResponse[] = [
  {
    id: 1,
    attributes: {
      price: 1200,
      createdAt: '2024-08-27T04:31:42.022Z',
      updatedAt: '2024-09-10T04:15:01.906Z',
      publishedAt: '2024-09-10T04:14:54.432Z',
      quantity: 1,
      product: {
        data: {
          id: 1,
          attributes: {
            id: 1,
            brand: 'Apple',
            description: 'Expensive',
            negotiable: true,
            imageUrl: 'https://example.com/image1.jpg',
            title: 'MacBook Pro',
            price: 1200,
            rating: 4.5,
          },
        },
      },
    },
  },
  {
    id: 2,
    attributes: {
      price: 1,
      createdAt: '2024-08-27T04:31:42.022Z',
      updatedAt: '2024-09-10T04:55:01.906Z',
      publishedAt: '2024-09-10T04:57:54.432Z',
      quantity: 10,
      product: {
        data: {
          id: 1,
          attributes: {
            id: 1,
            brand: 'Apple',
            description: 'Expensive',
            negotiable: true,
            imageUrl: 'https://example.com/image1.jpg',
            title: 'MacBook Pro',
            price: 1200,
            rating: 4.5,
          },
        },
      },
    },
  },
];
