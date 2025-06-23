import { useState, useEffect } from 'react';
import styles from './SailingWeather.module.css';
import {
  WIND_SPEED_MIN_KMH,
  WIND_SPEED_MAX_KMH,
  PRECIPITATION_MAX_MM,
  CAPE_MAX_JKG,
  CLOUD_COVER_IDEAL_MAX_PERCENT,
  CLOUD_COVER_ACCEPTABLE_MAX_PERCENT,
  TEMP_IDEAL_MIN_C,
  TEMP_IDEAL_MAX_C,
  TEMP_ACCEPTABLE_MIN_C,
  TEMP_ACCEPTABLE_MAX_C,
  WEIGHT_WIND,
  WEIGHT_CLOUD_COVER,
  WEIGHT_TEMPERATURE,
  SAILING_SCORE_THRESHOLD,
} from '../config/weatherConfig';
import FeedbackButton from './FeedbackButton'; // Import the new component

const QUESTION_ANSWER_TRIPLETS = [
  {
    question: "Dziś pływamy czy klarujemy?",
    yes: "Pływamy!",
    no: "Klarujemy."
  },
  {
    question: "Stawiać żagle czy nie?",
    yes: "Stawiamy żagle!",
    no: "Żagle w dół."
  },
  {
    question: "Jest wiatr w żagle?",
    yes: "Jest wiatr!",
    no: "Zostajemy w porcie."
  },
  {
    question: "Halsujemy dziś?",
    yes: "Halsujemy!",
    no: "Stoimy w dryfie." // More thematic than just "Na brzeg"
  },
  {
    question: "Pogoda na żagle czy na brzeg?",
    yes: "Na wodę!",
    no: "Na brzeg."
  },
  {
    question: "Jeziorak wzywa na rejs?",
    yes: "Ahoj przygodo!",
    no: "Siedzimy w tawernie."
  }
];

const getRandomTriplet = () => QUESTION_ANSWER_TRIPLETS[Math.floor(Math.random() * QUESTION_ANSWER_TRIPLETS.length)];

// Helper functions for wind conversion
const kmhToMs = (kmh) => (kmh * 0.277778);
const kmhToKnots = (kmh) => (kmh * 0.539957);

const getBeaufortScale = (kmh) => {
  if (kmh < 1) return { bft: 0, desc: 'Cisza' };
  if (kmh <= 5) return { bft: 1, desc: 'Słaby powiew' };
  if (kmh <= 11) return { bft: 2, desc: 'Słaby wiatr' };
  if (kmh <= 19) return { bft: 3, desc: 'Łagodny wiatr' };
  if (kmh <= 28) return { bft: 4, desc: 'Umiarkowany wiatr' };
  if (kmh <= 38) return { bft: 5, desc: 'Świeży wiatr' };
  if (kmh <= 49) return { bft: 6, desc: 'Silny wiatr' };
  if (kmh <= 61) return { bft: 7, desc: 'Bardzo silny wiatr' };
  if (kmh <= 74) return { bft: 8, desc: 'Sztorm' }; // Gale
  if (kmh <= 88) return { bft: 9, desc: 'Silny sztorm' }; // Strong gale
  if (kmh <= 102) return { bft: 10, desc: 'Bardzo silny sztorm' }; // Storm
  if (kmh <= 117) return { bft: 11, desc: 'Gwałtowny sztorm' }; // Violent storm
  return { bft: 12, desc: 'Huragan' }; // Hurricane force
};


const getCapeDescription = (cape) => {
  if (cape === null || typeof cape === 'undefined') return 'Brak danych';
  if (cape < 100) return 'Niskie'; // These specific thresholds for description can remain local if they are not the primary decision thresholds
  if (cape < CAPE_MAX_JKG) return `Niskie (poniżej progu ${CAPE_MAX_JKG} J/kg)`; // Use imported CAPE_MAX_JKG
  if (cape < 1000) return 'Umiarkowane';
  if (cape < 2500) return 'Wysokie';
  return 'Bardzo wysokie';
};

