import { DOCUMENT } from '@angular/common';
import { RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { BodyBackgroundService } from './body-background.service';

describe('BodyBackgroundService', () => {
  let service: BodyBackgroundService;
  let router: Router;
  let document: Document;
  let renderer: any;
  let routerEvents: Subject<any>;

  beforeEach(() => {
    routerEvents = new Subject();
    renderer = {
      addClass: vi.fn(),
      removeClass: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        BodyBackgroundService,
        {
          provide: Router,
          useValue: {
            events: routerEvents.asObservable(),
            url: '/',
          },
        },
        {
          provide: RendererFactory2,
          useValue: {
            createRenderer: () => renderer,
          },
        },
      ],
    });

    service = TestBed.inject(BodyBackgroundService);
    router = TestBed.inject(Router);
    document = TestBed.inject(DOCUMENT);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add class to body based on first route segment', () => {
    routerEvents.next(new NavigationEnd(1, '/botiga', '/botiga'));
    TestBed.flushEffects();
    expect(renderer.addClass).toHaveBeenCalledWith(document.body, 'bg-botiga');
  });

  it('should remove previous class and add new one on route change', () => {
    routerEvents.next(new NavigationEnd(1, '/botiga', '/botiga'));
    TestBed.flushEffects();
    expect(renderer.addClass).toHaveBeenCalledWith(document.body, 'bg-botiga');

    routerEvents.next(new NavigationEnd(2, '/comandes', '/comandes'));
    TestBed.flushEffects();
    expect(renderer.removeClass).toHaveBeenCalledWith(document.body, 'bg-botiga');
    expect(renderer.addClass).toHaveBeenCalledWith(document.body, 'bg-comandes');
  });

  it('should handle nested routes by taking only the first segment', () => {
    routerEvents.next(new NavigationEnd(1, '/botiga/fruita', '/botiga/fruita'));
    TestBed.flushEffects();
    expect(renderer.addClass).toHaveBeenCalledWith(document.body, 'bg-botiga');
  });

  it('should handle query parameters', () => {
    routerEvents.next(new NavigationEnd(1, '/botiga?category=fruita', '/botiga?category=fruita'));
    TestBed.flushEffects();
    expect(renderer.addClass).toHaveBeenCalledWith(document.body, 'bg-botiga');
  });
});
