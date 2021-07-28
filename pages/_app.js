// React
import React, { createRef, useEffect, useState } from 'react';

// Next
import Head from 'next/head';

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
import Fab from '@material-ui/core/Fab';
// Icons
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

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
    width: 'calc(100% - 72px)',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    justifyContent: 'space-between',
    overflowX: 'auto',
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
  backToTop: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(3),
  },
}));

const MyApp = ({ Component, pageProps }) => {

  const classes = useStyles();

  const { value: isDarkTheme, toggle: handleToggleThemeClick } = useDarkMode();

  const theme = isDarkTheme ? darkTheme : lightTheme;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleDrawerOpen = () => setDrawerOpen(true);
  const handleDrawerClose = () => setDrawerOpen(false);

  const content = createRef();

  const [isBackToTopVisible, setIsBackToTopVisible] = useState(false);

  const scrollToTop = () => {
    content.current.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    setIsBackToTopVisible(false);
  };

  useEffect(() => {
    const toggleIsBackToTopVisible = () => {
      if (content && content.current) {
        const scrolled = content.current.scrollTop;
        if (scrolled > 200) setIsBackToTopVisible(true);
        else if (scrolled <= 200) setIsBackToTopVisible(false);
      }
    };

    if (content && content.current) {
      content.current.addEventListener('scroll', toggleIsBackToTopVisible);
    }

    return () => {
      if (content && content.current) {
        content.current.removeEventListener("scroll", toggleIsBackToTopVisible);
      }
    };
  }, [content]);

  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
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
              <div className={classes.container} ref={content}>
                <Component {...pageProps} />
                <Footer />
              </div>
              {
                isBackToTopVisible &&
                <Fab color="primary" size="small" className={classes.backToTop} onClick={scrollToTop}>
                  <KeyboardArrowUpIcon />
                </Fab>
              }
            </main>
          </div>
        </ThemeProvider>
      </Provider>
    </>
  );

};

export default MyApp;