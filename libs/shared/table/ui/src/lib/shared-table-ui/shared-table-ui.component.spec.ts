import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageEventConfig } from '@plastik/shared/table/entities';

import { ComponentRef } from '@angular/core';
import { BaseEntity } from '@plastik/core/entities';
import { axe, toHaveNoViolations } from 'jest-axe';
import { SharedTableUiComponent } from './shared-table-ui.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

describe('SharedTableUiComponent', () => {
  let component: SharedTableUiComponent<BaseEntity>;
  let fixture: ComponentFixture<SharedTableUiComponent<BaseEntity>>;
  let componentRef: ComponentRef<SharedTableUiComponent<BaseEntity>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedTableUiComponent],
      providers: [provideExperimentalZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedTableUiComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('data', [{ id: 1, name: 'test' }]);
    componentRef.setInput('columnProperties', [{ property: 'name' }]);
    componentRef.setInput('resultsLength', 1);
    componentRef.setInput('pagination', {});
    componentRef.setInput('noPagination', false);
    componentRef.setInput('paginationVisibility', {});
    componentRef.setInput('pageSizeOptions', [10, 25]);
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

  xit('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should emit changePagination Event', () => {
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

  xit('should have no accessibility violations', async () => {
    expect.extend(toHaveNoViolations);
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });
});
