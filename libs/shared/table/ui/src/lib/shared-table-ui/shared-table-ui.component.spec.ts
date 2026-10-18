import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { PageEventConfig } from '@plastik/shared/table/entities';

import { ComponentRef, provideZonelessChangeDetection } from '@angular/core';
import { BaseEntity } from '@plastik/core/entities';
import { axe } from 'vitest-axe';
import { SharedTableUiComponent } from './shared-table-ui.component';

describe('SharedTableUiComponent', () => {
  let component: SharedTableUiComponent<BaseEntity>;
  let fixture: ComponentFixture<SharedTableUiComponent<BaseEntity>>;
  let componentRef: ComponentRef<SharedTableUiComponent<BaseEntity>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedTableUiComponent],
      providers: [provideZonelessChangeDetection(), provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedTableUiComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('data', [{ id: 1, name: 'test' }]);
    componentRef.setInput('columnProperties', [
      { key: 'name', title: 'Name', formatting: { type: 'TEXT' } },
    ]);
    componentRef.setInput('resultsLength', 1);
    componentRef.setInput('pagination', { pageSize: 5 });
    componentRef.setInput('noPagination', false);
    componentRef.setInput('paginationVisibility', {});
    componentRef.setInput('caption', '');
    componentRef.setInput('sort', ['name', 'asc']);
    componentRef.setInput('actions', {});
    componentRef.setInput('filterCriteria', {});
    componentRef.setInput(
      'filterPredicate',
      (data: BaseEntity, criteria: Record<string, string>) => data && data.name === criteria['name']
    );
    componentRef.setInput('extraRowStyles', (element: BaseEntity) => element.name);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit changePagination Event', () => {
    let data;
    const pagination: PageEventConfig = {
      previousPageIndex: 0,
      pageIndex: 1,
      pageSize: 5,
    };

    component.changePagination.subscribe(value => (data = value));
    component.onChangePagination(pagination);
    expect(data).toEqual(pagination);
  });

  it('should have no accessibility violations', async () => {
    const results = await axe(fixture.nativeElement);

    expect(results).toHaveNoViolations();
  });

  describe('sortingDataAccessor', () => {
    it('should format direct non-nested property values correctly', () => {
      const accessor = (component as unknown as { dataSource: { sortingDataAccessor: (data: unknown, id: string) => unknown } }).dataSource.sortingDataAccessor;
      const testItem = { id: 1, name: 'Alpha', count: 42, active: true, created: new Date(1000) };

      expect(accessor(testItem, 'name')).toBe('alpha');
      expect(accessor(testItem, 'count')).toBe(42);
      expect(accessor(testItem, 'active')).toBe(1);
      expect(accessor(testItem, 'created')).toBe(1000);
      expect(accessor(testItem, 'missing')).toBe('');
    });

    it('should format nested property values correctly using cached path lookup', () => {
      const accessor = (component as unknown as { dataSource: { sortingDataAccessor: (data: unknown, id: string) => unknown } }).dataSource.sortingDataAccessor;
      const testItem = { id: 1, category: { name: 'Electronics' }, nested: { deeper: { score: 99 } } };

      expect(accessor(testItem, 'category.name')).toBe('electronics');
      expect(accessor(testItem, 'nested.deeper.score')).toBe(99);
      expect(accessor(testItem, 'category.nonexistent')).toBe('');
      expect(accessor(testItem, 'missing.path.value')).toBe('');
    });
  });
});
