import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { LlecoopUser } from '@plastik/llecoop/entities';
import { LLecoopUserStore } from '@plastik/llecoop/user/data-access';
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
  private readonly store = inject(LLecoopUserStore);
  // private readonly name: TableColumnFormatting<LlecoopUser, 'TEXT'> = {
  //   key: 'name',
  //   title: 'Nom',
  //   propertyPath: 'name',
  //   sorting: true,
  //   cssClasses: ['min-w-[240px]'],
  //   formatting: {
  //     type: 'TEXT',
  //   },
  // };

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

  private readonly registered: TableColumnFormatting<LlecoopUser, 'CUSTOM'> = {
    key: 'registered',
    title: 'Registrat',
    propertyPath: 'registered',
    cssClasses: ['min-w-[100px]'],
    formatting: {
      type: 'CUSTOM',
      execute: (_, element) => (element?.registered ? '✔' : '✘'),
    },
  };

  private readonly emailVerified: TableColumnFormatting<LlecoopUser, 'CUSTOM'> = {
    key: 'emailVerified',
    title: 'Correu electrònic verificat',
    propertyPath: 'emailVerified',
    cssClasses: ['min-w-[100px]'],
    formatting: {
      type: 'CUSTOM',
      execute: (_, element) => (element?.emailVerified ? '✔' : '✘'),
    },
  };

  private readonly isAdmin: TableColumnFormatting<LlecoopUser, 'CUSTOM'> = {
    key: 'isAdmin',
    title: 'Administrador',
    propertyPath: 'isAdmin',
    cssClasses: ['min-w-[100px]'],
    formatting: {
      type: 'CUSTOM',
      execute: (_, element) => (element?.isAdmin ? '✔' : '✘'),
    },
  };

  // private readonly address: TableColumnFormatting<LlecoopUser, 'TEXT'> = {
  //   key: 'address',
  //   title: `Adreça d'entrega`,
  //   propertyPath: 'address',
  //   cssClasses: ['min-w-[100px]'],
  //   formatting: {
  //     type: 'TEXT',
  //   },
  // };

  // private readonly phone: TableColumnFormatting<LlecoopUser, 'TEXT'> = {
  //   key: 'phone',
  //   title: `Telèfon de contacte`,
  //   propertyPath: 'phone',
  //   cssClasses: ['min-w-[100px]'],
  //   formatting: {
  //     type: 'TEXT',
  //   },
  // };

  private readonly createdAt = createdAt<LlecoopUser>();
  private readonly updatedAt = updatedAt<LlecoopUser>();

  private readonly columnProperties: TableColumnFormatting<LlecoopUser, FormattingTypes>[] = [
    this.email,
    this.registered,
    this.emailVerified,
    this.isAdmin,
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
        SET_ADMIN: {
          visible: () => true,
          description: () => "Fes l'usuari administrador",
          order: 1,
          icon: (user: LlecoopUser) => (!user.isAdmin ? 'person' : 'shield_person'),
          execute: (user: LlecoopUser) => {
            if (user.id && !user.isAdmin) this.store.setAdmin({ id: user.id });
          },
        },
        DELETE: {
          visible: () => true,
          description: () => "Elimina l'usuari",
          order: 2,
        },
      },
    });
  }
}
