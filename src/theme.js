import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#223388',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
  },
  typography: {
    h1: {
      fontFamily: 'Roboto',
      fontWeight: 700,
    },
    h2: {
      fontFamily: 'Roboto',
      fontWeight: 700,
    },
    h3: {
      fontFamily: 'Roboto',
      fontWeight: 700,
    },
    h4: {
      fontFamily: 'Roboto',
      fontWeight: 700,
    },
    h5: {
      fontFamily: 'Roboto',
      fontWeight: 700,
    },
    h6: {
      fontFamily: 'Roboto',
      fontWeight: 500,
    },
  },
});

export default theme;