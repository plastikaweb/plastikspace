import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectRouteQueryParams } from '@plastik/core/router-state';
import { NasaImage } from '@plastik/nasa-images/search/entities';
import { FormattingTypes } from '@plastik/shared/formatters';
import { DEFAULT_TABLE_CONFIG, PageEventConfig, TableColumnFormatting, TableControlStructure } from '@plastik/shared/table/entities';
import { map, Observable } from 'rxjs';

const index: TableColumnFormatting<NasaImage, FormattingTypes.CUSTOM> = {
  key: 'index',
  title: '',
  propertyPath: '',
  cssClasses: ['max-w-[5rem] hidden md:flex'],
  formatting: {
    type: FormattingTypes.CUSTOM,
    execute: (_, __, index = 0, extraConfig) => {
      const { pageIndex, pageSize } = extraConfig as PageEventConfig;
      return String(index + pageIndex * pageSize);
    },
  },
};

const id: TableColumnFormatting<NasaImage, FormattingTypes.TEXT> = {
  key: 'id',
  title: 'ID',
  propertyPath: 'id',
  cssClasses: ['min-w-[9rem] lg:min-w-[12rem]'],
  formatting: {
    type: FormattingTypes.TEXT,
  },
  sticky: true,
};

const title: TableColumnFormatting<NasaImage, FormattingTypes.TEXT> = {
  key: 'title',
  title: 'Title',
  propertyPath: 'title',
  cssClasses: ['min-w-[7rem] lg:max-w-[25rem]'],
  formatting: {
    type: FormattingTypes.TEXT,
  },
};

const description: TableColumnFormatting<NasaImage, FormattingTypes.TEXT> = {
  key: 'description',
  title: 'Description',
  propertyPath: 'description',
  cssClasses: ['min-w-[9rem] 2xl:min-w-[24rem]', 'content-center truncate ...'],
  formatting: {
    type: FormattingTypes.TEXT,
  },
};

const dateCreated: TableColumnFormatting<NasaImage, FormattingTypes.DATE> = {
  key: 'dateCreated',
  title: 'Created',
  propertyPath: 'dateCreated',
  cssClasses: ['max-w-[6rem]'],
  formatting: {
    type: FormattingTypes.DATE,
    extras: { numberDigitsInfo: 'longDate' },
  },
};

const thumbnail: TableColumnFormatting<NasaImage, FormattingTypes.IMAGE> = {
  key: 'thumbnail',
  title: 'Image',
  propertyPath: 'thumbnail',
  cssClasses: ['max-w-[120px] min-w-[100px]'],
  formatting: {
    type: FormattingTypes.IMAGE,
    extras: {
      type: 'img',
      title: (item: NasaImage) => item.title,
      classes: 'object-cover h-[100px] w-[100px] rounded-md',
    },
  },
};

const creator: TableColumnFormatting<NasaImage, FormattingTypes.TEXT> = {
  key: 'creator',
  title: 'Creator',
  propertyPath: 'creator',
  cssClasses: ['max-w-[16rem]', 'xl:whitespace-normal content-center truncate ...'],
  formatting: {
    type: FormattingTypes.TEXT,
  },
};

const center: TableColumnFormatting<NasaImage, FormattingTypes.TEXT> = {
  key: 'center',
  title: 'Center',
  propertyPath: 'center',
  cssClasses: ['max-w-[5rem] lg:max-w-[6rem]'],
  formatting: {
    type: FormattingTypes.TEXT,
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
      map(({ page }) => {
        return {
          ...defaultTableConfig,
          columnProperties,
          pageSizeOptions: [100],
          pagination: {
            ...defaultTableConfig.pagination,
            pageSize: 100,
            pageIndex: --page || 0,
          },
          paginationVisibility: {
            hidePageSize: true,
            hideRangeLabel: true,
            hideRangeButtons: false,
            hidePaginationFirstLastButtons: false,
          },
        };
      }),
    );
  }
}
