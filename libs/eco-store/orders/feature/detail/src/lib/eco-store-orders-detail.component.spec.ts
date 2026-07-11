import { provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { POCKETBASE_INSTANCE } from '@plastik/core/api-pocketbase';
import { mockPocketBase } from '@plastik/core/api-pocketbase/testing';
import { provideEnvironmentPocketBaseMock } from '@plastik/core/environments/testing';
import { ecoStoreOrdersStore } from '@plastik/eco-store/orders/data-access';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EcoStoreOrdersDetailComponent } from './eco-store-orders-detail.component';

describe('EcoStoreOrdersDetailComponent', () => {
  let component: EcoStoreOrdersDetailComponent;
  let fixture: ComponentFixture<EcoStoreOrdersDetailComponent>;

  const mockStore = {
    isLoading: signal(false),
    selectedItemId: signal('1'),
    getItemById: vi.fn().mockReturnValue({
      items: [],
      status: 'PENDING',
      created: new Date().toISOString(),
    }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoStoreOrdersDetailComponent, TranslateModule.forRoot()],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        ...provideEnvironmentPocketBaseMock(),
        {
          provide: POCKETBASE_INSTANCE,
          useValue: mockPocketBase,
        },
        {
          provide: ecoStoreOrdersStore,
          useValue: mockStore,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EcoStoreOrdersDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
