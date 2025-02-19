export interface SearchParams {
  query?: string;
  nasaId?: string;
  page?: number;
  pageSize?: number;
}

export interface NasaImageData {
  nasa_id: string;
  title: string;
  description: string;
  date_created: string;
  media_type: 'image';
  keywords?: string[];
  [key: string]: string | string[] | undefined;
}

interface ImageLink {
  href: string;
  rel: string;
  render?: string;
  size?: string;
}

export interface NasaCollectionItem {
  data: NasaImageData[];
  links: ImageLink[];
}

export interface NasaApiResponse {
  collection: {
    items: NasaCollectionItem[];
    metadata?: {
      total_hits?: number;
    };
  };
}
