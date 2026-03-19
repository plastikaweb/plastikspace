import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { FormlyModule } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
import { ecoStoreOrdersStore } from '@plastik/eco-store/orders/data-access';
import { SharedConfirmDialogService } from '@plastik/shared/confirm';
import { InputSearchTypeComponent } from '@plastik/shared/form/input-search';
import { SharedFormUiSelectWithIconsComponent } from '@plastik/shared/form/select-with-icons';
import { of } from 'rxjs';
import { axe } from 'vitest-axe';
import EcoStoreOrdersListComponent from './eco-store-orders-list.component';

describe('EcoStoreOrdersListComponent', () => {
  let component: EcoStoreOrdersListComponent;
  let fixture: ComponentFixture<EcoStoreOrdersListComponent>;

  const mockOrdersStore = {
    isLoading: signal(false),
    entities: signal([]),
    count: signal(0),
    filter: signal({ status: null as string | null, items: null as string | null }),
    sort: signal({ active: 'created', direction: 'desc' }),
    sortOptions: signal({}),
    getPagination: () => ({ page: 1, perPage: 10 }),
    paginationSizeOptions: signal([10, 20]),
    delete: vi.fn(),
  };

  const mockConfirmService = {
    confirm: vi.fn().mockReturnValue(of(true)),
  };

  beforeEach(async () => {
    mockOrdersStore.filter.set({ status: null, items: null });
    mockOrdersStore.isLoading.set(false);
    mockOrdersStore.entities.set([]);
    mockOrdersStore.count.set(0);
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [
        EcoStoreOrdersListComponent,
        TranslateModule.forRoot(),
        FormlyModule.forRoot({
          types: [
            { name: 'input-search', component: InputSearchTypeComponent },
            { name: 'select-with-icons', component: SharedFormUiSelectWithIconsComponent },
          ],
        }),
      ],
      providers: [
        provideRouter([]),
        { provide: ecoStoreOrdersStore, useValue: mockOrdersStore },
        { provide: SharedConfirmDialogService, useValue: mockConfirmService },
      ],
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
    mockOrdersStore.filter.set({ status: 'PENDING', items: null });
    fixture.detectChanges();

    const emptyTitle = fixture.nativeElement.querySelector('.empty-state [title], .empty-state h3');
    expect(emptyTitle.textContent).toContain('orders.list.emptyWithStatus');

    const emptyDesc = fixture.nativeElement.querySelector(
      '.empty-state [description], .empty-state p.max-w-3xl'
    );
    expect(emptyDesc.textContent).toContain('orders.list.emptyDescriptionWithStatus');
  });

  it('should navigate when sort is called', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');
    const sortConfig = { active: 'status', direction: 'asc' };

    component.sort(sortConfig as any);

    expect(navigateSpy).toHaveBeenCalledWith([], {
      queryParams: { ...sortConfig, page: 0 },
      queryParamsHandling: 'merge',
    });
  });

  it('should call delete on ordersStore when onDeleteOrder is called and confirmed', () => {
    const orderId = '1';
    const orderNumber = 'ORD-1';

    // @ts-expect-error - testing protected method
    component.onDeleteOrder([orderId, orderNumber]);

    expect(mockConfirmService.confirm).toHaveBeenCalledWith(
      'orders.list.deleteOrderTitle',
      'orders.list.deleteOrderDescription',
      'orders.list.deleteOrderCancel',
      'orders.list.deleteOrderConfirm',
      { orderNumber }
    );
    expect(mockOrdersStore.delete).toHaveBeenCalledWith(orderId);
  });

  it('should NOT call delete on ordersStore when onDeleteOrder is called and NOT confirmed', () => {
    mockConfirmService.confirm.mockReturnValue(of(false));
    const orderId = '1';
    const orderNumber = 'ORD-1';

    // @ts-expect-error - testing protected method
    component.onDeleteOrder([orderId, orderNumber]);

    expect(mockConfirmService.confirm).toHaveBeenCalled();
    expect(mockOrdersStore.delete).not.toHaveBeenCalled();
  });
});
