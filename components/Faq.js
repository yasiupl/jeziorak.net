import styles from './Faq.module.css';
import {
  WIND_SPEED_MIN_KMH,
  WIND_SPEED_MAX_KMH,
  // CLOUD_COVER_MAX_PERCENT, // No longer a single threshold
  PRECIPITATION_MAX_MM,
  CAPE_MAX_JKG,
  CLOUD_COVER_IDEAL_MAX_PERCENT,
  CLOUD_COVER_ACCEPTABLE_MAX_PERCENT,
  TEMP_IDEAL_MIN_C,
  TEMP_IDEAL_MAX_C,
  TEMP_ACCEPTABLE_MIN_C,
  TEMP_ACCEPTABLE_MAX_C,
  SAILING_SCORE_THRESHOLD
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
            Decyzja "Pływamy!" / "Klarujemy." jest podejmowana w dwóch etapach na podstawie aktualnych danych pogodowych:
          </p>
          <ol>
            <li><strong>Sprawdzenie warunków krytycznych:</strong> Najpierw weryfikujemy, czy nie występują warunki bezwzględnie wykluczające żeglowanie:
              <ul>
                <li>Prędkość wiatru: musi być w zakresie {WIND_SPEED_MIN_KMH} - {WIND_SPEED_MAX_KMH} km/h.</li>
                <li>Opady: muszą wynosić {PRECIPITATION_MAX_MM} mm (brak opadów).</li>
                <li>Ryzyko burzy (CAPE): musi być poniżej {CAPE_MAX_JKG} J/kg.</li>
              </ul>
              Jeśli którykolwiek z tych warunków krytycznych nie jest spełniony, decyzja brzmi "Klarujemy."
            </li>
            <li><strong>Ocena ważona pozostałych parametrów:</strong> Jeśli wszystkie warunki krytyczne są spełnione, obliczana jest ocena punktowa (0-1) na podstawie jakości pozostałych warunków:
              <ul>
                <li><strong>Wiatr:</strong> Jeśli mieści się w zakresie {WIND_SPEED_MIN_KMH}-{WIND_SPEED_MAX_KMH} km/h, otrzymuje pełną pulę punktów dla swojej wagi.</li>
                <li><strong>Zachmurzenie:</strong>
                    <ul>
                        <li>Idealne (najwięcej punktów): poniżej {CLOUD_COVER_IDEAL_MAX_PERCENT}%.</li>
                        <li>Akceptowalne (połowa punktów): {CLOUD_COVER_IDEAL_MAX_PERCENT}% - {CLOUD_COVER_ACCEPTABLE_MAX_PERCENT}%.</li>
                        <li>Poniżej akceptowalnego (zero punktów): powyżej {CLOUD_COVER_ACCEPTABLE_MAX_PERCENT}%.</li>
                    </ul>
                </li>
                <li><strong>Temperatura:</strong>
                    <ul>
                        <li>Idealna (najwięcej punktów): {TEMP_IDEAL_MIN_C}°C - {TEMP_IDEAL_MAX_C}°C.</li>
                        <li>Akceptowalna (połowa punktów): {TEMP_ACCEPTABLE_MIN_C}°C - {TEMP_IDEAL_MIN_C-0.1}°C lub {TEMP_IDEAL_MAX_C+0.1}°C - {TEMP_ACCEPTABLE_MAX_C}°C.</li>
                        <li>Poniżej akceptowalnej (zero punktów): poza zakresem {TEMP_ACCEPTABLE_MIN_C}°C - {TEMP_ACCEPTABLE_MAX_C}°C.</li>
                    </ul>
                </li>
              </ul>
              Końcowa ocena ważona tych parametrów musi osiągnąć próg co najmniej <strong>{SAILING_SCORE_THRESHOLD.toFixed(2)}</strong>, aby decyzja brzmiała "Pływamy!". W przeciwnym razie, nawet jeśli warunki krytyczne są spełnione, ale ogólna ocena komfortu jest zbyt niska, decyzja będzie "Klarujemy.".
            </li>
          </ol>
          <p>
            Wyjaśnienie zawsze wskazuje, które konkretne warunki (krytyczne lub wynikające z oceny ważonej) doprowadziły do danej decyzji.
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