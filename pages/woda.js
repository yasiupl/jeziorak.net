import Head from 'next/head'
import Header from '@components/Header'
import Water from '@components/Water'
import Footer from '@components/Footer'

export default function Water_level() {
  return (
    <>
    <div className="container">
      <Head>
        <title>Jeziorak.net</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header title="Poziom wody na Jezioraku"/>
        <Water/>
      </main>
    </div>
    </>
  )
}
