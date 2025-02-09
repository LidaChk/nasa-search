export interface SearchResultItem {
  nasaId: string;
  title: string;
  description: string;
  dateCreated: string;
  keywords?: string[];
  preview: URL;
  href: URL;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  pageSize: number;
}
