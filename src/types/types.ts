export interface SearchResultItem {
  nasaId: string;
  title: string;
  description: string;
  dateCreated: string;
  keywords?: string[];
  preview: string;
  href: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  pageSize: number;
}
