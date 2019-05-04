import React from 'react';
import App, { Container } from 'next/app';
import Router from 'next/router';
import axios from 'axios';

// have to preload fontawesome styles to avoid flashing
import '@fortawesome/fontawesome-svg-core/styles.css';

class MyApp extends App {
  static getInitialProps = async ({ Component, ctx }) => {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  };

  componentDidMount = () => {
    axios.interceptors.response.use(undefined, (response) => {
      if (response.response.status === 401 && window.location.pathname !== '/login') {
        Router.push('/login');
        return;
      }
      return Promise.reject(response);
    });
  };

  render = () => {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <Component {...pageProps} />
      </Container>
    );
  };
}

export default MyApp;
