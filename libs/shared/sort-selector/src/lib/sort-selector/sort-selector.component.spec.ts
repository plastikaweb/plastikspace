import { ComponentRef, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideTranslateService } from '@ngx-translate/core';
import { SortConfig, SortMenuOptions } from '@plastik/core/entities';
import { SortSelectorComponent } from './sort-selector.component';

describe('SortSelectorComponent', () => {
  let component: SortSelectorComponent;
  let fixture: ComponentFixture<SortSelectorComponent>;
  let componentRef: ComponentRef<SortSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SortSelectorComponent],
      providers: [provideZonelessChangeDetection(), provideNoopAnimations(), provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(SortSelectorComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;

    const options: SortMenuOptions = {
      name: [
        { id: 1, direction: 'asc', icon: 'arrow_upward' },
        { id: 2, direction: 'desc', icon: 'arrow_downward' },
      ],
      created: [
        { id: 3, direction: 'asc', icon: 'arrow_upward' },
        { id: 4, direction: 'desc', icon: 'arrow_downward' },
      ],
    };
    const current: SortConfig = { active: 'name', direction: 'asc' } as const;

    componentRef.setInput('options', options);
    componentRef.setInput('currentSort', current);
    componentRef.setInput('translationPrefix', 'products.sort');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render trigger text with current sort', () => {
    // We target the desktop button specifically using its Tailwind class.
    // Note: in JSDOM the classes are present as strings.
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button.md\\:flex\\!');

    expect(button).toBeTruthy();
    const text = button.textContent || '';
    expect(text).toContain('products.sort.label');
    expect(text).toContain('products.sort.nameAsc');
  });

  it('should emit sortChange on manual change', () => {
    const emitted: SortConfig[] = [];
    const sub = component.sortChange.subscribe(v => emitted.push(v));

    component.onSortChange({ active: 'name', direction: 'desc' });
    expect(emitted[0]).toEqual({ active: 'name', direction: 'desc' });

    sub.unsubscribe();
  });

  it('should set aria-current="true" on current sort option when menu is opened', () => {
    const trigger: HTMLButtonElement = fixture.nativeElement.querySelector('button.md\\:flex\\!');
    trigger.click();
    fixture.detectChanges();

    const menuItems = document.querySelectorAll<HTMLButtonElement>('button[mat-menu-item]');
    expect(menuItems.length).toBe(4);
    expect(menuItems[0].getAttribute('aria-current')).toBe('true');
    expect(menuItems[1].getAttribute('aria-current')).toBeNull();
  });
});
