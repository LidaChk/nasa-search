const API_KEY = 'dW64E3BgmZbrImMrdMSk0hzNIOdpOqtqEGvvz8Ud';
const BASE_URL = 'https://images-api.nasa.gov/search';

interface SearchParams {
  query: string;
  page?: number;
  pageSize?: number;
}

interface NasaImageData {
  nasa_id: string;
  title: string;
  description: string;
  date_created: string;
  media_type: 'image';
  keywords?: string[];
}

interface ImageLink {
  href: string;
  rel: string;
  render?: string;
}

interface nasaCollectionItem {
  data: NasaImageData[];
  links: ImageLink[];
}
export interface NasaApiResponse {
  collection: {
    items: nasaCollectionItem[];
  };
}

export type ImageResult = nasaCollectionItem[];

export async function searchImages(params: SearchParams): Promise<ImageResult> {
  const { query, page = 1, pageSize = 10 } = params;

  const url = new URL(BASE_URL);
  url.searchParams.set('q', query);
  url.searchParams.set('media_type', 'image');
  url.searchParams.set('page', page.toString());
  url.searchParams.set('page_size', pageSize.toString());

  try {
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`NASA API error: ${response.statusText}`);
    }

    const data: NasaApiResponse = await response.json();

    return data.collection.items || [];
  } catch (error) {
    console.error('Error searching NASA images:', error);
    throw error;
  }
}
