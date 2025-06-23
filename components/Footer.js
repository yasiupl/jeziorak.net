import styles from './Footer.module.css'

export default function Footer() {
  const livestreamUrl = "https://streaming.airmax.pl/ilawaum/embed.html";
  const meteoUrl = "https://www.meteo.pl/um/metco/mgram_pict.php?ntype=0u&row=368&col=225&lang=pl";

  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p className={styles.explanation}>
            Ta strona pomaga sprawdzić, czy są dobre warunki do żeglowania na Jezioraku, analizując aktualne dane pogodowe.
          </p>
          <div className={styles.links}>
            <a href={livestreamUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>
              Kamera na żywo (Ekomarina Iława)
            </a>
            <a href={meteoUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>
              Prognoza ICM (meteo.pl)
            </a>
            <a href="https://github.com/yasiupl/jeziorak.net" target="_blank" rel="noopener noreferrer" className={styles.link}>
              Repozytorium GitHub
            </a>
            <a href="https://jasiukowicz.pl" target="_blank" rel="noopener noreferrer" className={styles.link}>
              Strona autora
            </a>
            <a href="https://www.patreon.com/yasiu" target="_blank" rel="noopener noreferrer" className={styles.link}>
              Podoba się? Wspieraj
            </a>
          </div>
        </div>
      </footer>
    </>
  )
}
