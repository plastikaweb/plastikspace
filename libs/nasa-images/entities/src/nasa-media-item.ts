export enum NasaImagesViews {
  SEARCH = 'search',
  EXPLANATION = 'explanation',
}
/**
 * @description A single NASA media item descriptor.
 */
export interface NasaImage extends Record<string, string | string[] | Date | NasaImageLink[] | undefined> {
  id: string;
  title: string;
  description: string;
  dateCreated: Date;
  creator: string;
  thumbnail: string;
  center?: string;
  keywords?: string[];
}

/**
 * @description Descriptor for the links property in NasaImagesSearchApiItemResponse.
 */
export interface NasaImageLink {
  href: string;
}

/**
 * @description The parameters for searching and paginating in NASA Images API.
 */
export interface NasaImagesSearchApiParams {
  /**
   * Free text search terms to compare to all indexed metadata in NASA images server.
   */
  q: string;
  /**
   * Page number, starting at 1, of results to get.
   */
  page?: number;
  /**
   * The start year for results. Format: YYYY.
   */
  yearStart?: number;
  /**
   * The end year for results. Format: YYYY.
   */
  yearEnd?: number;
}

/**
 * @description The original NASA Images search API response.
 */
export interface NasaImagesSearchApiResponse {
  collection: {
    items: {
      data: {
        nasa_id: string;
        title: string;
        date_created: string;
        description: string;
        keywords: string[];
        center: string;
        secondary_creator: string;
      }[];
      links: NasaImageLink[];
    }[];
    metadata: { total_hits: number };
  };
}

/**
 * @description The cleaned up response from NASA Images search API request.
 */
export interface NasaImagesSearch {
  items: NasaImage[];
  count: number;
}

/**
 * @description Blueprint response when API returns an error.
 */
export interface NasaImagesSearchApiError {
  reason: string;
}
