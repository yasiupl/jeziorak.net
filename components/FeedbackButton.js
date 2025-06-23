import styles from './FeedbackButton.module.css';

// The getCapeDescription, getBeaufortScale, kmhToMs, kmhToKnots, sailingDecision, explanation functions might be needed here
// if we want to include their output in the mailto link directly from this component.

export default function FeedbackButton({ currentSailingData, getCapeDescription, getBeaufortScale, kmhToMs, kmhToKnots, sailingDecision, explanation }) {
  if (!currentSailingData) {
    // Or render a generic button if no data is available
    return (
      <div className={styles.feedbackSection}>
        <a
          href={`mailto:zgloszenia@jeziorak.net?subject=${encodeURIComponent("Zgłoszenie - Prognoza Jeziorak.net")}&body=${encodeURIComponent("Opisz proszę, co się nie zgadza lub co można poprawić:\n[Twoje uwagi]\n\n")}`}
          className={styles.feedbackButton}
        >
          Zgłoś uwagę do prognozy
        </a>
      </div>
    );
  }

  const beaufort = getBeaufortScale && currentSailingData.windSpeed !== undefined ? getBeaufortScale(currentSailingData.windSpeed) : null;
  const windMs = kmhToMs && currentSailingData.windSpeed !== undefined ? kmhToMs(currentSailingData.windSpeed).toFixed(1) : 'N/A';
  const windKnots = kmhToKnots && currentSailingData.windSpeed !== undefined ? kmhToKnots(currentSailingData.windSpeed).toFixed(1) : 'N/A';

  const mailBody = `Prognoza aplikacji:
Decyzja: ${sailingDecision || 'N/A'}
Wyjaśnienie: ${explanation || 'N/A'}
--------------------------------------------------
Dane pogodowe (wg aplikacji o ${currentSailingData.time ? new Date(currentSailingData.time).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }) : 'Brak danych o czasie'}):
--------------------------------------------------
Temperatura: ${currentSailingData.temperature !== undefined ? currentSailingData.temperature.toFixed(1) : 'N/A'}°C
Wiatr: ${currentSailingData.windSpeed !== undefined ? currentSailingData.windSpeed.toFixed(1) : 'N/A'} km/h (${windMs} m/s, ${windKnots} węzłów)
Skala Beauforta: ${beaufort ? `${beaufort.bft} Bft (${beaufort.desc})` : 'N/A'}
Zachmurzenie: ${currentSailingData.cloudCover !== undefined ? currentSailingData.cloudCover : 'N/A'}%
Opady: ${currentSailingData.precipitation !== undefined ? currentSailingData.precipitation : 'N/A'} mm
Ryzyko burzy (CAPE): ${currentSailingData.cape !== undefined ? currentSailingData.cape : 'N/A'} J/kg (${getCapeDescription && currentSailingData.cape !== undefined ? getCapeDescription(currentSailingData.cape) : 'N/A'})
--------------------------------------------------

Opisz proszę, co się nie zgadza lub co można poprawić:
[Twoje uwagi]

`;

  return (
    <div className={styles.feedbackSection}>
      <a
        href={`mailto:zgloszenia@jeziorak.net?subject=${encodeURIComponent("Zgłoszenie - Prognoza Jeziorak.net")}&body=${encodeURIComponent(mailBody)}`}
        className={styles.feedbackButton}
      >
        Zgłoś uwagę do prognozy
      </a>
    </div>
  );
}