export default function SailingWeather() {
  const [sailingDecision, setSailingDecision] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weatherData, setWeatherData] = useState(null); // Full API response
  const [currentSailingData, setCurrentSailingData] = useState(null); // Parsed data for current/relevant hour
  const [explanation, setExplanation] = useState(''); // Explanation for "Nie" or "Błąd"
  
  // State for randomized texts
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentYesAnswer, setCurrentYesAnswer] = useState('');
  const [currentNoAnswer, setCurrentNoAnswer] = useState('');

  useEffect(() => {
    // Select a random triplet on component mount
    const selectedTriplet = getRandomTriplet();
    setCurrentQuestion(selectedTriplet.question);
    setCurrentYesAnswer(selectedTriplet.yes);
    setCurrentNoAnswer(selectedTriplet.no);

    const fetchWeatherData = async () => {
      setLoading(true);
      setError(null);
      setExplanation(''); // Reset explanation
      try {
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=53.639868477866656&longitude=19.55651417710413&hourly=temperature_2m,wind_speed_10m,precipitation,cloud_cover,cape&forecast_days=1&timezone=auto');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (!data.hourly || !data.hourly.time || data.hourly.time.length === 0) {
          throw new Error('Invalid or empty weather data received');
        }

        setWeatherData(data);

        // Find the current hour's data
        // The API returns times in ISO8601 format, adjusted to the specified timezone (auto -> Europe/Warsaw)
        const now = new Date();
        const currentHourISO = now.toISOString().substring(0, 13); // e.g., "2023-10-27T10"

        let currentData = null;
        for (let i = 0; i < data.hourly.time.length; i++) {
          if (data.hourly.time[i].startsWith(currentHourISO)) {
            currentData = {
              time: data.hourly.time[i],
              windSpeed: data.hourly.wind_speed_10m[i],
              precipitation: data.hourly.precipitation[i],
              cloudCover: data.hourly.cloud_cover[i],
              cape: data.hourly.cape[i],
              temperature: data.hourly.temperature_2m[i],
            };
            break;
          }
        }
        
        // Fallback to the latest available hour if current hour not perfectly matched (e.g. API data slightly delayed)
        // Or if it's past the last forecast hour for the day
        if (!currentData && data.hourly.time.length > 0) {
            const lastIndex = data.hourly.time.length -1;
             // Check if 'now' is past the last forecast time. If so, it might be better to say "data outdated"
            const lastForecastTime = new Date(data.hourly.time[lastIndex]);
            if (now > lastForecastTime) {
                 // Attempt to find the closest available future data point if current time is before first forecast point
                let foundFuture = false;
                for (let i = 0; i < data.hourly.time.length; i++) {
                    const forecastTime = new Date(data.hourly.time[i]);
                    if (forecastTime >= now) {
                        currentData = {
                            time: data.hourly.time[i],
                            windSpeed: data.hourly.wind_speed_10m[i],
                            precipitation: data.hourly.precipitation[i],
                            cloudCover: data.hourly.cloud_cover[i],
                            cape: data.hourly.cape[i],
                            temperature: data.hourly.temperature_2m[i],
                        };
                        foundFuture = true;
                        break;
                    }
                }
                if (!foundFuture) {
                     // If still no data, use the very last available data point as a last resort
                    currentData = {
                        time: data.hourly.time[lastIndex],
                        windSpeed: data.hourly.wind_speed_10m[lastIndex],
                        precipitation: data.hourly.precipitation[lastIndex],
                        cloudCover: data.hourly.cloud_cover[lastIndex],
                        cape: data.hourly.cape[lastIndex],
                        temperature: data.hourly.temperature_2m[lastIndex],
                    };
                }
            } else { // If current time is within forecast range but no exact match, take the latest available
                 currentData = {
                    time: data.hourly.time[lastIndex],
                    windSpeed: data.hourly.wind_speed_10m[lastIndex],
                    precipitation: data.hourly.precipitation[lastIndex],
                    cloudCover: data.hourly.cloud_cover[lastIndex],
                    cape: data.hourly.cape[lastIndex],
                    temperature: data.hourly.temperature_2m[lastIndex],
                };
            }
        }


        if (!currentData) {
          throw new Error('Could not determine current weather conditions from API data.');
        }
        setCurrentSailingData(currentData); // Store the relevant weather data

        // Decision logic
        let reasons = [];
        let sailingScore = 0;
        let decision = selectedTriplet.no; // Default to "No"
        let explanationMsg = '';

        // Critical "No-Go" conditions
        const criticalWindOK = currentData.windSpeed >= WIND_SPEED_MIN_KMH && currentData.windSpeed <= WIND_SPEED_MAX_KMH;
        const criticalNoRain = currentData.precipitation <= PRECIPITATION_MAX_MM;
        const criticalNoStormRisk = currentData.cape < CAPE_MAX_JKG;

        if (!criticalWindOK) {
          if (currentData.windSpeed < WIND_SPEED_MIN_KMH) reasons.push(`wiatr jest za słaby (${currentData.windSpeed.toFixed(1)} km/h, min. ${WIND_SPEED_MIN_KMH} km/h)`);
          if (currentData.windSpeed > WIND_SPEED_MAX_KMH) reasons.push(`wiatr jest za silny (${currentData.windSpeed.toFixed(1)} km/h, max. ${WIND_SPEED_MAX_KMH} km/h)`);
        }
        if (!criticalNoRain) {
          reasons.push(`występują opady (${currentData.precipitation} mm)`);
        }
        if (!criticalNoStormRisk) {
          reasons.push(`istnieje ryzyko burzy (CAPE: ${currentData.cape} J/kg, max. ${CAPE_MAX_JKG} J/kg)`);
        }

        if (reasons.length > 0) { // If any critical condition fails
          explanationMsg = `Ponieważ ${reasons.join(', oraz ')}.`;
        } else {
          // All critical conditions are met, proceed to weighted scoring
          let windScore = 1.0; // Assumed good if in range

          let cloudCoverScore = 0;
          if (currentData.cloudCover < CLOUD_COVER_IDEAL_MAX_PERCENT) {
            cloudCoverScore = 1.0; // Ideal
          } else if (currentData.cloudCover <= CLOUD_COVER_ACCEPTABLE_MAX_PERCENT) {
            cloudCoverScore = 0.5; // Acceptable
          }

          let temperatureScore = 0;
          if (currentData.temperature >= TEMP_IDEAL_MIN_C && currentData.temperature <= TEMP_IDEAL_MAX_C) {
            temperatureScore = 1.0; // Ideal
          } else if (currentData.temperature >= TEMP_ACCEPTABLE_MIN_C && currentData.temperature <= TEMP_ACCEPTABLE_MAX_C) {
            temperatureScore = 0.5; // Acceptable
          }
          
          sailingScore = (windScore * WEIGHT_WIND) +
                         (cloudCoverScore * WEIGHT_CLOUD_COVER) +
                         (temperatureScore * WEIGHT_TEMPERATURE);

          const displayScore = Math.round(sailingScore * 100);
          const displayThreshold = Math.round(SAILING_SCORE_THRESHOLD * 100);

          if (sailingScore >= SAILING_SCORE_THRESHOLD) {
            decision = selectedTriplet.yes;
            if (sailingScore < 0.95) { // Not perfect but good enough
                 explanationMsg = `Warunki są dobre (ocena: ${displayScore}%). `;
                 let details = [];
                 if (cloudCoverScore < 1.0) details.push(`zachmurzenie ${currentData.cloudCover}%`);
                 if (temperatureScore < 1.0) details.push(`temperatura ${currentData.temperature.toFixed(1)}°C`);
                 if (details.length > 0) explanationMsg += `Mimo to, ${details.join(' i ')} są w akceptowalnym zakresie.`;
                 else explanationMsg += `Wszystkie kluczowe parametry są w normie.`;

            } else {
                 explanationMsg = `Warunki są idealne (ocena: ${displayScore}/${displayThreshold} pkt)!`;
            }
          } else {
            decision = selectedTriplet.no;
            explanationMsg = `Warunki nie są wystarczająco dobre (ocena: ${displayScore}/${displayThreshold} pkt). `;
            let subOptimalReasons = [];
            if (cloudCoverScore < 0.5) subOptimalReasons.push(`zbyt duże zachmurzenie (${currentData.cloudCover}%)`);
            else if (cloudCoverScore < 1.0) subOptimalReasons.push(`zachmurzenie mogłoby być mniejsze (${currentData.cloudCover}%)`);
            
            if (temperatureScore < 0.5) subOptimalReasons.push(`temperatura jest zbyt niska/wysoka (${currentData.temperature.toFixed(1)}°C)`);
            else if (temperatureScore < 1.0) subOptimalReasons.push(`temperatura mogłaby być bardziej komfortowa (${currentData.temperature.toFixed(1)}°C)`);

            if (subOptimalReasons.length > 0) {
              explanationMsg += `Główne powody: ${subOptimalReasons.join(', ')}.`;
            } else if (reasons.length === 0) { // Should not happen if score is low and no critical fails, but as a fallback
                explanationMsg += `Ogólna ocena warunków jest poniżej progu.`;
            }
          }
        }
        
        setSailingDecision(decision);
        setExplanation(explanationMsg);

      } catch (e) {
        console.error("Failed to fetch or process weather data:", e);
        setError(e.message);
        setSailingDecision('Błąd');
        setExplanation(`Błąd: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
    // Optional: Set up an interval to refresh data, e.g., every 30 minutes
    // const intervalId = setInterval(fetchWeatherData, 30 * 60 * 1000);
    // return () => clearInterval(intervalId);
  }, []); // Empty dependency array: select triplet and fetch data once on mount

  // Show loading indicator while fetching
  if (isLoading) {
    return (
      <div className={styles.container}>
        <h2 className={styles.question}>{currentQuestion || 'Czy dziś pływamy?'}</h2>
        <p className={styles.loading}>Ładowanie danych...</p>
      </div>
    );
  }

  // Main return statement
  return (
    <div className={styles.container}>
      <h2 className={styles.question}>{currentQuestion || 'Czy dziś pływamy?'}</h2>
      
      {error && (
        <>
          <div className={`${styles.error_decision} ${styles.errorBox}`}> {/* Use error_decision for consistent large text styling, add errorBox for specific error message styling */}
            Błąd
          </div>
          <p className={styles.explanation}>Nie udało się pobrać danych: {error}</p>
          <a href="https://www.meteo.pl/um/metco/mgram_pict.php?ntype=0u&row=368&col=225&lang=pl" target="_blank" rel="noopener noreferrer" className={styles.errorLinkButton}>
            Sprawdź prognozę na meteo.pl
          </a>
        </>
      )}

      {!error && sailingDecision === 'Błąd' && (
         <>
          <div className={`${styles.error_decision} ${styles.errorBox}`}>
            Błąd
          </div>
          <p className={styles.explanation}>Wystąpił błąd przetwarzania danych.</p>
          <a href="https://www.meteo.pl/um/metco/mgram_pict.php?ntype=0u&row=368&col=225&lang=pl" target="_blank" rel="noopener noreferrer" className={styles.errorLinkButton}>
            Sprawdź prognozę na meteo.pl
          </a>
        </>
      )}
      
      {!error && sailingDecision && sailingDecision !== 'Błąd' && (
        <>
          <div className={sailingDecision === currentYesAnswer ? styles.tak : styles.nie}>
            {sailingDecision}
          </div>
          {explanation && <p className={styles.explanation}>{explanation}</p>}
        </>
      )}
      
      {/* Details should only show if no error and data is available */}
      {!isLoading && currentSailingData && sailingDecision !== 'Błąd' && (
        <div className={styles.details}>
          <h4>Aktualne warunki ({currentSailingData.time ? new Date(currentSailingData.time).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }) : 'Brak danych o czasie'}):</h4>
          <p>Temperatura: {currentSailingData.temperature.toFixed(1)}°C</p>
          <p>
            Wiatr: {currentSailingData.windSpeed.toFixed(1)} km/h
            ({kmhToMs(currentSailingData.windSpeed).toFixed(1)} m/s, {kmhToKnots(currentSailingData.windSpeed).toFixed(1)} węzłów)
            <br />
            Skala Beauforta: {getBeaufortScale(currentSailingData.windSpeed).bft} Bft ({getBeaufortScale(currentSailingData.windSpeed).desc})
          </p>
          <p>Zachmurzenie: {currentSailingData.cloudCover}%</p>
          <p>Opady: {currentSailingData.precipitation} mm</p>
          <p>Ryzyko burzy (CAPE): {currentSailingData.cape} J/kg ({getCapeDescription(currentSailingData.cape)})</p>
        </div>
      )}
      
      {!isLoading && currentSailingData && sailingDecision !== 'Błąd' && (
        <FeedbackButton
          currentSailingData={currentSailingData}
          getCapeDescription={getCapeDescription}
          getBeaufortScale={getBeaufortScale}
          kmhToMs={kmhToMs}
          kmhToKnots={kmhToKnots}
          sailingDecision={sailingDecision}
          explanation={explanation}
        />
      )}
    </div>
  );
}