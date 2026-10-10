
import {
  WiThermometer,
  WiThermometerExterior,
  WiHumidity,
  WiBarometer,
  WiStrongWind,
  WiHorizon,
} from "react-icons/wi";
import styles from "./WeatherDetails.module.css";

function WeatherDetails({
  feelsLike = 16,
  minTemp = 12,
  maxTemp = 20,
  humidity = 65,
  pressure = 1013,
  windSpeed = 12,
  visibility = 10,
}) {
  const details = [
    {
      label: "Feels like",
      value: `${feelsLike}°C`,
      Icon: WiThermometer,
    },
    {
      label: "Min °C - Max °C",
      value: `${minTemp}° - ${maxTemp}°`,
      Icon: WiThermometerExterior,
    },
    {
      label: "Humidity",
      value: `${humidity}%`,
      Icon: WiHumidity,
    },
    {
      label: "Pressure",
      value: `${pressure} hPa`,
      Icon: WiBarometer,
    },
    {
      label: "Wind speed",
      value: `${windSpeed} km/h`,
      Icon: WiStrongWind,
    },
    {
      label: "Visibility",
      value: `${visibility} km`,
      Icon: WiHorizon,
    },
  ];

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Weather details</h2>

      <div className={styles.grid}>
        {details.map(({ label, value, Icon }) => (
          <article className={styles.card} key={label}>
            <Icon className={styles.icon} aria-hidden="true" />

            <div className={styles.info}>
              <p className={styles.label}>{label}</p>
              <p className={styles.value}>{value}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default WeatherDetails;
