import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders } from '@angular/core';

export interface MatThemeConfig {
  id: string;
  displayName: string;
  primaryColor: string;
}

export const THEMES = {
  light: {
    id: 'light',
    name: 'common.theme.light' as const,
    icon: 'light_mode' as const,
  },
  dark: {
    id: 'dark',
    name: 'common.theme.dark' as const,
    icon: 'dark_mode' as const,
  },
  system: {
    id: 'system',
    name: 'common.theme.system' as const,
    icon: 'desktop_mac' as const,
  },
} as const;

export type MatThemeToggleConfig = (typeof THEMES)[keyof typeof THEMES];

export interface MatThemeColors {
  light: string;
  dark: string;
}

export const MAT_THEME_COLORS = new InjectionToken<MatThemeColors>('MAT_THEME_COLORS', {
  providedIn: 'root',
  factory: () => ({ light: '#f8faf0', dark: '#11140f' }),
});

/**
 * @description Provide the theme colors.
 * @param {MatThemeColors} colors - The theme colors.
 * @returns {EnvironmentProviders} The environment providers.
 */
export function provideMatThemeColors(colors: MatThemeColors): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: MAT_THEME_COLORS, useValue: colors }]);
}
