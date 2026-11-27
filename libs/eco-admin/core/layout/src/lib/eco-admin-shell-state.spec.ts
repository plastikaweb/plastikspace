import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { mockPocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access/testing';
import { PocketBaseUser } from '@plastik/core/entities';
import { BehaviorSubject } from 'rxjs';

import { EcoAdminShellState } from './eco-admin-shell-state';

@Component({ template: '' })
class BlankComponent {}

const RAIL_KEY = 'eco-admin-rail:user-1';

describe('EcoAdminShellState', () => {
  let ample$: BehaviorSubject<BreakpointState>;

  const setAmple = (matches: boolean): void => {
    ample$.next({ matches, breakpoints: {} });
    TestBed.tick();
  };

  const create = (): EcoAdminShellState => TestBed.inject(EcoAdminShellState);

  beforeEach(() => {
    localStorage.clear();
    ample$ = new BehaviorSubject<BreakpointState>({ matches: true, breakpoints: {} });
    mockPocketBaseUserProfileStore.user.set({ id: 'user-1' } as PocketBaseUser);

    TestBed.configureTestingModule({
      providers: [
        EcoAdminShellState,
        provideRouter([
          { path: 'tauler', component: BlankComponent },
          { path: 'socis', component: BlankComponent },
        ]),
        { provide: BreakpointObserver, useValue: { observe: () => ample$.asObservable() } },
        { provide: pocketBaseUserProfileStore, useValue: mockPocketBaseUserProfileStore },
      ],
    });
  });

  afterEach(() => {
    mockPocketBaseUserProfileStore.user.set(null);
    vi.restoreAllMocks();
  });

  describe('AMPLE', () => {
    it('starts expanded when the user has never folded the rail', () => {
      const shell = create();

      expect(shell.width()).toBe(true);
      expect(shell.rail()).toBe(false);
      expect(shell.drawerOpen()).toBe(false);
    });

    it('folds and expands the rail, and remembers the choice for this user', () => {
      const shell = create();

      shell.toggle();
      expect(shell.rail()).toBe(true);
      expect(localStorage.getItem(RAIL_KEY)).toBe('1');

      shell.toggle();
      expect(shell.rail()).toBe(false);
      expect(localStorage.getItem(RAIL_KEY)).toBe('0');
    });

    it('starts folded when the same user folded it in an earlier visit', () => {
      localStorage.setItem(RAIL_KEY, '1');

      expect(create().rail()).toBe(true);
    });

    it('animates the rail only once the user has folded or expanded it', () => {
      localStorage.setItem(RAIL_KEY, '1');
      const shell = create();

      expect(shell.railAnimated()).toBe(false);

      shell.toggle();

      expect(shell.railAnimated()).toBe(true);
    });

    it("does not read another user's choice", () => {
      localStorage.setItem('eco-admin-rail:user-2', '1');

      expect(create().rail()).toBe(false);
    });

    it('never opens the drawer', () => {
      const shell = create();

      shell.toggle();

      expect(shell.drawerOpen()).toBe(false);
    });
  });

  describe('PLEGAT', () => {
    beforeEach(() => ample$.next({ matches: false, breakpoints: {} }));

    it('forces the rail folded whatever the user chose', () => {
      localStorage.setItem(RAIL_KEY, '0');

      expect(create().rail()).toBe(true);
    });

    it('opens and closes the drawer without touching the remembered choice', () => {
      const shell = create();

      shell.toggle();
      expect(shell.drawerOpen()).toBe(true);

      shell.toggle();
      expect(shell.drawerOpen()).toBe(false);
      expect(localStorage.getItem(RAIL_KEY)).toBeNull();
    });

    it('closes the drawer on request', () => {
      const shell = create();

      shell.toggle();
      shell.closeDrawer();

      expect(shell.drawerOpen()).toBe(false);
    });

    it('closes the drawer when the route changes', async () => {
      const shell = create();

      shell.toggle();
      await TestBed.inject(Router).navigateByUrl('/socis');

      expect(shell.drawerOpen()).toBe(false);
    });

    it('closes the drawer when the window grows to AMPLE, and keeps it closed back in PLEGAT', () => {
      const shell = create();

      shell.toggle();
      setAmple(true);
      expect(shell.drawerOpen()).toBe(false);

      setAmple(false);
      expect(shell.drawerOpen()).toBe(false);
    });
  });

  it('keeps the choice for the visit when the browser refuses its storage', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    const shell = create();

    expect(shell.rail()).toBe(false);
    shell.toggle();
    expect(shell.rail()).toBe(true);
  });

  it('remembers nothing while the user is unknown', () => {
    mockPocketBaseUserProfileStore.user.set(null);
    const shell = create();

    shell.toggle();

    expect(shell.rail()).toBe(true);
    expect(localStorage.length).toBe(0);
  });
});
