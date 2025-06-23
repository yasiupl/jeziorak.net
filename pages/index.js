import Head from 'next/head'
// Header component is removed as SailingWeather includes a title
// Livestream component might be removed if only a link is needed
import Footer from '@components/Footer'
import SailingWeather from '@components/SailingWeather' // Added import
// import styles from '@styles/Home.module.css' // Removed as it's no longer used

export default function Home() {
  // const livestreamUrl = "https://streaming.airmax.pl/ilawaum/embed.html"; // Removed as links are in Footer
  // const meteoImageUrl = "https://www.meteo.pl/um/metco/mgram_pict.php?ntype=0u&row=368&col=225&lang=pl"; // Removed

  return (
    <>
    <div className="container"> {/* This class comes from globals.css */}
      <Head>
        <title>Czy na Jezioraku wieje? - Jeziorak.net</title> {/* Updated title */}
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <SailingWeather />

        {/* The div with externalLinks has been removed */}
      </main>
      <Footer />
    </div>
    
    </>
  )
}
