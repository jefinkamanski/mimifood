import React from 'react';
import './styles/style.css';
import App from './App';
import ReactDOM from 'react-dom/client';
import { Box, Container } from '@mui/system';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Grid from '@mui/system/Unstable_Grid';
import SettingsIcon from '@mui/icons-material/Settings';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import { styled } from '@mui/material/styles';

const root = ReactDOM.createRoot(document.getElementById('root'));

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
  },
});

const StyledFab = styled(Fab)({
  position: 'absolute',
  zIndex: 1,
  top: -30,
  left: 0,
  right: 0,
  margin: '0 auto',
});



root.render(
  <ThemeProvider theme={darkTheme}>
    <React.Fragment>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar align="center" variant="dense">
          <img alt='Logo do MimiFood' width='28em' sx={{ mr: 1 }} src='favicon.ico' />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 3,
              ml: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            MIMIFOOD
          </Typography>
          </Toolbar>
        </Container>
      </AppBar>
    </React.Fragment>
    <Container>
      <Grid>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </Grid>
    </Container>
    <Box sx={{mt: 10 }}>
      <React.Fragment > 
        <Box >
        <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
        <Toolbar>
          <IconButton color="inherit" href={`/`} aria-label="Agendamentos">
            <AccessAlarmIcon />
          </IconButton>
          <StyledFab color="primary" href={`/novo-agendamento`} aria-label="Novo">
            <AddIcon />
          </StyledFab>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton href={`/configuracoes`} color="Configurações">
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      </Box>
      </React.Fragment>
    </Box>
  </ThemeProvider>

);
