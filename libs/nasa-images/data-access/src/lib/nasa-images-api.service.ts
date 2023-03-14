import { Injectable } from '@angular/core';
import { ApiService } from '@plastik/core/api';
import { NasaImagesSearch, NasaImagesSearchApiParams, NasaImagesSearchApiResponse, NasaImagesViews } from '@plastik/nasa-images/entities';

@Injectable({
  providedIn: 'root',
})
export class NasaImagesApiService extends ApiService<NasaImagesSearch, NasaImagesSearchApiParams> {
  protected resourceUrlSegment(): string {
    return NasaImagesViews.SEARCH;
  }

  protected override mapListResponse({
    collection: {
      metadata: { total_hits: count },
      items,
    },
  }: NasaImagesSearchApiResponse): NasaImagesSearch {
    const mappedItems = items.map(({ data, links }) => {
      const { nasa_id: id, title, date_created, description, keywords, center, location, secondary_creator: creator } = data[0];

      return {
        id,
        title,
        description,
        keywords,
        dateCreated: new Date(date_created),
        thumbnail: links[0].href,
        center,
        location,
        creator,
      };
    });

    return {
      count,
      items: mappedItems,
    };
  }
}
