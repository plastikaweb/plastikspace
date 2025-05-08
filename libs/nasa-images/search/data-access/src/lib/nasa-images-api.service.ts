import { Injectable } from '@angular/core';
import { ApiService } from '@plastik/core/api';
import {
  NasaImagesApiSegment,
  NasaImagesSearch,
  NasaImagesSearchApiParams,
  NasaImagesSearchApiResponse,
} from '@plastik/nasa-images/search/entities';
import { latinize } from '@plastik/shared/latinize';

@Injectable({
  providedIn: 'root',
})
export class NasaImagesApiService extends ApiService<NasaImagesSearch, NasaImagesSearchApiParams> {
  protected resourceUrlSegment(): NasaImagesApiSegment {
    return 'search';
  }

  protected override mapListResponse({
    collection: {
      metadata: { total_hits: count },
      items,
    },
  }: NasaImagesSearchApiResponse): NasaImagesSearch {
    const mappedItems = items.map(({ data, links }) => {
      const {
        nasa_id: id,
        title: name,
        date_created,
        description,
        keywords,
        center,
        location,
        secondary_creator: creator,
      } = data[0];

      return {
        id,
        name,
        normalizedName: latinize(name).toLowerCase(),
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
