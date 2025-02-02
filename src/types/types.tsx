export interface searchResultItem {
  nasaId: string;
  title: string;
  description: string;
  dateCreated: string;
  keywords?: string[];
  preview: URL;
  href: URL;
}
