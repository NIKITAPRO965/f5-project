
import { useEffect, useState } from "react";
import styles from "./NatureGallery.module.css";
import { searchCommonsImages } from "../../api/imageApi";

function NatureGallery({ locationName = "" }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadNatureImages() {
      setLoading(true);
      setError("");

      const defaultQuery =
        "nature OR forest OR ocean OR landscape OR ecology";

      let query = locationName.trim()
        ? `"${locationName.trim()}" AND (nature OR landscape OR ecology)`
        : defaultQuery;

      try {
        let allImages = [];
        let nextOffset = 0;

        for (let i = 0; i < 5; i++) {
          let result = await searchCommonsImages(query, nextOffset);

          if (result.images.length === 0 && i === 0 && locationName.trim()) {
            query = defaultQuery;
            nextOffset = 0;
            result = await searchCommonsImages(query, nextOffset);
          }

          const existingIds = new Set(allImages.map((image) => image.id));

          allImages = [
            ...allImages,
            ...result.images.filter((image) => !existingIds.has(image.id)),
          ].slice(0, 60);

          if (
            result.nextOffset == null ||
            result.nextOffset === nextOffset ||
            allImages.length >= 60
          ) {
            break;
          }

          nextOffset = result.nextOffset;
        }

        if (cancelled) return;

        setImages(allImages);

        if (allImages.length === 0) {
          setError("No nature photos found.");
        }
      } catch {
        if (!cancelled) {
          setError("Unable to load nature photos.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadNatureImages();

    return () => {
      cancelled = true;
    };
  }, [locationName]);

  useEffect(() => {
    if (activeIndex === null) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setActiveIndex(null);
      }

      if (event.key === "ArrowRight") {
        setActiveIndex((index) => (index + 1) % images.length);
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex(
          (index) => (index - 1 + images.length) % images.length
        );
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, images.length]);

  const showPrevious = () => {
    setActiveIndex((index) => (index - 1 + images.length) % images.length);
  };

  const showNext = () => {
    setActiveIndex((index) => (index + 1) % images.length);
  };

  if (loading) {
    return (
      <section className={styles.section}>
        <h2 className={styles.title}>Nature & Ecology</h2>
        <p className={styles.message}>Loading nature...</p>
      </section>
    );
  }

  if (error || images.length === 0) {
    return (
      <section className={styles.section}>
        <h2 className={styles.title}>Nature & Ecology</h2>
        <p className={styles.message}>
          {error || "No photos available."}
        </p>
      </section>
    );
  }

  const sliderImages = [...images, ...images];
  const activeImage =
    activeIndex === null ? null : images[activeIndex];

  return (
    <section className={styles.section}>
      <div className={styles.heading}>
        <h2 className={styles.title}>Nature & Ecology</h2>
        <p className={styles.subtitle}>
          Discover the beauty of our planet
        </p>
      </div>

      <div className={styles.slider}>
        <div className={styles.track}>
          {sliderImages.map((image, index) => (
            <button
              className={styles.slide}
              type="button"
              key={`${image.id}-${index}`}
              onClick={() => setActiveIndex(index % images.length)}
              aria-label={`View ${image.title}`}
            >
              <img
                className={styles.image}
                src={image.url}
                alt={image.title}
                loading="lazy"
              />

              <span className={styles.caption}>{image.title}</span>
            </button>
          ))}
        </div>
      </div>

      <p className={styles.attribution}>
        Photos from Wikimedia Commons. Click an image to view it.
      </p>

      {activeImage && (
        <div
          className={styles.lightbox}
          onClick={() => setActiveIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
        >
          <button
            className={styles.closeButton}
            type="button"
            onClick={() => setActiveIndex(null)}
            aria-label="Close photo viewer"
          >
            ×
          </button>

          <button
            className={`${styles.navButton} ${styles.previousButton}`}
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showPrevious();
            }}
            aria-label="Previous image"
          >
            ‹
          </button>

          <div
            className={styles.viewer}
            onClick={(event) => event.stopPropagation()}
          >
            <img
              className={styles.viewerImage}
              src={activeImage.url}
              alt={activeImage.title}
            />

            <p className={styles.viewerTitle}>{activeImage.title}</p>

            <a
              className={styles.sourceButton}
              href={activeImage.sourceUrl}
              target="_blank"
              rel="noreferrer"
            >
              Visit source
            </a>

            <p className={styles.counter}>
              {activeIndex + 1} / {images.length}
            </p>
          </div>

          <button
            className={`${styles.navButton} ${styles.nextButton}`}
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showNext();
            }}
            aria-label="Next image"
          >
            ›
          </button>
        </div>
      )}
    </section>
  );
}

export default NatureGallery;
