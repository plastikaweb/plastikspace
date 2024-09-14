import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DetailItemFormComponent } from './detail-item-form.component';
import { DETAIL_ITEM_VIEW_FACADE } from './detail-item-view-facade.type';

describe('DetailItemFormComponent', () => {
  let component: DetailItemFormComponent;
  let fixture: ComponentFixture<DetailItemFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailItemFormComponent],
      providers: [
        provideRouter([]),
        {
          provide: DETAIL_ITEM_VIEW_FACADE,
          useValue: {
            formStructure: signal([]),
            viewConfig: signal({}),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailItemFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
