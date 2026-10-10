
import styles from "./WeeklyForecast.module.css";

function WeeklyForecast({ data = [] }) {
  if (data.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>8-day forecast</h2>

      <div className={styles.grid}>
        {data.map((item) => (
          <article
            className={styles.card}
            key={item.date}
          >
            <p className={styles.day}>{item.day}</p>

            <span className={styles.icon} aria-hidden="true">
              {item.icon}
            </span>

            <div className={styles.temperatures}>
              <span className={styles.maxTemp}>{item.max}°</span>
              <span className={styles.minTemp}>{item.min}°</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default WeeklyForecast;
