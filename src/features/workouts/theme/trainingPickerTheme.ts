import { createTheme } from '@mui/material/styles'

export const trainingPickerTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#22d3ee',
      contrastText: '#020617',
    },
    background: {
      default: '#020617',
      paper: '#0f172a',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#94a3b8',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255,255,255,0.15)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(34,211,238,0.5)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#22d3ee',
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#cbd5e1',
          '&.Mui-focused': {
            color: '#22d3ee',
          },
        },
      },
    },
  },
})
