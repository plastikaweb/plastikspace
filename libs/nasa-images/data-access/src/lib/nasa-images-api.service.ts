import { Injectable } from '@angular/core';
import { ApiService } from '@plastik/core/api';
import { NasaImagesSearch, NasaImagesSearchApiParams, NasaImagesSearchApiResponse } from '@plastik/nasa-images/entities';

@Injectable({
  providedIn: 'root',
})
export class NasaImagesApiService extends ApiService<NasaImagesSearch, NasaImagesSearchApiParams> {
  protected resourceUrlSegment(): string {
    // TODO: This shouldn't be a hardcore string
    return 'search';
  }

  protected override mapListResponse({
    collection: {
      metadata: { total_hits: count },
      items,
    },
  }: NasaImagesSearchApiResponse): NasaImagesSearch {
    const mappedItems = items.map(({ data, links }) => {
      const { nasa_id, title, date_created, description, keywords, location, secondary_creator } = data[0];

      return {
        id: nasa_id,
        title,
        description,
        keywords,
        dateCreated: new Date(date_created),
        creator: secondary_creator,
        links,
        location,
      };
    });

    return {
      count,
      items: mappedItems,
    };
  }
}
