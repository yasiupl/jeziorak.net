import Head from 'next/head'
import Header from '@components/Header'
import Livestream from '@components/Livestream'
import Footer from '@components/Footer'

export default function Weather() {
  return (
    <>
    <div className="container">
      <Head>
        <title>Jeziorak.net</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header title="Czy wieje na Jezioraku?"/>
        <img src="https://www.meteo.pl/um/metco/mgram_pict.php?ntype=0u&row=368&col=225&lang=pl"></img>
      </main>
    </div>
    </>
  )
}
