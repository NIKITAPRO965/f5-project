import styles from "./News.module.css";

const news = [
  {
    id: 1,
    title: "How weather affects our daily lives",
    description:
      "Discover how changing weather conditions influence our everyday activities.",
    image:
      "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&w=800&q=80",
    date: "Today",
  },
  {
    id: 2,
    title: "Understanding climate change",
    description:
      "Learn about climate patterns and the changes happening around the world.",
    image:
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
    date: "Yesterday",
  },
  {
    id: 3,
    title: "Beautiful places in nature",
    description:
      "Explore amazing natural landscapes and the beauty of our planet.",
    image:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=80",
    date: "2 days ago",
  },
  {
  id: 4,
  title: "The importance of weather forecasts",
  description:
    "Weather forecasts help us plan our activities and prepare for changing conditions.",
  image:
    "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=800&q=80",
  date: "3 days ago",
  },
];

function News({ data = news }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Latest news</h2>

      <div className={styles.grid}>
        {data.map((item) => (
          <article className={styles.card} key={item.id}>
            <img
              className={styles.image}
              src={item.image}
              alt=""
              loading="lazy"
            />

            <div className={styles.content}>
              <p className={styles.date}>{item.date}</p>

              <h3 className={styles.cardTitle}>{item.title}</h3>

              <p className={styles.description}>
                {item.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default News;