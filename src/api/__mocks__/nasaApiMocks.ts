import { NasaApiResponse } from '../nasaApi';

export const HTTP_STATUS_MESSAGES: Record<number, string> = {
  200: 'OK',
  400: 'Bad Request',
  404: 'Not Found',
  500: 'Internal Server Error',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
};

export const mockResponseData = (status: number, data?: NasaApiResponse) => ({
  status,
  statusText: HTTP_STATUS_MESSAGES[status] || 'Unknown Status',
  ok: status >= 200 && status < 300,
  data,
  json: async () => data,
});

export const mockNASAData: NasaApiResponse = {
  collection: {
    items: [
      {
        data: [
          {
            nasa_id: 'as11-40-5874',
            title: 'Apollo 11 Mission Image',
            description: "Astronaut's boot print in lunar soil",
            date_created: '1969-07-20T00:00:00Z',
            media_type: 'image',
            keywords: ['Apollo 11', 'Moon', 'Lunar Surface'],
          },
        ],
        links: [
          {
            href: 'https://images-assets.nasa.gov/image/as11-40-5874/as11-40-5874~thumb.jpg',
            rel: 'preview',
            render: 'image',
          },
        ],
      },
      {
        data: [
          {
            nasa_id: 'as11-40-5875',
            title: 'Saturn V Launch',
            description: 'Saturn V rocket lifting off',
            date_created: '1969-07-16T00:00:00Z',
            media_type: 'image',
            keywords: ['Apollo 11', 'Saturn V', 'Launch'],
          },
        ],
        links: [
          {
            href: 'https://images-assets.nasa.gov/image/as11-40-5875/as11-40-5875~thumb.jpg',
            rel: 'preview',
          },
        ],
      },
    ],
  },
};
