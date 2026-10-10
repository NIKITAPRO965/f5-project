
import { useEffect, useState } from "react";
import styles from "./NatureGallery.module.css";
import { searchCommonsImages } from "../../api/imageApi";

function NatureGallery({ locationName = "" }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadNatureImages() {
      const city = locationName.trim();

      setImages([]);
      setActiveIndex(null);
      setError("");

      if (!city) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const query =
          `${city} landscape OR ${city} nature OR ${city} scenery OR ${city} mountains OR ${city} lake OR ${city} waterfall`;

        let allImages = [];
        let offset = 0;

        for (let i = 0; i < 5; i++) {
          const result = await searchCommonsImages(query, offset);

          allImages = [...allImages, ...result.images];

          if (
            result.nextOffset == null ||
            result.nextOffset === offset ||
            allImages.length >= 60
          ) {
            break;
          }

          offset = result.nextOffset;
        }

        if (cancelled) return;

        const uniqueImages = Array.from(
          new Map(
            allImages.map((image) => [image.id, image])
          ).values()
        ).slice(0, 60);

        setImages(uniqueImages);

        if (uniqueImages.length === 0) {
          setError(`No landscape photos found for ${city}.`);
        }
      } catch {
        if (!cancelled) {
          setError("Unable to load landscape photos.");
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
    if (activeIndex === null || images.length === 0) return;

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
    setActiveIndex(
      (index) => (index - 1 + images.length) % images.length
    );
  };

  const showNext = () => {
    setActiveIndex((index) => (index + 1) % images.length);
  };

  if (loading) {
    return (
      <section className={styles.section}>
        <h2 className={styles.title}>Beautiful Nature</h2>
        <p className={styles.message}>
          Loading landscapes near {locationName}...
        </p>
      </section>
    );
  }

  if (error || images.length === 0) {
    return (
      <section className={styles.section}>
        <h2 className={styles.title}>Beautiful Nature</h2>
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
        <h2 className={styles.title}>Beautiful Nature</h2>
        <p className={styles.subtitle}>
          Landscapes and nature around {locationName}
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

            <p className={styles.viewerTitle}>
              {activeImage.title}
            </p>

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
