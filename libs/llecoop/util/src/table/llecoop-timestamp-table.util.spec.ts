import { BaseEntity } from '@plastik/core/entities';

import {
  createdAt,
  createFirebaseTimestampTableColumn,
  updatedAt,
} from './llecoop-timestamp-table.util';

describe('createFirebaseTimestampTableColumn', () => {
  it('should create a Firebase timestamp column with default settings', () => {
    const config = createFirebaseTimestampTableColumn<BaseEntity>({
      key: 'timestamp',
      title: 'Timestamp',
      pathToKey: 'timestamp',
      cssClasses: ['test-class'],
    });
    expect(config.key).toBe('timestamp');
    expect(config.title).toBe('Timestamp');
    expect(config.pathToKey).toBe('timestamp');
    expect(config.cssClasses).toContain('test-class');
    expect(config.formatting.type).toBe('FIREBASE_TIMESTAMP');
  });
});

describe('createdAt', () => {
  it('should create a createdAt column', () => {
    const config = createdAt<BaseEntity>();
    expect(config.key).toBe('createdAt');
    expect(config.title).toBe('Data de creació');
    expect(config.pathToKey).toBe('createdAt');
    expect(config.formatting.type).toBe('FIREBASE_TIMESTAMP');
  });
});

describe('updatedAt', () => {
  it('should create an updatedAt column', () => {
    const config = updatedAt<BaseEntity>();
    expect(config.key).toBe('updatedAt');
    expect(config.title).toBe('Data de modificació');
    expect(config.pathToKey).toBe('updatedAt');
    expect(config.formatting.type).toBe('FIREBASE_TIMESTAMP');
  });
});
