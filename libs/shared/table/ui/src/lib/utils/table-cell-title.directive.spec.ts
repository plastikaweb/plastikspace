import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TableCellTitleDirective } from './table-cell-title.directive';

@Component({
  template: `
    <table>
      <tr>
        <td [plastikTableCellTitle]="true"><span>Simple Text</span></td>
        <td [plastikTableCellTitle]="true">
          <span>Nested Text</span>
          <span class="material-icons">icon</span>
        </td>
        <td [plastikTableCellTitle]="true">
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </td>
        <td [plastikTableCellTitle]="false"><span>Disabled</span></td>
        <td [plastikTableCellTitle]="true">
          <span>Line<br />Break</span>
        </td>
      </tr>
    </table>
  `,
  imports: [TableCellTitleDirective],
})
class TestComponent {}

describe('TableCellTitleDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let cells: DebugElement[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestComponent, TableCellTitleDirective],
    });
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    cells = fixture.debugElement.queryAll(By.directive(TableCellTitleDirective));
  });

  it('should create an instance', () => {
    expect(cells.length).toBe(5);
  });

  it('should set title and aria-label for simple text', () => {
    const el = cells[0].nativeElement;
    expect(el.getAttribute('title')).toBe('Simple Text');
    expect(el.getAttribute('aria-label')).toBe('Simple Text');
  });

  it('should extract text from nested elements and ignore material icons', () => {
    const el = cells[1].nativeElement;
    // "Nested Text" + ignored icon
    expect(el.getAttribute('title')).toBe('Nested Text');
  });

  it('should set title on li elements', () => {
    const el = cells[2].nativeElement;
    const lis = el.querySelectorAll('li');
    expect(lis[0].getAttribute('title')).toBe('Item 1');
    expect(lis[1].getAttribute('title')).toBe('Item 2');
  });

  it('should not set title if disabled', () => {
    const el = cells[3].nativeElement;
    expect(el.getAttribute('title')).toBeNull();
  });

  it('should handle br tags with separator', () => {
    const el = cells[4].nativeElement;
    expect(el.getAttribute('title')).toBe('Line - Break');
  });
});
