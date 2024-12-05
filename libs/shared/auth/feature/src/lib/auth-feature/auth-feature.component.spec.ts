import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { AuthFeatureComponent } from './auth-feature.component';
import { AUTH_FORM_FACADE } from './auth-form-facade.type';

xdescribe('AuthFeatureComponent', () => {
  let component: AuthFeatureComponent;
  let fixture: ComponentFixture<AuthFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthFeatureComponent],
      providers: [
        provideMockStore(),
        {
          provide: AUTH_FORM_FACADE,
          useValue: {
            formStructure: signal([
              {
                key: 'email',
                type: 'input',
                props: {
                  label: 'Email',
                  required: true,
                },
              },
              {
                key: 'password',
                type: 'input',
                props: {
                  label: 'Password',
                  required: true,
                  type: 'password',
                },
              },
            ]),
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onSubmit: () => {},
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
