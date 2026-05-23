import { MatSort } from '@angular/material/sort';

export type Sorting = Pick<MatSort, 'active' | 'direction'>;

export type SortConfig = {
  active: Sorting['active'];
  direction: Sorting['direction'];
};

export type SortMenuItem = {
  id: number;
  direction: Sorting['direction'];
  icon?: string;
  description?: string;
};

export type SortMenuOptions = Record<Sorting['active'], SortMenuItem[]>;
