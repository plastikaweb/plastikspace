import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectRouteQueryParams } from '@plastik/core/router-state';
import { NasaImage } from '@plastik/nasa-images/search/entities';
import { FormattingTypes } from '@plastik/shared/formatters';
import { DEFAULT_TABLE_CONFIG, PageEventConfig, TableColumnFormatting, TableControlStructure } from '@plastik/shared/table/entities';
import { Observable, map } from 'rxjs';

const index: TableColumnFormatting<NasaImage, 'CUSTOM'> = {
  key: 'index',
  title: '#',
  propertyPath: '',
  cssClasses: ['min-w-[4rem] hidden md:flex'],
  formatting: {
    type: 'CUSTOM',
    execute: (_, __, index = 0, extraConfig) => {
      const { pageIndex, pageSize } = extraConfig as PageEventConfig;
      return String(index + pageIndex * pageSize);
    },
  },
  sticky: true,
};

const id: TableColumnFormatting<NasaImage, 'TEXT'> = {
  key: 'id',
  title: 'ID',
  propertyPath: 'id',
  cssClasses: ['min-w-[12rem] hidden md:flex lg:min-w-[14rem]', 'text-sm text-black bg-secondary rounded-md p-tiny sepia'],
  formatting: {
    type: 'TEXT',
  },
};

const title: TableColumnFormatting<NasaImage, 'TEXT'> = {
  key: 'title',
  title: 'Title',
  propertyPath: 'title',
  cssClasses: ['min-w-[10rem] lg:max-w-[25rem]', 'content-center line-clamp-5'],
  formatting: {
    type: 'TEXT',
  },
};

const description: TableColumnFormatting<NasaImage, 'TEXT'> = {
  key: 'description',
  title: 'Description',
  propertyPath: 'description',
  cssClasses: ['min-w-[9rem] 2xl:min-w-[24rem] hidden md:flex', 'content-center line-clamp-4'],
  formatting: {
    type: 'TEXT',
  },
};

const dateCreated: TableColumnFormatting<NasaImage, 'DATE'> = {
  key: 'dateCreated',
  title: 'Created',
  propertyPath: 'dateCreated',
  cssClasses: ['min-w-[6rem]'],
  formatting: {
    type: 'DATE',
    extras: { numberDigitsInfo: 'longDate' },
  },
};

const thumbnail: TableColumnFormatting<NasaImage, 'IMAGE'> = {
  key: 'thumbnail',
  title: 'Image',
  propertyPath: 'thumbnail',
  cssClasses: ['max-w-[200px] min-w-[120px]'],
  formatting: {
    type: 'IMAGE',
    extras: {
      type: 'img',
      title: (item: NasaImage) => item.title,
      classes: 'object-cover h-[100px] w-[100px] rounded-md',
    },
  },
};

const creator: TableColumnFormatting<NasaImage, 'TEXT'> = {
  key: 'creator',
  title: 'Creator',
  propertyPath: 'creator',
  cssClasses: ['max-w-[16rem] hidden md:flex', 'xl:whitespace-normal content-center line-clamp-4'],
  formatting: {
    type: 'TEXT',
  },
};

const center: TableColumnFormatting<NasaImage, 'TEXT'> = {
  key: 'center',
  title: 'Center',
  propertyPath: 'center',
  cssClasses: ['max-w-[5rem] hidden md:flex lg:max-w-[6rem]'],
  formatting: {
    type: 'TEXT',
  },
};

const columnProperties: TableColumnFormatting<NasaImage, FormattingTypes>[] = [
  index,
  id,
  title,
  thumbnail,
  description,
  dateCreated,
  creator,
  center,
];

export class NasaImagesSearchFeatureTableConfig {
  static getTableStructure(): Observable<TableControlStructure<NasaImage>> {
    const store = inject(Store);
    const defaultTableConfig = inject(DEFAULT_TABLE_CONFIG);

    return store.select(selectRouteQueryParams).pipe(
      map(({ page = 0 }) => {
        return {
          ...defaultTableConfig,
          columnProperties,
          pageSizeOptions: [100],
          pagination: {
            ...defaultTableConfig.pagination,
            pageSize: 100,
            pageIndex: --page,
          },
          paginationVisibility: {
            hidePageSize: true,
            hideRangeLabel: true,
            hideRangeButtons: false,
            hidePaginationFirstLastButtons: false,
          },
          caption: 'Nasa Images Table Results',
        };
      }),
    );
  }
}
