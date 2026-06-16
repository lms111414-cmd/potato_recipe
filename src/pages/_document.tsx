import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="ko">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#FDFBF7" />
      </Head>
      <body className="letterpaper">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
