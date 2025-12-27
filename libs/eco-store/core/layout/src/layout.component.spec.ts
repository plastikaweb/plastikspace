import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { EcoStoreFormlyModule } from '@plastik/eco-store/formly';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import LayoutComponent from './layout.component';
import { MenuComponent } from './menu/menu.component';
import { axe, toHaveNoViolations } from 'jest-axe';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LayoutComponent,
        HeaderComponent,
        FooterComponent,
        MenuComponent,
        EcoStoreFormlyModule,
      ],
      providers: [provideRouter([]), provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have no accessibility violations', async () => {
    expect.extend(toHaveNoViolations);
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  }, 10000);
});
