import { useEffect, useState } from "react";

function getImageSrc(image) {
  return image?.src?.src ?? image?.src;
}

function ModalImg({ image, onClose }) {
  if (!image) return null;

  return (
    <div id="myModal" className="modal" role="dialog" aria-modal="true" aria-label="Expanded photo">
      <button className="close" type="button" aria-label="Close expanded photo" onClick={onClose}>
        &times;
      </button>
      <img className="modal-content" src={getImageSrc(image)} id="img01" alt={image.alt} />
      <div id="caption">{image.alt}</div>
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
    <>
      <div className="el-carousel el-carousel--horizontal banner" aria-label="Photo carousel">
        <div className="el-carousel__container">
          {photos.map((item, index) => {
            const total = photos.length;
            const prevIndex = (activeIndex - 1 + total) % total;
            const nextIndex = (activeIndex + 1) % total;
            let stageClass = "is-hidden";
            let transform = "translateX(50%) scale(0.83)";

            if (index === activeIndex) {
              stageClass = "is-active";
              transform = "translateX(50%) scale(1)";
            } else if (index === prevIndex) {
              stageClass = "is-in-stage is-left";
              transform = "translateX(0) scale(0.83)";
            } else if (index === nextIndex) {
              stageClass = "is-in-stage is-right";
              transform = "translateX(100%) scale(0.83)";
            }

            return (
              <button
                className={`el-carousel__item el-carousel__item--card is-animating ${stageClass}`}
                key={item.id}
                type="button"
                aria-label={`Open photo ${index + 1}`}
                style={{ transform }}
                onClick={() => openImage(item)}
              >
                <img
                  className="myImg"
                  src={getImageSrc(item)}
                  alt={item.alt}
                  decoding="async"
                  fetchPriority={index === activeIndex ? "high" : "auto"}
                  loading={index === activeIndex ? "eager" : "lazy"}
                />
                {index !== activeIndex && <span className="el-carousel__mask" aria-hidden="true" />}
              </button>
            );
          })}
          <button className="el-carousel__arrow el-carousel__arrow--left" type="button" aria-label="Previous photo" onClick={previous}>
            &lsaquo;
          </button>
          <button className="el-carousel__arrow el-carousel__arrow--right" type="button" aria-label="Next photo" onClick={next}>
            &rsaquo;
          </button>
          <ul className="el-carousel__indicators el-carousel__indicators--horizontal" aria-label="Choose photo">
            {photos.map((item, index) => (
              <li
                className={`el-carousel__indicator el-carousel__indicator--horizontal ${index === activeIndex ? "is-active" : ""}`}
                key={item.id}
              >
                <button
                  className="el-carousel__button"
                  type="button"
                  aria-label={`Go to slide ${index + 1}`}
                  onClick={() => setActiveIndex(index)}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <ModalImg image={modalImage} onClose={closeImage} />
    </>
  );
}
