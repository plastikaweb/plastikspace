import { TestBed } from '@angular/core/testing';
import { POCKETBASE_INSTANCE } from './pocketbase.token';
import { PocketBaseCrudService } from './pocketbase-crud.service';
import { EnvironmentPocketBaseWithTranslations } from '@plastik/core/environments';
import { BasePocketBaseEntity } from '@plastik/core/entities';
import { firstValueFrom } from 'rxjs';

type TestEntity = BasePocketBaseEntity & { extra?: string };

class TestPocketBaseCrudService extends PocketBaseCrudService<TestEntity> {
  environment: EnvironmentPocketBaseWithTranslations = {
    production: false,
    name: 'test-app',
    environment: 'test',
    baseApiUrl: 'http://localhost',
    client: 'test',
    languages: ['ca'],
    defaultLanguage: 'ca',
  };

  protected override collectionName(): string {
    return 'tests';
  }

  protected override mapResponse(data: TestEntity): TestEntity {
    return { ...data, normalizedName: String(data.name).toLowerCase() } as TestEntity;
  }
}

describe('PocketBaseCrudService', () => {
  let service: TestPocketBaseCrudService;
  const baseEntity: TestEntity = {
    id: '1',
    name: 'Foo',
    normalizedName: 'FOO',
    collectionId: 'c1',
    collectionName: 'tests',
    created: new Date(),
    updated: new Date(),
  };

  const mockPb = {
    collection: () => ({
      getList: (page: number, perPage: number, _opts: unknown) =>
        Promise.resolve({
          page,
          perPage,
          items: [baseEntity],
          totalItems: 1,
          totalPages: 1,
        }),
      getFullList: () => Promise.resolve([baseEntity]),
      getOne: (_id: string) => Promise.resolve(baseEntity),
      getFirstListItem: (_filter: string) => Promise.resolve(baseEntity),
      create: (data: Partial<TestEntity>) => Promise.resolve({ ...baseEntity, ...data }),
      update: (_id: string, data: Partial<TestEntity>) =>
        Promise.resolve({ ...baseEntity, ...data }),
      delete: (_id: string) => Promise.resolve({}),
    }),
  } as unknown as { collection: () => unknown };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: POCKETBASE_INSTANCE, useValue: mockPb }],
    });

    service = TestBed.runInInjectionContext(() => new TestPocketBaseCrudService());
  });

  it('getList returns ListResult with mapped elements', async () => {
    const result = await firstValueFrom(service.getList({ page: 2, perPage: 10 }));
    expect(result.page).toBe(2);
    expect(result.perPage).toBe(10);
    expect(result.items.length).toBe(1);
    expect(result.items[0].normalizedName).toBe('foo');
  });

  it('getFullList returns mapped elements', async () => {
    const items = await firstValueFrom(service.getFullList());
    expect(items.length).toBe(1);
    expect(items[0].normalizedName).toBe('foo');
  });

  it('getOne returns mapped element', async () => {
    const item = await firstValueFrom(service.getOne('1'));
    expect(item.id).toBe('1');
    expect(item.normalizedName).toBe('foo');
  });

  it('getFirstListItem returns mapped element', async () => {
    const item = await firstValueFrom(service.getFirstListItem('name = "Foo"'));
    expect(item.name).toBe('Foo');
    expect(item.normalizedName).toBe('foo');
  });

  it('create returns mapped element', async () => {
    const item = await firstValueFrom(service.create({ extra: 'bar' }));
    expect(item.extra).toBe('bar');
    expect(item.normalizedName).toBe('foo');
  });

  it('update returns mapped element', async () => {
    const item = await firstValueFrom(service.update('1', { name: 'Baz' }));
    expect(item.name).toBe('Baz');
    expect(item.normalizedName).toBe('baz');
  });

  it('delete returns true', async () => {
    const result = await firstValueFrom(service.delete('1'));
    expect(result).toBe(true);
  });
});
