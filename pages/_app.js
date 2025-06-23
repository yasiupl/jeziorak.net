import '@styles/globals.css'
import Head from 'next/head'

function Application({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default Application
