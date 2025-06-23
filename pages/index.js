import Head from 'next/head'
import Footer from '@components/Footer'
import SailingWeather from '@components/SailingWeather' 
import Faq from '@components/Faq' // Added import for FAQ

export default function Home() {
  return (
    <>
    <div className="container"> {/* This class comes from globals.css */}
      <Head>
        <title>Czy na Jezioraku wieje? - Jeziorak.net</title> {/* Updated title */}
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <SailingWeather />
        <Faq />
        {/* The div with externalLinks has been removed */}
      </main>
      <Footer />
    </div>
    
    </>
  )
}
