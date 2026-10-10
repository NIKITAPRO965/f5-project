
import { useState, useEffect, useCallback } from "react";
import "./App.css";

import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import WeatherCard from "./components/WeatherCard/WeatherCard";
import WeatherDetails from "./components/WeatherDetails/WeatherDetails";
import WeatherChart from "./components/WeatherChart/WeatherChart";
import WeeklyForecast from "./components/WeeklyForecast/WeeklyForecast";
import News from "./components/News/News";
import NatureGallery from "./components/NatureGallery/NatureGallery";
import Footer from "./components/Footer/Footer";

import { fetchWeatherByCity } from "./api/weatherApi";

function getLocationKey(item) {
  const location = item.location || item;

  if (
    Number.isFinite(Number(location.latitude)) &&
    Number.isFinite(Number(location.longitude))
  ) {
    return `${Number(location.latitude).toFixed(4)},${Number(
      location.longitude
    ).toFixed(4)}`;
  }

  return (location.name || "").toLowerCase();
}

function App() {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [initialized, setInitialized] = useState(false);

  // Загружаем сохранённые места с их координатами
  useEffect(() => {
    let cancelled = false;

    async function loadCities() {
      let savedLocations = ["Kyiv"];

      try {
        const stored = localStorage.getItem("weatherCities");

        if (stored !== null) {
          const parsed = JSON.parse(stored);

          if (Array.isArray(parsed)) {
            savedLocations = parsed.filter(
              (item) =>
                typeof item === "string" ||
                (item &&
                  typeof item.name === "string" &&
                  Number.isFinite(Number(item.latitude)) &&
                  Number.isFinite(Number(item.longitude)))
            );
          } else {
            savedLocations = ["Kyiv"];
          }
        }
      } catch {
        savedLocations = ["Kyiv"];
      }

      setLoading(true);

      const results = await Promise.allSettled(
        savedLocations.map((location) => fetchWeatherByCity(location))
      );

      if (cancelled) return;

      const loadedCities = results
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value);

      setCities(loadedCities);

      if (loadedCities.length > 0) {
        setSelectedCity(getLocationKey(loadedCities[0]));
      } else {
        setError("Не вдалося завантажити погоду");
      }

      setLoading(false);
      setInitialized(true);
    }

    loadCities();

    return () => {
      cancelled = true;
    };
  }, []);

  // Сохраняем названия и координаты мест
  useEffect(() => {
    if (!initialized) return;

    localStorage.setItem(
      "weatherCities",
      JSON.stringify(cities.map((item) => item.location))
    );
  }, [cities, initialized]);

  // Добавление места из поиска или подсказки
  const handleSearch = useCallback(async (place) => {
    setLoading(true);
    setError("");

    try {
      const result = await fetchWeatherByCity(place);
      const key = getLocationKey(result);

      setCities((previousCities) => {
        const exists = previousCities.some(
          (item) => getLocationKey(item) === key
        );

        if (exists) {
          return previousCities.map((item) =>
            getLocationKey(item) === key ? result : item
          );
        }

        return [...previousCities, result];
      });

      setSelectedCity(key);
    } catch (err) {
      setError(err.message || "Не вдалося отримати погоду");
    } finally {
      setLoading(false);
    }
  }, []);

  // Обновление погоды
  const handleRefresh = useCallback(async (item) => {
    setLoading(true);
    setError("");

    try {
      const result = await fetchWeatherByCity(item.location);
      const key = getLocationKey(item);

      setCities((previousCities) =>
        previousCities.map((city) =>
          getLocationKey(city) === key ? result : city
        )
      );
    } catch (err) {
      setError(err.message || "Не вдалося оновити погоду");
    } finally {
      setLoading(false);
    }
  }, []);

  // Удаление места
  const handleDelete = useCallback(
    (key) => {
      const remainingCities = cities.filter(
        (item) => getLocationKey(item) !== key
      );

      setCities(remainingCities);

      if (selectedCity === key) {
        setSelectedCity(
          remainingCities.length > 0
            ? getLocationKey(remainingCities[0])
            : ""
        );
      }

      setError("");
    },
    [cities, selectedCity]
  );

  const selectedWeather = cities.find(
    (item) => getLocationKey(item) === selectedCity
  );

  return (
    <>
      <Header />

      <main>
        <Hero
          onSearch={handleSearch}
          onCityChange={setSearchCity}
        />

        {loading && (
          <p className="weatherMessage">Loading weather...</p>
        )}

        {error && (
          <p className="weatherMessage">{error}</p>
        )}

        <div className="weatherList">
          {cities.map((item) => {
            const key = getLocationKey(item);

            return (
              <WeatherCard
                key={key}
                city={item.weather.name}
                temperature={Math.round(item.weather.main.temp)}
                description={item.weather.weather[0].description}
                icon={item.weather.weather[0].icon}
                onClick={() => setSelectedCity(key)}
                onRefresh={() => handleRefresh(item)}
                onDelete={() => handleDelete(key)}
              />
            );
          })}
        </div>

        {selectedWeather && (
          <>
            <WeatherDetails
              feelsLike={Math.round(
                selectedWeather.weather.main.feels_like
              )}
              minTemp={Math.round(
                selectedWeather.weather.main.temp_min
              )}
              maxTemp={Math.round(
                selectedWeather.weather.main.temp_max
              )}
              humidity={selectedWeather.weather.main.humidity}
              pressure={Math.round(
                selectedWeather.weather.main.pressure
              )}
              windSpeed={Math.round(
                selectedWeather.weather.wind.speed
              )}
              visibility={Math.round(
                selectedWeather.weather.visibility / 1000
              )}
            />

            <WeatherChart data={selectedWeather.hourlyForecast} />

            <WeeklyForecast data={selectedWeather.weeklyForecast} />
          </>
        )}

        {(searchCity.trim() || selectedWeather) && (
        <>
        <News
        locationName={selectedWeather?.location.name || searchCity}
        />

        <NatureGallery
        locationName={selectedWeather?.location.name || searchCity}
        />
        </>
        )}
      </main>

      <Footer />
    </>
  );
}

export default App;
