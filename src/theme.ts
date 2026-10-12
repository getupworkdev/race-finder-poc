// Single source of truth for every visual value in the app.
// Screens never hardcode a colour, spacing or font size: change a token here
// and the whole platform (web, iOS, Android) updates.
export const theme = {
  color: {
    background: '#12161f',
    surface: '#1b2130',
    surfaceRaised: '#252d40',
    border: '#333c52',
    primary: '#b79cf2',
    primaryText: '#16121f',
    text: '#eef0f6',
    textMuted: '#9aa3b8',
    success: '#6fd3a4',
    warning: '#f2c66d',
    danger: '#f2857a',
  },
  space: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 },
  radius: { sm: 6, md: 10, pill: 999 },
  font: { xs: 11, sm: 13, md: 15, lg: 18, xl: 24 },
  layout: { sideBySideMinWidth: 900, listWidth: 420 },
} as const;

export type Theme = typeof theme;
