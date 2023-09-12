import { NasaImage, NasaImagesSearch, NasaImagesSearchApiResponse } from '@plastik/nasa-images/search/entities';

export const createNasaImagesEntity = (id: string, title = '') =>
  ({
    id,
    title: title || `title-${id}`,
  }) as NasaImage;

export const createDummyNasaImagesSearch = (count = 3) => {
  const items: NasaImage[] = [];

  for (let index = 0; index < count; index++) {
    items.push({
      id: index.toString(),
      title: index.toString(),
      description: '---',
      dateCreated: new Date('2000'),
      creator: 'Creator',
      keywords: [],
      center: '',
      thumbnail: 'thumbnail.jpg',
      location: '',
    });
  }

  return {
    items,
    count,
  } as NasaImagesSearch;
};

export const createDummyNasaImagesSearchApiResponse = (count = 3): NasaImagesSearchApiResponse => {
  const items: NasaImagesSearchApiResponse['collection']['items'] = [];

  for (let index = 0; index < count; index++) {
    items.push({
      data: [
        {
          nasa_id: index.toString(),
          title: index.toString(),
          description: '---',
          date_created: '2000',
          secondary_creator: 'Creator',
          keywords: [],
          center: '',
          location: '',
        },
      ],
      links: [{ href: 'thumbnail.jpg' }],
    });
  }

  return {
    collection: {
      metadata: {
        total_hits: count,
      },
      items,
    },
  };
};
