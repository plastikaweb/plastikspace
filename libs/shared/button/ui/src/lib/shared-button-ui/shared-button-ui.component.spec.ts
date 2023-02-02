import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { buttonMock } from '@plastik/shared/button';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { SharedButtonUiComponent } from './shared-button-ui.component';

describe('SharedButtonUiComponent', () => {
  let component: SharedButtonUiComponent;
  let fixture: ComponentFixture<SharedButtonUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedButtonUiComponent, AngularSvgIconModule.forRoot(), HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedButtonUiComponent);
    component = fixture.componentInstance;
    component.config = buttonMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should output a button action on click', () => {
    let result;
    component.sendAction.subscribe(action => (result = action));
    component.onClick();
    expect(result).toEqual(result);
  });

  it('should return a boolean indicating if the button configuration element is of type SvgIconConfig', () => {
    expect(component.isIconGuard(buttonMock.elements[0])).toBeFalsy();
    expect(component.isIconGuard(buttonMock.elements[1])).toBeTruthy();
  });
});
