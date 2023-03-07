import { NasaImage } from '@plastik/nasa-images/entities';
import { FormattingTypes } from '@plastik/shared/formatters';
import { defaultTableConfig, TableColumnFormatting, TableControlStructure } from '@plastik/shared/table/entities';

const index: TableColumnFormatting<NasaImage, FormattingTypes.CUSTOM> = {
  key: 'index',
  title: '',
  propertyPath: '',
  cssClasses: 'max-w-[4rem] lg:max-w-[10rem]',
  formatting: {
    type: FormattingTypes.CUSTOM,
    execute: (_, __, index) => String(index),
  },
};

const id: TableColumnFormatting<NasaImage, FormattingTypes.TEXT> = {
  key: 'id',
  title: 'ID',
  propertyPath: 'id',
  formatting: {
    type: FormattingTypes.TEXT,
  },
};

const title: TableColumnFormatting<NasaImage, FormattingTypes.TEXT> = {
  key: 'title',
  title: 'Title',
  propertyPath: 'title',
  cssClasses: 'min-w-[7rem] lg:min-w-[8rem]',
  formatting: {
    type: FormattingTypes.TEXT,
  },
};

const description: TableColumnFormatting<NasaImage, FormattingTypes.TEXT> = {
  key: 'description',
  title: 'Description',
  propertyPath: 'description',
  cssClasses: 'min-w-[9rem] 2xl:min-w-[24rem]',
  formatting: {
    type: FormattingTypes.TEXT,
  },
};

const dateCreated: TableColumnFormatting<NasaImage, FormattingTypes.DATE> = {
  key: 'dateCreated',
  title: 'Created',
  propertyPath: 'dateCreated',
  formatting: {
    type: FormattingTypes.DATE,
    extras: { numberDigitsInfo: 'longDate' },
  },
};

const thumbnail: TableColumnFormatting<NasaImage, FormattingTypes.IMAGE> = {
  key: 'thumbnail',
  title: 'Image',
  propertyPath: 'thumbnail',
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
  cssClasses: 'min-w-[6rem] lg:min-w-[6.5rem] xl:min-w-[7rem]',
  formatting: {
    type: FormattingTypes.TEXT,
  },
};

const center: TableColumnFormatting<NasaImage, FormattingTypes.TEXT> = {
  key: 'center',
  title: 'Center',
  propertyPath: 'center',
  cssClasses: 'min-w-[5rem] lg:min-w-[6rem] xl:min-w-[7.5rem]',
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

export class NasaImagesFeatureSearchTableConfig {
  static getTableStructure(): TableControlStructure<NasaImage> {
    return {
      ...defaultTableConfig,
      columnProperties,
    };
  }
}
