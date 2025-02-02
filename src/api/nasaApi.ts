import { searchResultItem } from '../types/types';

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
  [key: string]: string | string[] | undefined;
}

interface ImageLink {
  href: string;
  rel: string;
  render?: string;
  size?: string;
}

export interface nasaCollectionItem {
  data: NasaImageData[];
  links: ImageLink[];
}
export interface NasaApiResponse {
  collection: {
    items: nasaCollectionItem[];
  };
}

function mapNasaCollectionItemToSearchResultItem(
  item: nasaCollectionItem
): searchResultItem {
  const links = item.links.sort((a, b) => {
    return parseInt(a.size || '0') - parseInt(b.size || '0');
  });
  return {
    nasaId: item.data[0].nasa_id,
    title: item.data[0].title,
    description: item.data[0].description,
    dateCreated: item.data[0].date_created,
    keywords: item.data[0].keywords,
    preview: new URL(
      links.find((link) => link.rel === 'preview')?.href || links[0].href
    ),
    href: new URL(
      links.find((link) => link.rel === 'canonical')?.href ||
        links[links.length - 1].href
    ),
  };
}

export async function searchImages(
  params: SearchParams
): Promise<searchResultItem[]> {
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

    return data.collection.items.map(mapNasaCollectionItemToSearchResultItem);
  } catch (error) {
    console.error('Error searching NASA images:', error);
    throw error;
  }
}
