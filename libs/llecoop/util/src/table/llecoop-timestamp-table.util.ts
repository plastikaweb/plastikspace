import { BaseEntity } from '@plastik/core/entities';
import { TableColumnFormatting } from '@plastik/shared/table/entities';

/**
 * Creates a table column formatting for a Firebase timestamp.
 * @template T
 * @param {object} params - The parameters for the table column formatting.
 * @param {string} params.key - The key for the table column.
 * @param {string} params.title - The title for the table column.
 * @param {string} params.pathToKey - The property path for the table column.
 * @param {string[]} params.cssClasses - The CSS classes for the table column.
 * @param {string} [dateDigitsInfo] - The date digits info for formatting.
 * @returns {TableColumnFormatting<T, 'FIREBASE_TIMESTAMP'>} The table column formatting for the Firebase timestamp.
 */
export function createFirebaseTimestampTableColumn<T extends BaseEntity>(
  {
    key,
    title,
    pathToKey,
    cssClasses = ['hidden @5xl:flex @5xl:min-w-[130px]'],
  }: Pick<
    TableColumnFormatting<T, 'FIREBASE_TIMESTAMP'>,
    'key' | 'title' | 'pathToKey' | 'cssClasses'
  >,
  dateDigitsInfo = 'dd/MM/yyyy HH:mm:ss'
): TableColumnFormatting<T, 'FIREBASE_TIMESTAMP'> {
  return {
    key,
    title,
    pathToKey,
    sorting: pathToKey,
    cssClasses,
    formatting: {
      type: 'FIREBASE_TIMESTAMP',
      extras: () => ({
        dateDigitsInfo,
      }),
    },
  };
}

/**
 * Creates a table column formatting for the 'createdAt' timestamp.
 * @template T
 * @returns {TableColumnFormatting<T, 'FIREBASE_TIMESTAMP'>} The table column formatting for the 'createdAt' timestamp.
 */
export function createdAt<T extends BaseEntity>(): TableColumnFormatting<T, 'FIREBASE_TIMESTAMP'> {
  return createFirebaseTimestampTableColumn<T>({
    key: 'createdAt',
    title: 'Data de creació',
    pathToKey: 'createdAt',
  });
}

/**
 * Creates a table column formatting for the 'updatedAt' timestamp.
 * @template T
 * @returns {TableColumnFormatting<T, 'FIREBASE_TIMESTAMP'>} The table column formatting for the 'updatedAt' timestamp.
 */
export function updatedAt<T extends BaseEntity>(): TableColumnFormatting<T, 'FIREBASE_TIMESTAMP'> {
  return createFirebaseTimestampTableColumn<T>({
    key: 'updatedAt',
    title: 'Data de modificació',
    pathToKey: 'updatedAt',
  });
}
