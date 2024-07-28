import styles from './Livestream.module.css'

export default function Livestream() {
  return (
    <>
      <iframe id="live" src="https://streaming.airmax.pl/ilawaum/embed.html" className={styles.livestream}></iframe>
    </>
  )
}
