
import styles from "./Hero.module.css";

function Hero() {
  return (
    <section className={styles.hero}>
      <h1 className={styles.title}>Weather Dashboard</h1>
      <p className={styles.description}>
        Check the weather in your city
      </p>
    </section>
  );
}

export default Hero;
