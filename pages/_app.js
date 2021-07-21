// React
import React, { useState } from 'react';

// Next Auth
import { Provider } from 'next-auth/client';

// Dark Mode
import useDarkMode from 'use-dark-mode';

// CLSX
import clsx from 'clsx';

// Material UI
// Core
import { ThemeProvider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';

// CSS
import '../styles/global.css';

// Components
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Utils
import { darkTheme, lightTheme } from '../utils/theme';

// Constants
import { DRAWER_WIDTH } from '../constants/Global';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    marginLeft: '72px',
    height: '100vh',
    width: 'calc(100vw - 72px)',
  },
  containerWrapper: {
    height: `calc(100vh - ${theme.mixins.toolbar.height})`,
    overflow: 'auto',
  },
  container: {
    padding: theme.spacing(3),
  },
  contentExpand: {
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.shorter,
    }),
  },
  contentShrink: {
    marginLeft: DRAWER_WIDTH,
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.shorter,
    }),
  },
}));

const MyApp = ({ Component, pageProps }) => {

  const classes = useStyles();

  const { value: isDarkTheme, toggle: handleToggleThemeClick } = useDarkMode();

  const theme = isDarkTheme ? darkTheme : lightTheme;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleDrawerOpen = () => setDrawerOpen(true);
  const handleDrawerClose = () => setDrawerOpen(false);

  return (
    <Provider session={pageProps.session}>
      <ThemeProvider theme={theme}>
        <div className={classes.root}>
          <CssBaseline />
          <Navbar drawerOpen={drawerOpen} handleDrawerOpen={handleDrawerOpen} handleDrawerClose={handleDrawerClose} handleToggleThemeClick={handleToggleThemeClick} />
          <main className={clsx(classes.content, {
            [classes.contentShrink]: drawerOpen,
            [classes.contentExpand]: !drawerOpen,
          })}>
            <div className={classes.toolbar} />
            <div className={classes.containerWrapper}>
              <Container maxWidth="lg" className={classes.container}>
                <Component {...pageProps} />
                <Footer />
              </Container>
            </div>
          </main>
        </div>
      </ThemeProvider>
    </Provider>
  );

};

export default MyApp;