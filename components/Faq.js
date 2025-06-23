import styles from './Faq.module.css';
import {
  WIND_SPEED_MIN_KMH,
  WIND_SPEED_MAX_KMH,
  CLOUD_COVER_MAX_PERCENT,
  PRECIPITATION_MAX_MM,
  CAPE_MAX_JKG,
} from '../config/weatherConfig';
import FeedbackButton from './FeedbackButton'; // Import the FeedbackButton

export default function Faq() {
  return (
    <>
      <div className={styles.faqContainer}>
        <h3 className={styles.faqTitle}>Jak to działa? - FAQ</h3>
        <details className={styles.faqItem}>
        <summary className={styles.faqQuestion}>Jak podejmowana jest decyzja "Pływamy!" / "Klarujemy."?</summary>
        <div className={styles.faqAnswer}>
          <p>
            Decyzja wyświetlana w sekcji "Czy dziś pływamy?" opiera się na aktualnych danych pogodowych dla najbliższej godziny. Aby warunki zostały uznane za sprzyjające żeglowaniu ("Pływamy!"), muszą być spełnione WSZYSTKIE poniższe kryteria:
          </p>
          <ul>
            <li>Prędkość wiatru: pomiędzy {WIND_SPEED_MIN_KMH} km/h a {WIND_SPEED_MAX_KMH} km/h.</li>
            <li>Zachmurzenie: poniżej {CLOUD_COVER_MAX_PERCENT}%.</li>
            <li>Opady: {PRECIPITATION_MAX_MM} mm (brak opadów).</li>
            <li>Ryzyko burzy (CAPE): poniżej {CAPE_MAX_JKG} J/kg.</li>
          </ul>
          <p>
            Jeśli którykolwiek z tych warunków nie jest spełniony, wyświetlana jest decyzja "Klarujemy." wraz z wyjaśnieniem, które parametry nie mieszczą się w założonych granicach.
          </p>
          <FeedbackButton />
        </div>
      </details>
      <details className={styles.faqItem}>
        <summary className={styles.faqQuestion}>Co oznaczają poszczególne parametry?</summary>
        <div className={styles.faqAnswer}>
          <ul>
            <li><strong>Prędkość wiatru:</strong> Optymalna siła wiatru do żeglowania. Za słaby wiatr utrudnia poruszanie się, a zbyt silny może być niebezpieczny.</li>
            <li><strong>Zachmurzenie:</strong> Procent pokrycia nieba chmurami. Mniejsze zachmurzenie oznacza więcej słońca.</li>
            <li><strong>Opady:</strong> Ilość deszczu w milimetrach. Brak opadów jest preferowany.</li>
            <li><strong>Ryzyko burzy (CAPE):</strong> CAPE (Convective Available Potential Energy) to wskaźnik niestabilności atmosfery. Wyższe wartości oznaczają większe prawdopodobieństwo wystąpienia burz. Wartości poniżej {CAPE_MAX_JKG} J/kg uznawane są za bezpieczne dla żeglugi rekreacyjnej.</li>
          </ul>
        </div>
      </details>
      </div>
    </>
  );
}