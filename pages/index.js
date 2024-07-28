import Head from 'next/head'
import Header from '@components/Header'
import Livestream from '@components/Livestream'
import Footer from '@components/Footer'

export default function Home() {
  return (
    <>
    <div className="container">
      <Head>
        <title>Jeziorak.net</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header title="Czy wieje na Jezioraku?"/>
        <h1 className="description">
        </h1>
      </main>
    </div>
    <Livestream/>
    </>
  )
}
