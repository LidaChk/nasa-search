import { SearchResultItem } from '../../types/types';
import { NasaCollectionItem } from './nasaApi';

export function mapNasaCollectionItemToSearchResultItem(
  item: NasaCollectionItem
): SearchResultItem {
  const links = item.links.sort((a, b) => {
    return parseInt(a.size || '0') - parseInt(b.size || '0');
  });
  return {
    nasaId: item.data[0].nasa_id,
    title: item.data[0].title,
    description: item.data[0].description,
    dateCreated: item.data[0].date_created,
    keywords: item.data[0].keywords,
    preview:
      links.find((link) => link.rel === 'preview')?.href || links[0].href,
    href:
      links.find((link) => link.rel === 'canonical')?.href ||
      links[links.length - 1].href,
  };
}
