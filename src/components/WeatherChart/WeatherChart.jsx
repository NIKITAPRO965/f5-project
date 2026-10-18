
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import styles from "./WeatherChart.module.css";

function WeatherChart({ data = [] }) {
  if (!data.length) {
    return (
      <section className={styles.section}>
        <h2 className={styles.title}>Hourly forecast</h2>
        <div className={styles.card}>
          <p>Hourly forecast is not available.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Hourly forecast</h2>

      <div className={styles.card}>
        <div className={styles.forecast}>
          {data.map((item, index) => (
            <div
              className={styles.forecastItem}
              key={`${item.time}-${index}`}
            >
              <span className={styles.time}>
                {index === 0 ? "Now" : item.time}
              </span>

              <span className={styles.weatherIcon}>
                {item.icon || "⛅"}
              </span>

              <span className={styles.temperature}>
                {Math.round(item.temperature)}°
              </span>
            </div>
          ))}
        </div>

        <div className={styles.chart}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 12,
                right: 12,
                bottom: 0,
                left: 12,
              }}
            >
              <CartesianGrid
                stroke="rgba(255,255,255,0.1)"
                vertical={false}
              />

              <XAxis dataKey="time" hide />

              <YAxis
                hide
                domain={["dataMin - 2", "dataMax + 2"]}
              />

              <Tooltip
                contentStyle={{
                  background: "#1e2634",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "8px",
                  color: "#ffffff",
                }}
                formatter={(value) => [
                  `${value}°C`,
                  "Temperature",
                ]}
                labelStyle={{ color: "#ffffff" }}
              />

              <Line
                type="monotone"
                dataKey="temperature"
                stroke="#f28c38"
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: "#f28c38",
                  stroke: "#ffffff",
                  strokeWidth: 2,
                }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

export default WeatherChart;
