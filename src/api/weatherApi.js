
const GEOCODING_URL =
  "https://geocoding-api.open-meteo.com/v1/search";

const FORECAST_URL =
  "https://api.open-meteo.com/v1/forecast";

function getCondition(code) {
  if (code === 0) {
    return { main: "Clear", description: "Ясно", icon: "☀️" };
  }

  if ([1, 2, 3].includes(code)) {
    return {
      main: "Clouds",
      description: "Облачно",
      icon: "⛅",
    };
  }

  if ([45, 48].includes(code)) {
    return { main: "Fog", description: "Туман", icon: "🌫️" };
  }

  if ([51, 53, 55, 56, 57].includes(code)) {
    return { main: "Drizzle", description: "Морось", icon: "🌦️" };
  }

  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return { main: "Rain", description: "Дождь", icon: "🌧️" };
  }

  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return { main: "Snow", description: "Снег", icon: "❄️" };
  }

  if ([95, 96, 99].includes(code)) {
    return {
      main: "Thunderstorm",
      description: "Гроза",
      icon: "⛈️",
    };
  }

  return {
    main: "Clouds",
    description: "Переменная облачность",
    icon: "🌤️",
  };
}

async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Не вдалося отримати дані про погоду");
  }

  return response.json();
}

// Принимает либо название места, либо объект с координатами Photon
export async function fetchWeatherByCity(cityInput) {
  let location;

  if (
    typeof cityInput === "object" &&
    cityInput !== null &&
    Number.isFinite(Number(cityInput.latitude)) &&
    Number.isFinite(Number(cityInput.longitude))
  ) {
    location = {
      name: cityInput.name,
      latitude: Number(cityInput.latitude),
      longitude: Number(cityInput.longitude),
      country: cityInput.country || "",
      region: cityInput.region || "",
    };
  } else {
    const cityName =
      typeof cityInput === "string"
        ? cityInput
        : cityInput?.name;

    if (!cityName?.trim()) {
      throw new Error("Введи назву міста або регіону");
    }

    const searchUrl = new URL(GEOCODING_URL);

    searchUrl.searchParams.set("name", cityName.trim());
    searchUrl.searchParams.set("count", "1");
    searchUrl.searchParams.set("language", "en");
    searchUrl.searchParams.set("format", "json");

    const locationData = await fetchJson(searchUrl);

    if (!locationData.results?.length) {
      throw new Error(
        "Місце не знайдено. Спробуй вибрати підказку зі списку."
      );
    }

    location = locationData.results[0];
  }

  const forecastUrl = new URL(FORECAST_URL);

  forecastUrl.searchParams.set("latitude", location.latitude);
  forecastUrl.searchParams.set("longitude", location.longitude);

  forecastUrl.searchParams.set(
    "current",
    [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "weather_code",
      "pressure_msl",
      "wind_speed_10m",
    ].join(",")
  );

  forecastUrl.searchParams.set(
    "hourly",
    "temperature_2m,weather_code,visibility"
  );

  forecastUrl.searchParams.set(
    "daily",
    "weather_code,temperature_2m_max,temperature_2m_min"
  );

  forecastUrl.searchParams.set("forecast_days", "8");
  forecastUrl.searchParams.set("timezone", "auto");

  const data = await fetchJson(forecastUrl);
  const current = data.current;
  const currentCondition = getCondition(current.weather_code);

  let currentHourIndex = data.hourly.time.findIndex(
    (time) => time >= current.time
  );

  if (currentHourIndex < 0) {
    currentHourIndex = 0;
  }

  const hourlyForecast = Array.from({ length: 8 }, (_, index) => {
    const itemIndex = currentHourIndex + index * 3;
    const time = data.hourly.time[itemIndex];

    if (!time) return null;

    const condition = getCondition(
      data.hourly.weather_code[itemIndex]
    );

    return {
      time: time.slice(11, 16),
      temperature: Math.round(
        data.hourly.temperature_2m[itemIndex]
      ),
      icon: condition.icon,
    };
  }).filter(Boolean);

  const weeklyForecast = data.daily.time.map((date, index) => {
    const condition = getCondition(data.daily.weather_code[index]);

    const day =
      index === 0
        ? "Today"
        : new Date(`${date}T12:00:00`).toLocaleDateString(
            "en-US",
            { weekday: "short" }
          );

    return {
      day,
      date,
      icon: condition.icon,
      min: Math.round(data.daily.temperature_2m_min[index]),
      max: Math.round(data.daily.temperature_2m_max[index]),
    };
  });

  return {
    location: {
      name: location.name,
      latitude: Number(location.latitude),
      longitude: Number(location.longitude),
      country: location.country || "",
      region: location.region || "",
    },

    weather: {
      name: location.name,
      main: {
        temp: current.temperature_2m,
        feels_like: current.apparent_temperature,
        temp_min: data.daily.temperature_2m_min[0],
        temp_max: data.daily.temperature_2m_max[0],
        humidity: current.relative_humidity_2m,
        pressure: current.pressure_msl,
      },
      wind: {
        speed: current.wind_speed_10m,
      },
      visibility: data.hourly.visibility[currentHourIndex] ?? 10000,
      weather: [currentCondition],
    },

    hourlyForecast,
    weeklyForecast,
  };
}
