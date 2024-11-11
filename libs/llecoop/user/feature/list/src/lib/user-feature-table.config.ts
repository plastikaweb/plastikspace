import { inject, Injectable, signal, Signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LlecoopUser } from '@plastik/llecoop/entities';
import { LLecoopUserStore } from '@plastik/llecoop/user/data-access';
import { createdAt, updatedAt } from '@plastik/llecoop/util';
import { SharedConfirmDialogService } from '@plastik/shared/confirm';
import { FormattingTypes } from '@plastik/shared/formatters';
import {
  DEFAULT_TABLE_CONFIG,
  TableColumnFormatting,
  TableDefinition,
  TableStructureConfig,
} from '@plastik/shared/table/entities';
import { filter, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LlecoopUserSearchFeatureTableConfig implements TableStructureConfig<LlecoopUser> {
  private readonly store = inject(LLecoopUserStore);
  private readonly confirmService = inject(SharedConfirmDialogService);
  private readonly sanitizer = inject(DomSanitizer);

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

  private readonly isAdmin: TableColumnFormatting<LlecoopUser, 'CUSTOM'> = {
    key: 'isAdmin',
    title: 'Administrador',
    propertyPath: 'isAdmin',
    cssClasses: ['min-w-[50px]'],
    formatting: {
      type: 'CUSTOM',
      execute: (_, user) =>
        user?.isAdmin
          ? this.sanitizer.bypassSecurityTrustHtml(
              '<span class="material-icons text-primary-dark bg-gray-10 rounded-full p-tiny m-tiny">shield</span>'
            )
          : '',
    },
  };

  private readonly email: TableColumnFormatting<LlecoopUser, 'TEXT'> = {
    key: 'email',
    title: 'Correu electrònic',
    propertyPath: 'email',
    cssClasses: ['min-w-[210px]'],
    sticky: true,
    sorting: true,
    formatting: {
      type: 'TEXT',
    },
  };

  private readonly registered: TableColumnFormatting<LlecoopUser, 'CUSTOM'> = {
    key: 'registered',
    title: 'Registrat',
    propertyPath: 'registered',
    cssClasses: ['hidden md:flex min-w-[100px]'],
    sorting: true,
    formatting: {
      type: 'CUSTOM',
      execute: (_, user) => (user?.registered ? '✔' : '✘'),
    },
  };

  private readonly emailVerified: TableColumnFormatting<LlecoopUser, 'CUSTOM'> = {
    key: 'emailVerified',
    title: 'Verificat',
    propertyPath: 'emailVerified',
    cssClasses: ['hidden md:flex min-w-[100px]'],
    sorting: true,
    formatting: {
      type: 'CUSTOM',
      execute: (_, user) => (user?.emailVerified ? '✔' : '✘'),
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
    this.isAdmin,
    this.email,
    this.registered,
    this.emailVerified,
    this.createdAt,
    this.updatedAt,
  ];

  getTableDefinition() {
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
      sort: this.store.sorting,
      caption: "Llistat d'usuaris",
      count: this.store.count,
      getData: () => this.store.entities(),
      actionsColStyles: 'max-w-[135px]',
      actions: {
        DELETE: {
          visible: (user: LlecoopUser) => !user.isAdmin,
          description: () => "Elimina l'usuari",
          order: 1,
        },
        SET_ADMIN: {
          visible: (user: LlecoopUser) =>
            !user.isAdmin && !!user.registered && !!user.emailVerified,
          description: () => "Fes l'usuari administrador",
          order: 2,
          icon: () => 'person',
          execute: (user: LlecoopUser) => {
            if (user.id && !user.isAdmin) {
              this.confirmService
                .confirm(
                  "Donar permisos d'administrador",
                  `Segur que vols fer administrador a "${user.email}"?`,
                  'Cancel·lar',
                  'Acceptar'
                )
                .pipe(take(1), filter(Boolean))
                .subscribe(() => this.store.setAdmin({ id: user.id }));
            }
          },
        },
      },
    }) as Signal<TableDefinition<LlecoopUser>>;
  }
}
