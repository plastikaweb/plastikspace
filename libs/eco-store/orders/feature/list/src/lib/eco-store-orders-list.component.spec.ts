import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ecoStoreOrdersStore } from '@plastik/eco-store/orders/data-access';
import { axe } from 'vitest-axe';
import EcoStoreOrdersListComponent from './eco-store-orders-list.component';

describe('EcoStoreOrdersListComponent', () => {
  let component: EcoStoreOrdersListComponent;
  let fixture: ComponentFixture<EcoStoreOrdersListComponent>;

  const mockOrdersStore = {
    isLoading: signal(false),
    entities: signal([]),
    count: signal(0),
    filter: signal({ status: null as string | null }),
    getPagination: () => ({ page: 1, perPage: 10 }),
    paginationSizeOptions: signal([10, 20]),
  };

  beforeEach(async () => {
    mockOrdersStore.filter.set({ status: null });
    mockOrdersStore.isLoading.set(false);
    mockOrdersStore.entities.set([]);
    mockOrdersStore.count.set(0);

    await TestBed.configureTestingModule({
      imports: [EcoStoreOrdersListComponent, TranslateModule.forRoot()],
      providers: [provideRouter([]), { provide: ecoStoreOrdersStore, useValue: mockOrdersStore }],
    }).compileComponents();

    fixture = TestBed.createComponent(EcoStoreOrdersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have no accessibility violations', async () => {
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });

  it('should display empty state when no orders', () => {
    const emptyTitle = fixture.nativeElement.querySelector('.empty-state [title], .empty-state h3');
    expect(emptyTitle.textContent).toContain('orders.list.empty');

    const emptyDesc = fixture.nativeElement.querySelector(
      '.empty-state [description], .empty-state p.max-w-3xl'
    );
    expect(emptyDesc.textContent).toContain('orders.list.emptyDescription');

    const goToStoreBtn = fixture.nativeElement.querySelector('button[routerLink="/botiga"]');
    expect(goToStoreBtn).toBeTruthy();
  });

  it('should display the filter form', () => {
    const filterForm = fixture.nativeElement.querySelector('plastik-shared-form-feature');
    expect(filterForm).toBeTruthy();
  });

  it('should display status-specific empty state when filter is applied', () => {
    // Mock the model with a status filter
    mockOrdersStore.filter.set({ status: 'PENDING' });
    fixture.detectChanges();

    const emptyTitle = fixture.nativeElement.querySelector('.empty-state [title], .empty-state h3');
    expect(emptyTitle.textContent).toContain('orders.list.emptyWithStatus');

    const emptyDesc = fixture.nativeElement.querySelector(
      '.empty-state [description], .empty-state p.max-w-3xl'
    );
    expect(emptyDesc.textContent).toContain('orders.list.emptyDescriptionWithStatus');
  });
});
