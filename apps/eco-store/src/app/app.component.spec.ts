import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { ENVIRONMENT } from '@plastik/core/environments';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        {
          provide: ENVIRONMENT,
          useValue: {
            production: false,
            name: 'test',
            baseApiUrl: 'http://localhost',
            languages: ['en', 'es'],
            defaultLanguage: 'en',
            client: 'test-client',
          },
        },
        provideTranslateService(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });
});
