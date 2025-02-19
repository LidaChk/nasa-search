import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { MAX_API_PAGE_NUMBER, PAGE_SIZE } from '../constants/constants';
import { PaginationInfo, SearchResultItem } from '../types/types';
import type { SearchParams, NasaApiResponse } from './nasaTypes';
import { mapNasaCollectionItemToSearchResultItem } from './nasaTransforms';

const API_KEY = 'dW64E3BgmZbrImMrdMSk0hzNIOdpOqtqEGvvz8Ud';
const BASE_URL = 'https://images-api.nasa.gov';

export const nasaApi = createApi({
  reducerPath: 'nasaApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      headers.set('Authorization', `Bearer ${API_KEY}`);
      return headers;
    },
  }),
  tagTypes: ['NasaImages'],
  endpoints: (builder) => ({
    searchImages: builder.query<
      { items: SearchResultItem[]; pagination: PaginationInfo },
      SearchParams
    >({
      query: (params) => {
        const { query, nasaId, page = 1, pageSize = PAGE_SIZE } = params;
        const searchParams = new URLSearchParams();

        if (query) searchParams.set('q', query);
        if (nasaId) searchParams.set('nasa_id', nasaId);
        searchParams.set('media_type', 'image');
        searchParams.set('page', page.toString());
        searchParams.set('page_size', pageSize.toString());

        return {
          url: '/search',
          params: searchParams,
        };
      },
      transformResponse: (response: NasaApiResponse, _meta, arg) => {
        if (!response?.collection?.items) {
          throw new Error('Invalid response format from NASA API');
        }

        const totalItems = response.collection?.metadata?.total_hits || 0;
        const calcTotalPages = Math.ceil(
          totalItems / (arg.pageSize || PAGE_SIZE)
        );
        const totalPages = Math.min(calcTotalPages, MAX_API_PAGE_NUMBER);

        return {
          items: response.collection.items.map(
            mapNasaCollectionItemToSearchResultItem
          ),
          pagination: {
            currentPage: arg.page || 1,
            totalPages,
            pageSize: arg.pageSize || PAGE_SIZE,
          },
        };
      },
      keepUnusedDataFor: 300,
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ nasaId }) => ({
                type: 'NasaImages' as const,
                id: nasaId,
              })),
              { type: 'NasaImages', id: 'LIST' },
            ]
          : [{ type: 'NasaImages', id: 'LIST' }],
    }),

    getImageDetails: builder.query<SearchResultItem, string>({
      query: (nasaId) => ({
        url: '/search',
        params: {
          nasa_id: nasaId,
          media_type: 'image',
        },
      }),
      transformResponse: (response: NasaApiResponse) => {
        if (!response?.collection?.items?.[0]) {
          throw new Error('Image not found');
        }
        return mapNasaCollectionItemToSearchResultItem(
          response.collection.items[0]
        );
      },
      providesTags: (_result, _error, nasaId) => [
        { type: 'NasaImages', id: nasaId },
      ],
    }),
  }),
});

export const {
  useSearchImagesQuery,
  useGetImageDetailsQuery,
  useLazySearchImagesQuery,
  useLazyGetImageDetailsQuery,
} = nasaApi;

export const { endpoints } = nasaApi;
