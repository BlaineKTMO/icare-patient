import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// Define the core theme colors
const primaryMain = '#2563EB'; // Modern blue
const secondaryMain = '#10B981'; // Fresh green
const errorMain = '#EF4444'; // Alert red
const warningMain = '#F59E0B'; // Warning orange
const infoMain = '#3B82F6'; // Info blue
const successMain = '#10B981'; // Success green
const backgroundColor = '#F9FAFB';
const paperBackgroundColor = '#FFFFFF';
const textPrimaryColor = '#111827';
const textSecondaryColor = '#6B7280';

// Create the base theme
let theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: primaryMain,
      light: '#DBEAFE',
      dark: '#1E40AF',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: secondaryMain,
      light: '#D1FAE5',
      dark: '#047857',
      contrastText: '#FFFFFF',
    },
    error: {
      main: errorMain,
      light: '#FEE2E2',
      dark: '#B91C1C',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: warningMain,
      light: '#FEF3C7',
      dark: '#B45309',
      contrastText: '#FFFFFF',
    },
    info: {
      main: infoMain,
      light: '#DBEAFE',
      dark: '#1E40AF',
      contrastText: '#FFFFFF',
    },
    success: {
      main: successMain,
      light: '#D1FAE5',
      dark: '#047857',
      contrastText: '#FFFFFF',
    },
    text: {
      primary: textPrimaryColor,
      secondary: textSecondaryColor,
    },
    background: {
      default: backgroundColor,
      paper: paperBackgroundColor,
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.2,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.2,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.2,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.2,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.2,
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.5,
      color: textSecondaryColor,
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: textSecondaryColor,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 600,
      fontSize: '0.875rem',
      textTransform: 'none',
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0, 0, 0, 0.05)',
    '0px 4px 8px rgba(0, 0, 0, 0.05)',
    '0px 6px 12px rgba(0, 0, 0, 0.05)',
    '0px 8px 16px rgba(0, 0, 0, 0.05)',
    '0px 10px 20px rgba(0, 0, 0, 0.05)',
    '0px 12px 24px rgba(0, 0, 0, 0.05)',
    '0px 14px 28px rgba(0, 0, 0, 0.05)',
    '0px 16px 32px rgba(0, 0, 0, 0.05)',
    '0px 18px 36px rgba(0, 0, 0, 0.05)',
    '0px 20px 40px rgba(0, 0, 0, 0.05)',
    '0px 22px 44px rgba(0, 0, 0, 0.05)',
    '0px 24px 48px rgba(0, 0, 0, 0.05)',
    '0px 26px 52px rgba(0, 0, 0, 0.05)',
    '0px 28px 56px rgba(0, 0, 0, 0.05)',
    '0px 30px 60px rgba(0, 0, 0, 0.05)',
    '0px 32px 64px rgba(0, 0, 0, 0.05)',
    '0px 34px 68px rgba(0, 0, 0, 0.05)',
    '0px 36px 72px rgba(0, 0, 0, 0.05)',
    '0px 38px 76px rgba(0, 0, 0, 0.05)',
    '0px 40px 80px rgba(0, 0, 0, 0.05)',
    '0px 42px 84px rgba(0, 0, 0, 0.05)',
    '0px 44px 88px rgba(0, 0, 0, 0.05)',
    '0px 46px 92px rgba(0, 0, 0, 0.05)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '10px 24px',
          borderRadius: 8,
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.1)',
          },
        },
        contained: {
          '&:hover': {
            background: 'inherit',
            opacity: 0.9,
          },
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${primaryMain}, #4F46E5)`,
        },
        containedSecondary: {
          background: `linear-gradient(135deg, ${secondaryMain}, #059669)`,
        },
        containedError: {
          background: `linear-gradient(135deg, ${errorMain}, #DC2626)`,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            transition: 'all 0.2s ease-in-out',
            '&.Mui-focused': {
              boxShadow: '0px 0px 0px 2px rgba(99, 102, 241, 0.2)',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
        },
        elevation1: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
        },
        elevation2: {
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.06)',
        },
        elevation3: {
          boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.06)',
        }
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          height: 70,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          boxShadow: '0px -4px 12px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          padding: '8px 0 12px',
          '&.Mui-selected': {
            paddingTop: 8,
          },
        },
        label: {
          marginTop: 4,
          fontSize: '0.75rem',
          '&.Mui-selected': {
            fontSize: '0.75rem',
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&.Mui-selected': {
            backgroundColor: 'rgba(99, 102, 241, 0.08)',
            '&:hover': {
              backgroundColor: 'rgba(99, 102, 241, 0.12)',
            },
          },
        },
      },
    },
  },
});

// Make the typography responsive
theme = responsiveFontSizes(theme);

export default theme;