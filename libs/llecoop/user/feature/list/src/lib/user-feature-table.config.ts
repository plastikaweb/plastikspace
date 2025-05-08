import { filter, take } from 'rxjs';

import { inject, Injectable, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Signal } from '@ngrx/signals/src/deep-signal';
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
    cssClasses: ['min-w-[45px] max-w-[45px] p-0 pl-sm'],
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
    cssClasses: ['min-w-[200px]'],
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

  readonly #address: TableColumnFormatting<LlecoopUser, 'TEXT'> = {
    key: 'address',
    title: `Adreça d'entrega`,
    pathToKey: 'address',
    cssClasses: ['hidden @xl:flex @xl:min-w-[120px]'],
    formatting: {
      type: 'TEXT',
    },
  };

  readonly #phone: TableColumnFormatting<LlecoopUser, 'TEXT'> = {
    key: 'phone',
    title: `Telèfon de contacte`,
    pathToKey: 'phone',
    cssClasses: ['hidden @xl:flex @xl:min-w-[120px]'],
    formatting: {
      type: 'TEXT',
    },
  };

  readonly #createdAt = createdAt<LlecoopUser>();
  readonly #updatedAt = updatedAt<LlecoopUser>();

  readonly #columnProperties: Signal<TableColumnFormatting<LlecoopUser, FormattingTypes>[]> =
    signal([
      this.#isAdmin,
      this.#name,
      this.#email,
      this.#phone,
      this.#address,
      this.#registered,
      this.#emailVerified,
      this.#createdAt,
      this.#updatedAt,
    ]);

  getTableDefinition() {
    const defaultTableConfig = inject(DEFAULT_TABLE_CONFIG);

    return {
      ...defaultTableConfig,
      columnProperties: this.#columnProperties,
      sort: this.#store.sorting,
      pagination: this.#store.pagination,
      caption: "Llistat d'usuaris",
      getData: () => this.#store.entities(),
      count: this.#store.count,
      actionsColStyles: 'max-w-[110px]',
      actions: {
        SET_ADMIN: {
          visible: () => true,
          disabled: (user: LlecoopUser) => !user.registered || !user.emailVerified || user.isAdmin,
          description: user => `Donar permisos d'administració a "${user.name || user.email}"`,
          order: 1,
          icon: () => 'person',
          execute: (user: LlecoopUser) => {
            if (user.id && !user.isAdmin) {
              this.#confirmService
                .confirm(
                  "Donar permisos d'administració",
                  `Segur que vols donar permisos d'administració a "${user.name || user.email}"?`,
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
          disabled: user => user.isAdmin,
          description: user => `Eliminar sòcia "${user.name || user.email}"`,
          order: 2,
        },
      },
    } as TableDefinition<LlecoopUser>;
  }
}
