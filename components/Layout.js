import React, { useContext } from 'react';
import Head from 'next/head';
import {
  AppBar,
  Container,
  createMuiTheme,
  CssBaseline,
  Link,
  Switch,
  ThemeProvider,
  Toolbar,
  Typography,
  Badge,
} from '@material-ui/core';
import UseStyles from '../Utils/styles';
import NextLink from 'next/link';
import { Store } from '../Utils/Store';
import Cookies from 'js-cookie';

export default function Layout({ description, title, children }) {
  const { state, dispatch } = useContext(Store);
  const { darkMode, cart } = state;
  console.log('cart888888', state);
  const theme = createMuiTheme({
    typography: {
      h1: {
        fontSize: '1.6rem',
        fontWeight: '400',
        margin: '1rem 0',
      },
      h2: {
        fontSize: '1.4rem',
        fontWeight: '400',
        margin: '1rem 0',
      },
    },
    palette: {
      type: darkMode ? 'dark' : 'light',
      primary: {
        main: '#f0c000',
      },
      secondary: {
        main: '#208080',
      },
    },
  });

  const classes = UseStyles();
  const darkModeChangeHandler = () => {
    dispatch({ type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON' });
    const newDarkMode = !darkMode;
    Cookies.set('darkMode', newDarkMode ? 'ON' : 'OFF');
  };
  return (
    <div>
      <Head>
        <title>{title ? `${title} -Next:Amazona` : `Next Amazona`}</title>
        {description && <meta name='description' content={description} />}
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <AppBar position='static' className={classes.navbar}>
          <Toolbar>
            <NextLink href='/' passHref>
              <Link>
                <Typography className={classes.brand}>OCTA Mart</Typography>
              </Link>
            </NextLink>
            <div className={classes.grow}></div>
            <div>
              <Switch
                checked={darkMode}
                onChange={darkModeChangeHandler}
              ></Switch>
              <NextLink href='/cart' passHref>
                <Link>
                  {cart.cartItems.length > 0 ? (
                    <Badge
                      color='secondary'
                      badgeContent={cart.cartItems.length}
                    >
                      Cart
                    </Badge>
                  ) : (
                    'cart'
                  )}
                </Link>
              </NextLink>
              <NextLink href='/login' passHref>
                <Link>Login</Link>
              </NextLink>
            </div>
          </Toolbar>
        </AppBar>
        <Container className={classes.main}>{children}</Container>
        <footer className={classes.footer}>
          <Typography>All rights reserved. Agaicode tech.</Typography>
        </footer>
      </ThemeProvider>
    </div>
  );
}
