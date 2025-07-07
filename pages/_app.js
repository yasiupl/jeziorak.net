import '@styles/globals.css'
import Head from 'next/head'
import { GoogleTagManager } from '@next/third-parties/google'

function Application({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <GoogleTagManager gtmId="GTM-K2XRS4QV" />
      <Component {...pageProps} />
    </>
  )
}

export default Application
