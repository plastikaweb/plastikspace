import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LlecoopProductCategory, LlecoopUser } from '@plastik/llecoop/entities';
import { createdAt, updatedAt } from '@plastik/llecoop/util';
import { FormattingTypes } from '@plastik/shared/formatters';
import {
  DEFAULT_TABLE_CONFIG,
  TableColumnFormatting,
  TableControlStructure,
  TableStructureConfig,
} from '@plastik/shared/table/entities';

@Injectable({
  providedIn: 'root',
})
export class LlecoopUserSearchFeatureTableConfig implements TableStructureConfig<LlecoopUser> {
  private readonly sanitizer = inject(DomSanitizer);

  private readonly id: TableColumnFormatting<LlecoopUser, 'TEXT'> = {
    key: 'id',
    title: 'ID',
    propertyPath: 'id',
    sorting: true,
    cssClasses: ['min-w-[240px]'],
    formatting: {
      type: 'TEXT',
    },
  };

  private readonly name: TableColumnFormatting<LlecoopUser, 'TEXT'> = {
    key: 'name',
    title: 'Nom',
    propertyPath: 'name',
    sorting: true,
    cssClasses: ['min-w-[240px]'],
    formatting: {
      type: 'TEXT',
    },
  };

  private readonly email: TableColumnFormatting<LlecoopUser, 'TEXT'> = {
    key: 'email',
    title: 'Correu electrònic',
    propertyPath: 'email',
    cssClasses: ['lg:min-w-[210px]'],
    sticky: true,
    formatting: {
      type: 'TEXT',
    },
  };

  private readonly address: TableColumnFormatting<LlecoopUser, 'TEXT'> = {
    key: 'address',
    title: `Adreça d'entrega`,
    propertyPath: 'address',
    cssClasses: ['min-w-[100px]'],
    formatting: {
      type: 'TEXT',
    },
  };

  private readonly phone: TableColumnFormatting<LlecoopUser, 'TEXT'> = {
    key: 'phone',
    title: `Telèfon de contacte`,
    propertyPath: 'phone',
    cssClasses: ['min-w-[100px]'],
    formatting: {
      type: 'TEXT',
    },
  };

  private readonly createdAt = createdAt<LlecoopUser>();
  private readonly updatedAt = updatedAt<LlecoopUser>();

  private readonly columnProperties: TableColumnFormatting<LlecoopUser, FormattingTypes>[] = [
    this.id,
    this.email,
    this.name,
    this.address,
    this.phone,
    this.createdAt,
    this.updatedAt,
  ];

  getTableStructure(): WritableSignal<TableControlStructure<LlecoopUser>> {
    const defaultTableConfig = inject(DEFAULT_TABLE_CONFIG);

    return signal({
      ...defaultTableConfig,
      columnProperties: this.columnProperties,
      paginationVisibility: {
        hidePageSize: true,
        hideRangeLabel: true,
        hideRangeButtons: true,
        hidePaginationFirstLastButtons: true,
      },
      caption: "Llistat d'usuaris",
      actions: {
        DELETE: {
          visible: () => true,
          description: () => "Elimina l'usuari",
          order: 1,
        },
      },
    });
  }
}
