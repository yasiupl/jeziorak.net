import styles from './FeedbackButton.module.css';

// The getCapeDescription function might be needed here if we want to include its output
// in the mailto link directly from this component.
// For now, assuming it might be passed or the mailto body is simplified.

export default function FeedbackButton({ currentSailingData, getCapeDescription }) {
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

  const mailBody = `Aktualna prognoza (wg aplikacji o ${currentSailingData.time ? new Date(currentSailingData.time).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }) : 'Brak danych o czasie'}):
--------------------------------------------------
Temperatura: ${currentSailingData.temperature}°C
Wiatr: ${currentSailingData.windSpeed} km/h
Zachmurzenie: ${currentSailingData.cloudCover}%
Opady: ${currentSailingData.precipitation} mm
Ryzyko burzy (CAPE): ${currentSailingData.cape} J/kg (${getCapeDescription ? getCapeDescription(currentSailingData.cape) : 'N/A'})
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