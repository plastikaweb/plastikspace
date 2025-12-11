import { ComponentRef, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
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
      providers: [provideZonelessChangeDetection(), provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(SortSelectorComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;

    const options: SortMenuOptions = {
      name: [
        { direction: 'asc', icon: 'arrow_upward' },
        { direction: 'desc', icon: 'arrow_downward' },
      ],
      created: [
        { direction: 'asc', icon: 'arrow_upward' },
        { direction: 'desc', icon: 'arrow_downward' },
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
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button).toBeTruthy();
    const text = button.textContent || '';
    expect(text).toContain('products.filter.sort');
    expect(text).toContain('products.sort.name-asc');
  });

  it('should emit sortChange on manual change', () => {
    const emitted: SortConfig[] = [];
    const sub = component.sortChange.subscribe(v => emitted.push(v));

    component.onSortChange({ active: 'name', direction: 'desc' });
    expect(emitted[0]).toEqual({ active: 'name', direction: 'desc' });

    sub.unsubscribe();
  });
});
