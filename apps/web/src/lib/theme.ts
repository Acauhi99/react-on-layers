export const colorThemes = {
  blue: {
    primary: 'oklch(0.53 0.18 264)',
    primaryForeground: 'oklch(0.98 0 0)',
    secondary: 'oklch(0.96 0.01 264)',
    secondaryForeground: 'oklch(0.05 0.18 264)',
    accent: 'oklch(0.94 0.01 264)',
    accentForeground: 'oklch(0.05 0.18 264)',
    muted: 'oklch(0.96 0.01 264)',
    mutedForeground: 'oklch(0.47 0.03 264)',
  },
  green: {
    primary: 'oklch(0.45 0.18 142)',
    primaryForeground: 'oklch(0.98 0 0)',
    secondary: 'oklch(0.96 0.01 142)',
    secondaryForeground: 'oklch(0.05 0.18 142)',
    accent: 'oklch(0.94 0.01 142)',
    accentForeground: 'oklch(0.05 0.18 142)',
    muted: 'oklch(0.96 0.01 142)',
    mutedForeground: 'oklch(0.47 0.03 142)',
  },
  purple: {
    primary: 'oklch(0.58 0.18 300)',
    primaryForeground: 'oklch(0.98 0 0)',
    secondary: 'oklch(0.96 0.01 300)',
    secondaryForeground: 'oklch(0.05 0.18 300)',
    accent: 'oklch(0.94 0.01 300)',
    accentForeground: 'oklch(0.05 0.18 300)',
    muted: 'oklch(0.96 0.01 300)',
    mutedForeground: 'oklch(0.47 0.03 300)',
  },
  orange: {
    primary: 'oklch(0.65 0.18 45)',
    primaryForeground: 'oklch(0.98 0 0)',
    secondary: 'oklch(0.96 0.01 45)',
    secondaryForeground: 'oklch(0.05 0.18 45)',
    accent: 'oklch(0.94 0.01 45)',
    accentForeground: 'oklch(0.05 0.18 45)',
    muted: 'oklch(0.96 0.01 45)',
    mutedForeground: 'oklch(0.47 0.03 45)',
  },
} as const;

export type ColorTheme = keyof typeof colorThemes;