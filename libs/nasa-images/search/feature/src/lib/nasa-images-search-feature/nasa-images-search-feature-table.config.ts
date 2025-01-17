import { map, Observable } from 'rxjs';

import { inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { select, Store } from '@ngrx/store';
import { selectRouteQueryParams } from '@plastik/core/router-state';
import { selectNasaImagesFeature } from '@plastik/nasa-images/search/data-access';
import { NasaImage } from '@plastik/nasa-images/search/entities';
import { FormattingTypes } from '@plastik/shared/formatters';
import {
  DEFAULT_TABLE_CONFIG,
  PageEventConfig,
  TableColumnFormatting,
  TableDefinition,
} from '@plastik/shared/table/entities';

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
  cssClasses: [
    'min-w-[12rem] hidden md:flex lg:min-w-[14rem]',
    'text-sm text-white bg-secondary-dark rounded-md p-tiny',
  ],
  formatting: {
    type: 'TEXT',
  },
};

const title: TableColumnFormatting<NasaImage, 'TEXT'> = {
  key: 'name',
  title: 'Title',
  propertyPath: 'name',
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
    extras: () => ({ numberDigitsInfo: 'longDate' }),
  },
};

const thumbnail: TableColumnFormatting<NasaImage, 'IMAGE'> = {
  key: 'thumbnail',
  title: 'Image',
  propertyPath: 'thumbnail',
  cssClasses: [
    'max-w-[120px] max-h-[120px] relative',
    'object-cover size-[120px] rounded-2xl p-tiny',
  ],
  formatting: {
    type: 'IMAGE',
    extras: () => ({ placeholder: 'https://via.placeholder.com/120x120' }),
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
  static getTableDefinition() {
    const store = inject(Store);
    const defaultTableConfig = inject(DEFAULT_TABLE_CONFIG);
    const count = toSignal(store.pipe(select(selectNasaImagesFeature.selectCount)));

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
          count,
          caption: 'Nasa Images Table Results',
        };
      })
    ) as Observable<TableDefinition<NasaImage>>;
  }
}
