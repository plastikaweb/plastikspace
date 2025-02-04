import { AngularSvgIconModule } from 'angular-svg-icon';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideExperimentalZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { FirebaseAuthService } from '@plastik/auth/firebase/data-access';
import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { CORE_CMS_LAYOUT_HEADER_CONFIG } from '@plastik/core/cms-layout/entities';
import {
  LLecoopOrderListStore,
  LlecoopUserOrderStore,
  MockedOrderListStore,
  MockedUserOrderStore,
} from '@plastik/llecoop/order-list/data-access';

import { CmsLayoutComponent } from './cms-layout.component';

describe('CmsLayoutComponent', () => {
  let component: CmsLayoutComponent;
  let fixture: ComponentFixture<CmsLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, CmsLayoutComponent, AngularSvgIconModule.forRoot()],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: FirebaseAuthService,
          useValue: {
            currentUserEmail: signal('email'),
          },
        },
        { provide: LlecoopUserOrderStore, useValue: MockedUserOrderStore },
        { provide: LLecoopOrderListStore, useValue: MockedOrderListStore },
        {
          provide: VIEW_CONFIG,
          useValue: signal([
            {
              id: 1,
              name: 'test',
              title: 'title',
              route: ['/test'],
            },
          ]),
        },
        {
          provide: CORE_CMS_LAYOUT_HEADER_CONFIG,
          useValue: {
            showToggleMenuButton: true,
            sidenavPosition: 'start',
            title: 'title',
            extendedTitle: 'extendedTitle',
            mainIcon: { iconPath: '', label: 'icon' },
            widgetsConfig: {
              position: 'end',
              widgets: [],
            },
            position: 'end',
            widgets: [],
            menu: {
              label: signal('menu'),
              position: 'end',
              config: [],
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CmsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
