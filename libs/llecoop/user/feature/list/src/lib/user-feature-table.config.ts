import { filter, take } from 'rxjs';

import { inject, Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LlecoopUser } from '@plastik/llecoop/entities';
import { llecoopUserStore } from '@plastik/llecoop/user/data-access';
import { createdAt, updatedAt } from '@plastik/llecoop/util';
import { SharedConfirmDialogService } from '@plastik/shared/confirm';
import { FormattingTypes } from '@plastik/shared/formatters';
import {
  DEFAULT_TABLE_CONFIG,
  TableColumnFormatting,
  TableDefinition,
  TableStructureConfig,
} from '@plastik/shared/table/entities';

@Injectable({
  providedIn: 'root',
})
export class LlecoopUserSearchFeatureTableConfig implements TableStructureConfig<LlecoopUser> {
  readonly #store = inject(llecoopUserStore);
  readonly #confirmService = inject(SharedConfirmDialogService);
  readonly #sanitizer = inject(DomSanitizer);

  readonly #name: TableColumnFormatting<LlecoopUser, 'TEXT'> = {
    key: 'name',
    title: 'Nom / família',
    pathToKey: 'name',
    sorting: 'normalizedName',
    formatting: {
      type: 'TEXT',
    },
  };

  readonly #isAdmin: TableColumnFormatting<LlecoopUser, 'CUSTOM'> = {
    key: 'isAdmin',
    title: 'Rol',
    pathToKey: 'isAdmin',
    cssClasses: ['min-w-[50px] max-w-[50px] p-0 pl-sm'],
    formatting: {
      type: 'CUSTOM',
      execute: (_, user) =>
        user?.isAdmin
          ? this.#sanitizer.bypassSecurityTrustHtml('<span class="material-icons">shield</span>')
          : '<span class="material-icons">face</span>',
    },
  };

  readonly #email: TableColumnFormatting<LlecoopUser, 'TEXT'> = {
    key: 'email',
    title: 'Correu electrònic',
    pathToKey: 'email',
    sticky: true,
    sorting: 'email',
    formatting: {
      type: 'TEXT',
    },
  };

  readonly #registered: TableColumnFormatting<LlecoopUser, 'CUSTOM'> = {
    key: 'registered',
    title: 'Registrat',
    pathToKey: 'registered',
    cssClasses: ['hidden @xl:flex @xl:max-w-[120px]'],
    sorting: 'registered',
    formatting: {
      type: 'CUSTOM',
      execute: (_, user) => (user?.registered ? '✔' : '✘'),
    },
  };

  readonly #emailVerified: TableColumnFormatting<LlecoopUser, 'CUSTOM'> = {
    key: 'emailVerified',
    title: 'Verificat',
    pathToKey: 'emailVerified',
    cssClasses: ['hidden @xl:flex @xl:max-w-[120px]'],
    sorting: 'emailVerified',
    formatting: {
      type: 'CUSTOM',
      execute: (_, user) => (user?.emailVerified ? '✔' : '✘'),
    },
  };

  // readonly #address: TableColumnFormatting<LlecoopUser, 'TEXT'> = {
  //   key: 'address',
  //   title: `Adreça d'entrega`,
  //   pathToKey: 'address',
  //   cssClasses: ['min-w-[100px]'],
  //   formatting: {
  //     type: 'TEXT',
  //   },
  // };

  // readonly #phone: TableColumnFormatting<LlecoopUser, 'TEXT'> = {
  //   key: 'phone',
  //   title: `Telèfon de contacte`,
  //   pathToKey: 'phone',
  //   cssClasses: ['min-w-[100px]'],
  //   formatting: {
  //     type: 'TEXT',
  //   },
  // };

  readonly #createdAt = createdAt<LlecoopUser>();
  readonly #updatedAt = updatedAt<LlecoopUser>();

  readonly #columnProperties: TableColumnFormatting<LlecoopUser, FormattingTypes>[] = [
    this.#isAdmin,
    this.#name,
    this.#email,
    this.#registered,
    this.#emailVerified,
    this.#createdAt,
    this.#updatedAt,
  ];

  getTableDefinition() {
    const defaultTableConfig = inject(DEFAULT_TABLE_CONFIG);

    return {
      ...defaultTableConfig,
      columnProperties: this.#columnProperties,
      sort: this.#store.sorting,
      pagination: this.#store.pagination,
      caption: "Llistat d'usuaris",
      count: this.#store.count,
      getData: () => this.#store.entities(),
      actionsColStyles: 'max-w-[135px]',
      actions: {
        SET_ADMIN: {
          visible: () => true,
          disabled: (user: LlecoopUser) => !user.registered || !user.emailVerified || user.isAdmin,
          description: () => "Fes l'usuari administrador",
          order: 1,
          icon: () => 'person',
          execute: (user: LlecoopUser) => {
            if (user.id && !user.isAdmin) {
              this.#confirmService
                .confirm(
                  "Donar permisos d'administrador",
                  `Segur que vols fer administrador a "${user.email}"?`,
                  'Cancel·lar',
                  'Acceptar'
                )
                .pipe(take(1), filter(Boolean))
                .subscribe(() => this.#store.setAdmin({ id: user.id }));
            }
          },
        },
        DELETE: {
          visible: () => true,
          disabled: (user: LlecoopUser) => user.isAdmin,
          description: () => "Elimina l'usuari",
          order: 2,
        },
      },
    } as TableDefinition<LlecoopUser>;
  }
}
