import { TestBed } from '@angular/core/testing';
import { ViewTransitionService } from './view-transition.service';

describe('ViewTransitionService', () => {
  let service: ViewTransitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ViewTransitionService],
    });
    service = TestBed.inject(ViewTransitionService);
  });

  it('should be created and have a null default activeId', () => {
    expect(service).toBeTruthy();
    expect(service.activeId()).toBeNull();
  });

  it('should set a new activeId', () => {
    service.setActiveId('item-123');
    expect(service.activeId()).toBe('item-123');
  });

  it('should update activeId if value changes', () => {
    service.setActiveId('item-123');
    service.setActiveId('item-456');
    expect(service.activeId()).toBe('item-456');
  });

  it('should reset activeId to null', () => {
    service.setActiveId('item-123');
    service.setActiveId(null);
    expect(service.activeId()).toBeNull();
  });
});
