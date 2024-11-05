import { NextRequest } from 'next/server';
import {
  getLocationRequest,
  getLocationSuggestion,
} from '../location-suggestion';
import {
  API_PATH,
  MESSAGES,
  PROCESS_ENV,
  SEARCH_QUERIES,
  STATUS_CODE,
} from '@/constants';
import { formatQuery } from '@/utils';

jest.mock('@/utils', () => ({
  formatQuery: jest.fn(),
}));

describe('getLocationSuggestion', () => {
  const keyword = 'New York';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return location suggestions when fetch is successful', async () => {
    const mockResponseData = [{ id: 1, name: 'New York' }];
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponseData),
    });

    const result = await getLocationSuggestion(keyword);

    expect(global.fetch).toHaveBeenCalledWith(
      `${API_PATH.LOCATION_SUGGESTION}?location=${keyword}`,
    );
    expect(result).toEqual(mockResponseData);
  });

  it('should throw an error when fetch fails', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      statusText: 'Not Found',
    });

    await expect(getLocationSuggestion(keyword)).rejects.toThrow('Not Found');
    expect(global.fetch).toHaveBeenCalledWith(
      `${API_PATH.LOCATION_SUGGESTION}?location=${keyword}`,
    );
  });
});

describe('getLocationRequest', () => {
  const mockApiResponse = { id: 1, name: 'New York' };
  const locationValue = 'New York';
  const request = new NextRequest('https://example.com');

  beforeEach(() => {
    jest.clearAllMocks();
    request.nextUrl.searchParams.append(SEARCH_QUERIES.LOCATION, locationValue);
  });

  it('should return location data when fetch is successful', async () => {
    (formatQuery as jest.Mock).mockReturnValue(
      `text=${locationValue}&apiKey=${PROCESS_ENV.API_LOCATION_KEY}`,
    );

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockApiResponse),
    });

    const result = await getLocationRequest(request);

    expect(global.fetch).toHaveBeenCalledWith(
      `${PROCESS_ENV.API_LOCATION_URL}?text=${locationValue}&apiKey=${PROCESS_ENV.API_LOCATION_KEY}`,
    );
    expect(result).toEqual(mockApiResponse);
  });

  it('should return an error response when location value is missing', async () => {
    const requestWithoutLocation = new NextRequest('https://example.com');

    const response = await getLocationRequest(requestWithoutLocation);

    expect(response.status).toBe(STATUS_CODE.INVALID_PARAM);
    expect(await response.text()).toBe(MESSAGES.LOCATION);
  });
});
