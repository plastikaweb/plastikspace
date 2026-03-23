// eslint-disable-next-line @nx/enforce-module-boundaries
import '@plastik/shared/testing';

import { AngularSvgIconModule } from 'angular-svg-icon';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { FirebaseAuthService } from '@plastik/auth/firebase/data-access';
import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { CORE_CMS_LAYOUT_HEADER_CONFIG } from '@plastik/core/cms-layout/entities';
import {
  llecoopOrderListStore,
  llecoopUserOrderStore,
  MockedOrderListStore,
  MockedUserOrderStore,
} from '@plastik/llecoop/order-list/data-access';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatThemeToggleService } from '@plastik/shared/mat-theme-toggle';
import { llecoopProfileStore } from '@plastik/llecoop/profile/data-access';

import { CmsLayoutComponent } from './cms-layout.component';

describe('CmsLayoutComponent', () => {
  let component: CmsLayoutComponent;
  let fixture: ComponentFixture<CmsLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CmsLayoutComponent, AngularSvgIconModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        provideMockStore({}),
        provideHttpClient(),
        provideHttpClientTesting(),
        TranslateService,
        {
          provide: MatThemeToggleService,
          useValue: {
            theme: signal('light'),
            selectedTheme: signal({
              id: 'light',
              name: 'common.theme.light',
              icon: 'light_mode',
            }),
            getThemes: () => [
              { id: 'light', name: 'common.theme.light', icon: 'light_mode' },
              { id: 'dark', name: 'common.theme.dark', icon: 'dark_mode' },
              { id: 'system', name: 'common.theme.system', icon: 'desktop_mac' },
            ],
            setTheme: () => {},
          },
        },
        {
          provide: FirebaseAuthService,
          useValue: {
            currentUserEmail: signal('email'),
            loggedIn: signal(true),
            currentUser: signal({
              email: 'email',
              emailVerified: true,
              uid: 'uid',
            }),
          },
        },
        { provide: llecoopUserOrderStore, useValue: MockedUserOrderStore },
        { provide: llecoopOrderListStore, useValue: MockedOrderListStore },
        { provide: llecoopProfileStore, useValue: { getUserName: signal('user') } },
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
            userMenuConfig: {
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
