
import styles from "./WeatherCard.module.css";

function WeatherCard({
  city = "Kyiv",
  temperature = 18,
  description = "Partly cloudy",
  icon = "⛅",
  onRefresh,
  onDelete,
  onClick,
}) {
  return (
    <article
      className={styles.card}
      onClick={onClick}
      onKeyDown={(event) => {
        if (
          onClick &&
          (event.key === "Enter" || event.key === " ")
        ) {
          event.preventDefault();
          onClick();
        }
      }}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className={styles.header}>
        <h2 className={styles.city}>{city}</h2>

        <div className={styles.actions}>
          <button
            className={styles.actionButton}
            type="button"
            aria-label={`Refresh weather in ${city}`}
            title="Refresh weather"
            onClick={(event) => {
              event.stopPropagation();
              onRefresh?.();
            }}
          >
            ↻
          </button>

          <button
            className={styles.actionButton}
            type="button"
            aria-label={`Delete ${city}`}
            title="Delete city"
            onClick={(event) => {
              event.stopPropagation();
              onDelete?.();
            }}
          >
            ×
          </button>
        </div>
      </div>

      <div className={styles.weather}>
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>

        <div className={styles.temperatureBlock}>
          <p className={styles.temperature}>
            {temperature}°
          </p>

          <p className={styles.description}>
            {description}
          </p>
        </div>
      </div>

      <div className={styles.footer}>
        <span>Current weather</span>
        <span className={styles.details}>View details →</span>
      </div>
    </article>
  );
}

export default WeatherCard;
