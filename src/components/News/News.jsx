
import { useEffect, useState } from "react";
import styles from "./News.module.css";
import { searchCommonsImages } from "../../api/imageApi";

const PAGE_SIZE = 4;

function News({ locationName = "" }) {
  const [images, setImages] = useState([]);
  const [offset, setOffset] = useState(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [activeQuery, setActiveQuery] = useState(
    "cats OR dogs OR pets OR animals"
  );
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadAnimals() {
      setLoading(true);
      setError("");
      setImages([]);
      setOffset(null);
      setVisibleCount(PAGE_SIZE);

      const query = locationName.trim()
        ? `"${locationName.trim()}" AND (animals OR wildlife OR pets)`
        : "cats OR dogs OR pets OR animals";

      try {
        let result = await searchCommonsImages(query);
        let usedQuery = query;

        if (result.images.length === 0 && locationName.trim()) {
          usedQuery = "cats OR dogs OR pets OR animals";
          result = await searchCommonsImages(usedQuery);
        }

        if (cancelled) return;

        setImages(result.images);
        setOffset(result.nextOffset);
        setActiveQuery(usedQuery);

        if (result.images.length === 0) {
          setError("No animal photos found.");
        }
      } catch {
        if (!cancelled) {
          setError("Unable to load animal photos.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadAnimals();

    return () => {
      cancelled = true;
    };
  }, [locationName]);

  const handleLoadMore = async () => {
    if (loadingMore) return;

    // Если уже загруженные изображения скрыты,
    // сначала показываем следующие 4.
    if (visibleCount < images.length) {
      setVisibleCount((count) =>
        Math.min(count + PAGE_SIZE, images.length)
      );
      return;
    }

    if (offset === null) return;

    setLoadingMore(true);
    setError("");

    try {
      const result = await searchCommonsImages(activeQuery, offset);

      setImages((previous) => {
        const existingIds = new Set(previous.map((image) => image.id));

        return [
          ...previous,
          ...result.images.filter((image) => !existingIds.has(image.id)),
        ];
      });

      setOffset(result.nextOffset);

      if (result.images.length === 0) {
        setError("No more photos found.");
      } else {
        setVisibleCount((count) => count + PAGE_SIZE);
      }
    } catch {
      setError("Unable to load more photos.");
    } finally {
      setLoadingMore(false);
    }
  };

  const handleClear = () => {
    setVisibleCount(PAGE_SIZE);
    setError("");
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Animal Gallery</h2>

      <p className={styles.subtitle}>
        {locationName
          ? `Animals and wildlife near ${locationName}`
          : "Discover amazing animals from around the world"}
      </p>

      {loading && <p className={styles.message}>Loading animals...</p>}

      {error && <p className={styles.message}>{error}</p>}

      {!loading && images.length > 0 && (
        <>
          <div className={styles.grid}>
            {images.slice(0, visibleCount).map((image) => (
              <article className={styles.card} key={image.id}>
                <a
                  className={styles.imageLink}
                  href={image.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    className={styles.image}
                    src={image.url}
                    alt={image.title}
                    loading="lazy"
                  />
                </a>

                <div className={styles.caption}>
                  <p className={styles.imageTitle}>{image.title}</p>

                  <a
                    className={styles.sourceLink}
                    href={image.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Image source
                  </a>
                </div>
              </article>
            ))}
          </div>

          <div className={styles.actions}>
            {(visibleCount > PAGE_SIZE || images.length > PAGE_SIZE) && (
              <button
                className={styles.clearButton}
                type="button"
                onClick={handleClear}
              >
                Clear
              </button>
            )}

            {(visibleCount < images.length || offset !== null) && (
              <button
                className={styles.loadMore}
                type="button"
                onClick={handleLoadMore}
                disabled={loadingMore}
              >
                {loadingMore ? "Loading..." : "Load more"}
              </button>
            )}
          </div>
        </>
      )}
    </section>
  );
}

export default News;
