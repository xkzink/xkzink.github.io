import { useEffect, useState } from "react";

function getImageSrc(image) {
  return image?.src?.src ?? image?.src;
}

function ModalImg({ image, onClose }) {
  if (!image) return null;

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label="Expanded photo">
      <button className="close" type="button" aria-label="Close expanded photo" onClick={onClose}>
        &times;
      </button>
      <img className="modal-content" src={getImageSrc(image)} alt={image.alt} />
      {image.alt && <div id="caption">{image.alt}</div>}
    </div>
  );
}

export default function PhotoCarouselIsland({ photos }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    if (!isPlaying || photos.length === 0) return undefined;

    const timer = setInterval(() => {
      setActiveIndex((index) => (index + 1) % photos.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [isPlaying, photos.length]);

  if (photos.length === 0) return null;

  const openImage = (item) => {
    setIsPlaying(false);
    setModalImage(item);
  };

  const closeImage = () => {
    setModalImage(null);
    setIsPlaying(true);
  };

  const previous = () => setActiveIndex((index) => (index - 1 + photos.length) % photos.length);
  const next = () => setActiveIndex((index) => (index + 1) % photos.length);

  return (
    <section className="photo-gallery" aria-label="Photo carousel">
      <div className="carousel-frame">
        {photos.map((item, index) => {
          const total = photos.length;
          const prevIndex = (activeIndex - 1 + total) % total;
          const nextIndex = (activeIndex + 1) % total;
          let stageClass = "is-hidden";

          if (index === activeIndex) {
            stageClass = "is-active";
          } else if (index === prevIndex) {
            stageClass = "is-in-stage is-left";
          } else if (index === nextIndex) {
            stageClass = "is-in-stage is-right";
          }

          return (
            <button
              className={`carousel-item ${stageClass}`}
              key={item.id}
              type="button"
              aria-label={`Open photo ${index + 1}`}
              onClick={() => openImage(item)}
            >
              <img
                src={getImageSrc(item)}
                alt={item.alt}
                decoding="async"
                loading={index === activeIndex ? "eager" : "lazy"}
              />
              {index !== activeIndex && <span className="carousel-mask" aria-hidden="true" />}
            </button>
          );
        })}

        <button className="carousel-arrow carousel-arrow-left" type="button" aria-label="Previous photo" onClick={previous}>
          &lsaquo;
        </button>
        <button className="carousel-arrow carousel-arrow-right" type="button" aria-label="Next photo" onClick={next}>
          &rsaquo;
        </button>
      </div>

      <div className="carousel-indicators" aria-label="Choose photo">
        {photos.map((item, index) => (
          <button
            className={`carousel-dot ${index === activeIndex ? "is-active" : ""}`}
            key={item.id}
            type="button"
            aria-label={`Go to photo ${index + 1}`}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>

      <ModalImg image={modalImage} onClose={closeImage} />
    </section>
  );
}
