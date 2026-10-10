
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

const fallbackForecast = [
  { time: "Now", temperature: 18 },
  { time: "13:00", temperature: 19 },
  { time: "14:00", temperature: 21 },
  { time: "15:00", temperature: 22 },
  { time: "16:00", temperature: 20 },
  { time: "17:00", temperature: 18 },
  { time: "18:00", temperature: 16 },
  { time: "19:00", temperature: 15 },
];

function WeatherChart({ data = fallbackForecast }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Hourly forecast</h2>

      <div className={styles.card}>
        <div className={styles.forecast}>
          {data.map((item) => (
            <div className={styles.forecastItem} key={item.time}>
              <span className={styles.time}>{item.time}</span>
              <span className={styles.weatherIcon}>
                {item.icon || "⛅"}
              </span>
              <span className={styles.temperature}>
                {item.temperature}°
              </span>
            </div>
          ))}
        </div>

        <div className={styles.chart}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 12, right: 12, bottom: 0, left: 12 }}
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
                formatter={(value) => [`${value}°C`, "Temperature"]}
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
