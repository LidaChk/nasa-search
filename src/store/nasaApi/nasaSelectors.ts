import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { PaginationInfo, SearchResultItem } from '../../types/types';

interface QueryData {
  data?: {
    items: SearchResultItem[];
    pagination: PaginationInfo;
  };
}

const selectQueries = (state: RootState) =>
  state.nasaApi.queries as Record<string, QueryData | undefined>;

export const selectAllItems = createSelector([selectQueries], (queries) =>
  Object.values(queries)
    .filter(
      (query): query is QueryData & { data: NonNullable<QueryData['data']> } =>
        Boolean(query?.data?.items)
    )
    .flatMap((query) => query.data.items)
);

export const selectItemFromQueries = (nasaId: string) =>
  createSelector([selectAllItems], (items) =>
    items.find((item) => item.nasaId === nasaId)
  );
