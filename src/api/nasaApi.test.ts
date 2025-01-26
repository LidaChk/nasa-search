import { searchImages } from './nasaApi';
import {
  HTTP_STATUS_MESSAGES,
  mockNASAData,
  mockResponseData,
} from './__mocks__/nasaApiMocks';

declare const global: {
  fetch: jest.Mock;
};

describe('NASA API', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should fetch data from NASA API', async () => {
    (fetch as jest.Mock).mockResolvedValue(mockResponseData(200, mockNASAData));

    const result = await searchImages({ query: 'test' });

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('q=test'),
      expect.any(Object)
    );
    expect(result).toHaveLength(mockNASAData.collection.items.length);
    expect(result[0].data[0].title).toBe(
      mockNASAData.collection.items[0].data[0].title
    );
  });

  it('should support pagination', async () => {
    (fetch as jest.Mock).mockResolvedValue(mockResponseData(200, mockNASAData));

    await searchImages({ query: 'test', page: 2, pageSize: 20 });

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('page=2'),
      expect.any(Object)
    );
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('page_size=20'),
      expect.any(Object)
    );
  });

  it('should handle errors', async () => {
    const status = 500;
    (fetch as jest.Mock).mockResolvedValue(mockResponseData(status));

    await expect(searchImages({ query: 'test' })).rejects.toThrow(
      `NASA API error: ${HTTP_STATUS_MESSAGES[status]}`
    );
  });

  it('should handle empty responses', async () => {
    (fetch as jest.Mock).mockResolvedValue(
      mockResponseData(200, { collection: { items: [] } })
    );

    const result = await searchImages({ query: 'test' });

    expect(result).toHaveLength(0);
  });
});
