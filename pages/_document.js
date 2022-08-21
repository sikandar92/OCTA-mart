import { ServerStyleSheets } from '@material-ui/core';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import React from 'react';

export default class myDocument extends Document {
  render() {
    return (
      <Html lang='en'>
        <Head>
          <link
            rel='stylesheet'
            href='https://fonts.googleapis.com/css?family=300,400,500,700,&display=swap'
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

myDocument.getInitialProps = async (ctx) => {
  const sheets = new ServerStyleSheets();
  const orignalRenderPage = ctx.renderPage;
  ctx.renderPage = () => {
    return orignalRenderPage({
      enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
    });
  };
  const initialProps = await Document.getInitialProps(ctx);
  return {
    ...initialProps,
    styles: [
      ...React.Children.toArray(initialProps.styles),
      sheets.getStyleElement(),
    ],
  };
};
