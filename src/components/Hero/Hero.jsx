
import { useState, useEffect } from "react";
import styles from "./Hero.module.css";
import { searchLocations } from "../../api/locationSuggestions";

function Hero({ onSearch }) {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const now = new Date();

  const time = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const dayAndDate = now.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  useEffect(() => {
    const query = city.trim();

    if (!showSuggestions || query.length < 2) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();

    const timeoutId = setTimeout(async () => {
      try {
        const results = await searchLocations(
          query,
          controller.signal
        );

        setSuggestions(results);
      } catch (error) {
        if (error.name !== "AbortError") {
          setSuggestions([]);
        }
      }
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [city, showSuggestions]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const value = city.trim();

    if (!value) return;

    setShowSuggestions(false);
    setSuggestions([]);
    onSearch?.(value);
  };

  const handleSelectSuggestion = (suggestion) => {
    setCity(suggestion.name);
    setSuggestions([]);
    setShowSuggestions(false);

    onSearch?.({
      name: suggestion.name,
      latitude: suggestion.latitude,
      longitude: suggestion.longitude,
    });
  };

  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <h1 className={styles.title}>Weather dashboard</h1>

        <div className={styles.info}>
          <p className={styles.description}>
            Check the weather in your city
          </p>

          <span className={styles.separator} aria-hidden="true">
            |
          </span>

          <div className={styles.datetime}>
            <span>{time}</span>
            <span>{dayAndDate}</span>
          </div>
        </div>

        <form
          className={styles.searchForm}
          onSubmit={handleSubmit}
        >
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search city or region"
            aria-label="Search city or region"
            autoComplete="off"
            value={city}
            onChange={(event) => {
              setCity(event.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            required
          />

          <button
            className={styles.searchButton}
            type="submit"
          >
            Search
          </button>

          {showSuggestions && suggestions.length > 0 && (
            <ul className={styles.suggestions} role="listbox">
              {suggestions.map((suggestion) => (
                <li key={suggestion.id}>
                  <button
                    className={styles.suggestion}
                    type="button"
                    role="option"
                    aria-selected={false}
                    onClick={() =>
                      handleSelectSuggestion(suggestion)
                    }
                  >
                    <span className={styles.suggestionName}>
                      {suggestion.name}
                    </span>

                    <span className={styles.suggestionLocation}>
                      {[
                        suggestion.region,
                        suggestion.country,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </form>
      </div>
    </section>
  );
}

export default Hero;
