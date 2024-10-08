import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageEventConfig } from '@plastik/shared/table/entities';

import { axe, toHaveNoViolations } from 'jest-axe';
import { SharedTableUiComponent } from './shared-table-ui.component';
import { BaseEntity } from '@plastik/core/entities';

describe('SharedTableUiComponent', () => {
  let component: SharedTableUiComponent<BaseEntity>;
  let fixture: ComponentFixture<SharedTableUiComponent<BaseEntity>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedTableUiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedTableUiComponent);
    component = fixture.componentInstance;
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

  xit('should have no accessibility violations', async () => {
    expect.extend(toHaveNoViolations);
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });
});
