import { ComponentFixture, DeferBlockBehavior, DeferBlockState, TestBed } from '@angular/core/testing';
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
      deferBlockBehavior: DeferBlockBehavior.Playthrough,
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

  it('should set aria-expanded, aria-label, and matTooltip on expand row button when expandable', async () => {
    const expFixture = TestBed.createComponent(SharedTableUiComponent);
    const expCompRef = expFixture.componentRef;
    expCompRef.setInput('data', [{ id: 1, name: 'test' }]);
    expCompRef.setInput('columnProperties', [
      { key: 'name', pathToKey: 'name', title: 'Name', formatting: { type: 'TEXT' } },
    ]);
    expCompRef.setInput('resultsLength', 1);
    expCompRef.setInput('expandable', true);

    expFixture.detectChanges();
    await expFixture.whenStable();

    const deferBlocks = await expFixture.getDeferBlocks();
    await deferBlocks[0].render(DeferBlockState.Complete);

    const expandBtn = expFixture.nativeElement.querySelector('mat-cell button') as HTMLButtonElement;
    expect(expandBtn).toBeTruthy();
    expect(expandBtn.getAttribute('aria-expanded')).toBe('false');
    expect(expandBtn.getAttribute('aria-label')).toBe('common.a11y.expandRow');

    expandBtn.click();
    await new Promise(resolve => requestAnimationFrame(resolve));
    expFixture.detectChanges();
    await expFixture.whenStable();

    expect(expandBtn.getAttribute('aria-expanded')).toBe('true');
    expect(expandBtn.getAttribute('aria-label')).toBe('common.a11y.collapseRow');
  });
});
