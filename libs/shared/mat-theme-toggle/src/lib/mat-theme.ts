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
