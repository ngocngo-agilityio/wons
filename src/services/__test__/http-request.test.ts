import { API_PATH, PROCESS_ENV } from '@/constants';
import { Method } from '@/types';
import { httpClient } from '../http-request';

describe('HttpClient', () => {
  const mockBaseUrl = PROCESS_ENV.API_BASE_URL;

  // Define mock types for TInvoiceProductRequest and TInvoiceProductResponse
  type TInvoiceProductRequest = {
    data: { productId: string; quantity: number };
  };
  type TInvoiceProductResponse = { id: string; name: string; quantity: number };

  // Helper function to mock fetch response
  const mockFetchResponse = (
    status: number,
    data: unknown,
    contentType = 'application/json',
  ) => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: status >= 200 && status < 300,
      status,
      json: async () => data,
      text: async () => JSON.stringify(data),
      headers: { get: () => contentType },
    });
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('genericRequest method', () => {
    it('should send POST request with body and return structured response', async () => {
      const mockResponse: TInvoiceProductResponse = {
        id: '1',
        name: 'Product A',
        quantity: 10,
      };
      const productData: TInvoiceProductRequest = {
        data: { productId: '123', quantity: 2 },
      };

      // Mock fetch to return the expected response
      mockFetchResponse(201, { data: mockResponse });

      // Call genericRequest with the specified type arguments
      const result = await httpClient.genericRequest<
        TInvoiceProductRequest,
        { data: TInvoiceProductResponse }
      >({
        method: Method.Post,
        endpoint: API_PATH.INVOICE_PRODUCTS,
        body: productData,
      });

      // Verify the result matches the mocked response
      expect(result).toEqual({ data: mockResponse });

      // Verify fetch was called with the correct arguments
      expect(global.fetch).toHaveBeenCalledWith(
        mockBaseUrl + API_PATH.INVOICE_PRODUCTS,
        {
          method: Method.Post,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        },
      );
    });

    it('should throw an error if response status is not ok (400)', async () => {
      const errorResponse = { message: 'Bad Request', error: 'Invalid data' };

      // Mock fetch to return a 400 response
      mockFetchResponse(400, errorResponse);

      try {
        // Attempt the request and catch the error
        await httpClient.genericRequest<
          TInvoiceProductRequest,
          { data: TInvoiceProductResponse }
        >({
          method: Method.Post,
          endpoint: API_PATH.INVOICE_PRODUCTS,
          body: { data: { productId: '123', quantity: 2 } },
        });
        // If the request did not throw, fail the test
        fail('Expected to throw an error but did not');
      } catch (error) {
        // Ensure the error is what we expect (e.g., the error response object)
        expect(error).toEqual(errorResponse);
      }

      // Verify fetch was called with the correct arguments
      expect(global.fetch).toHaveBeenCalledWith(
        mockBaseUrl + API_PATH.INVOICE_PRODUCTS,
        expect.objectContaining({
          method: Method.Post,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: { productId: '123', quantity: 2 } }),
        }),
      );
    });

    it('should throw an error if response status is not ok (500)', async () => {
      const errorResponse = {
        message: 'Internal Server Error',
        error: 'Server failed',
      };

      // Mock fetch to return a 500 response
      mockFetchResponse(500, errorResponse);

      try {
        // Attempt the request and catch the error
        await httpClient.genericRequest<
          TInvoiceProductRequest,
          { data: TInvoiceProductResponse }
        >({
          method: Method.Post,
          endpoint: API_PATH.INVOICE_PRODUCTS,
          body: { data: { productId: '123', quantity: 2 } },
        });
        // If the request did not throw, fail the test
        fail('Expected to throw an error but did not');
      } catch (error) {
        // Ensure the error is what we expect (e.g., the error response object)
        expect(error).toEqual(errorResponse);
      }

      // Verify fetch was called with the correct arguments
      expect(global.fetch).toHaveBeenCalledWith(
        mockBaseUrl + API_PATH.INVOICE_PRODUCTS,
        expect.objectContaining({
          method: Method.Post,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: { productId: '123', quantity: 2 } }),
        }),
      );
    });
  });
});
