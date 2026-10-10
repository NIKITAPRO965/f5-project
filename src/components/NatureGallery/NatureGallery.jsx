
import { useEffect, useState } from "react";
import styles from "./NatureGallery.module.css";

const images = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1800&q=90",
    alt: "Mountain lake surrounded by green hills",
    title: "Mountain landscapes",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1800&q=90",
    alt: "Misty mountains and forest",
    title: "Misty forests",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=90",
    alt: "Beautiful natural landscape",
    title: "Beautiful nature",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1800&q=90",
    alt: "Sunlight passing through a forest",
    title: "Forest trails",
  },
];

function NatureGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const previousImage = () => {
    setActiveIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    setActiveIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  useEffect(() => {
    if (!isFullscreen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsFullscreen(false);
      }

      if (event.key === "ArrowLeft") {
        previousImage();
      }

      if (event.key === "ArrowRight") {
        nextImage();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  const activeImage = images[activeIndex];

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Nature gallery</h2>

      <div className={styles.slider}>
        <img
          className={styles.image}
          src={activeImage.src}
          alt={activeImage.alt}
          onClick={() => setIsFullscreen(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              setIsFullscreen(true);
            }
          }}
          aria-label="Open image fullscreen"
        />

        <button
          className={`${styles.arrow} ${styles.previous}`}
          type="button"
          onClick={previousImage}
          aria-label="Previous image"
        >
          &#10094;
        </button>

        <button
          className={`${styles.arrow} ${styles.next}`}
          type="button"
          onClick={nextImage}
          aria-label="Next image"
        >
          &#10095;
        </button>

        <div className={styles.caption}>
          {activeImage.title}
        </div>
      </div>

      <div className={styles.dots}>
        {images.map((image, index) => (
          <button
            key={image.id}
            className={`${styles.dot} ${
              index === activeIndex ? styles.activeDot : ""
            }`}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Show image ${index + 1}`}
            aria-pressed={index === activeIndex}
          />
        ))}
      </div>

      {isFullscreen && (
        <div
          className={styles.lightbox}
          onClick={() => setIsFullscreen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Fullscreen nature gallery"
        >
          <button
            className={styles.closeButton}
            type="button"
            onClick={() => setIsFullscreen(false)}
            aria-label="Close fullscreen"
          >
            &times;
          </button>

          <button
            className={`${styles.arrow} ${styles.modalPrevious}`}
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              previousImage();
            }}
            aria-label="Previous image"
          >
            &#10094;
          </button>

          <img
            className={styles.fullscreenImage}
            src={activeImage.src}
            alt={activeImage.alt}
            onClick={(event) => event.stopPropagation()}
          />

          <button
            className={`${styles.arrow} ${styles.modalNext}`}
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              nextImage();
            }}
            aria-label="Next image"
          >
            &#10095;
          </button>

          <div
            className={styles.fullscreenFooter}
            onClick={(event) => event.stopPropagation()}
          >
            <p className={styles.fullscreenTitle}>
              {activeImage.title}
            </p>

            <div className={styles.dots}>
              {images.map((image, index) => (
                <button
                  key={image.id}
                  className={`${styles.dot} ${
                    index === activeIndex ? styles.activeDot : ""
                  }`}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Show image ${index + 1}`}
                  aria-pressed={index === activeIndex}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default NatureGallery;
