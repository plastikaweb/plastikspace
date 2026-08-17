import { ComponentFixture, DeferBlockState, TestBed } from '@angular/core/testing';
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
      { key: 'name', pathToKey: 'name', title: 'Name', formatting: { type: 'TEXT' } },
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

  it('should correctly configure aria and tooltip attributes when expandable is true', async () => {
    const localFixture = TestBed.createComponent(SharedTableUiComponent);
    const ref = localFixture.componentRef;
    ref.setInput('data', [{ id: 1, name: 'test' }]);
    ref.setInput('columnProperties', [
      { key: 'name', pathToKey: 'name', title: 'Name', formatting: { type: 'TEXT' } },
    ]);
    ref.setInput('resultsLength', 1);
    ref.setInput('expandable', true);
    localFixture.detectChanges();

    const deferBlock = (await localFixture.getDeferBlocks())[0];
    await deferBlock.render(DeferBlockState.Complete);

    const expandBtn = localFixture.nativeElement.querySelector('button.-left-sub');
    expect(expandBtn).toBeTruthy();
    expect(expandBtn.getAttribute('type')).toBe('button');
    expect(expandBtn.getAttribute('aria-expanded')).toBe('false');
    expect(expandBtn.getAttribute('aria-label')).toBe('Expand row test');

    expandBtn.click();
    await new Promise(resolve => requestAnimationFrame(resolve));
    localFixture.detectChanges();

    expect(expandBtn.getAttribute('aria-expanded')).toBe('true');
    expect(expandBtn.getAttribute('aria-label')).toBe('Collapse row test');

    const results = await axe(localFixture.nativeElement);
    expect(results).toHaveNoViolations();
  });
});
