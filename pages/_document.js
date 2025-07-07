import { Html, Head, Main, NextScript } from 'next/document'
import { GoogleTagManager } from '@next/third-parties/google'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <GoogleTagManager gtmId="GTM-K2XRS4QV" />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
