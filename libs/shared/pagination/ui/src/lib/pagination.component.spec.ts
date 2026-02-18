import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageEvent } from '@angular/material/paginator';
import { By } from '@angular/platform-browser';
import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('pageSize', 10);
    fixture.componentRef.setInput('pageIndex', 0);
    fixture.componentRef.setInput('count', 100);
    fixture.componentRef.setInput('pageSizeOptions', [10, 20, 50]);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render mat-paginator with correct inputs', () => {
    const paginator = fixture.debugElement.query(By.css('mat-paginator')).componentInstance;
    expect(paginator.length).toBe(100);
    expect(paginator.pageSize).toBe(10);
    expect(paginator.pageIndex).toBe(0);
    expect(paginator.pageSizeOptions).toEqual([10, 20, 50]);
  });

  it('should emit pageChange event', () => {
    const emitSpy = jest.spyOn(component.pageChange, 'emit');
    const paginatorDe = fixture.debugElement.query(By.css('mat-paginator'));

    const pageEvent: PageEvent = {
      pageIndex: 1,
      pageSize: 10,
      length: 100,
    };

    paginatorDe.triggerEventHandler('page', pageEvent);

    expect(emitSpy).toHaveBeenCalledWith(pageEvent);
  });
});
