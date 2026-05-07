import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { gameList, photoList } from './data';

const navItems = [
  { label: 'Home', path: '/home' },
  { label: 'Photos', path: '/photo' },
  { label: 'Games', path: '/games' },
];

const homeContents = [
  "<span class='underline'>He</span>llo.",
  '<br/><br/>',
  "I'm a <span class='underline'>dev</span>eloper from New York.",
  '<br/>',
  "I like <span class='underline'>g</span>ames, <span class='underline'>g</span>uitar, <span class='underline'>tra</span>vel and <span class='underline'>photo</span>graph.",
];

function normalizeHash() {
  const hash = window.location.hash.replace(/^#/, '');
  return hash === '/' || hash === '' ? '/home' : hash;
}

function useHashRoute() {
  const [path, setPath] = useState(normalizeHash);

  useEffect(() => {
    const onHashChange = () => setPath(normalizeHash());
    window.addEventListener('hashchange', onHashChange);

    if (window.location.hash === '' || window.location.hash === '#/') {
      window.location.hash = '#/home';
    }

    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return path;
}

function Header({ currentPath }) {
  return (
    <header className="el-header w clearfix">
      <div className="my-name">
        <h1>
          <a className="name" href="#/">
            Xinkai Lin
          </a>
        </h1>
      </div>
      <div className="my-link">
        <ul>
          {navItems.map((item) => (
            <li key={item.path}>
              <a
                className={`link-color ${
                  currentPath === item.path ? 'active-router' : ''
                }`}
                href={`#${item.path}`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="el-footer w">
      <div className="links">
        <ul>
          <li>
            <a
              href="https://www.linkedin.com/in/xinkailin/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          </li>
          <li>
            <a
              href="https://www.instagram.com/xinkai00007/"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
          </li>
          <li className="lastLi">
            <a href="mailto: xinkailin1995@gmail.com"> Email</a>
          </li>
        </ul>
      </div>
      <div className="copy-right">
        &copy; Xinkai Lin. All Rights Reserved {new Date().getFullYear()}
      </div>
    </footer>
  );
}

const TypeWriter = forwardRef(function TypeWriter({ contents, className }, ref) {
  const [index, setIndex] = useState(0);
  const [words, setWords] = useState('');
  const [blink, setBlink] = useState(true);
  const timerRef = useRef(null);
  const content = useMemo(
    () => contents.reduce((prev, curr) => `${prev} ${curr}`, ''),
    [contents]
  );

  useImperativeHandle(ref, () => ({
    showAll() {
      clearTimeout(timerRef.current);
      setWords(content);
      setIndex(content.length + 1);
    },
  }));

  useEffect(() => {
    const blinkTimer = setInterval(() => {
      setBlink((value) => !value);
    }, 500);

    return () => clearInterval(blinkTimer);
  }, []);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setIndex(1);
    }, 2400);

    return () => clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    if (index === 0 || index > content.length) return;

    let nextIndex = index;
    if (content.slice(nextIndex, nextIndex + 1) === '<') {
      const close = content.slice(nextIndex).indexOf('>');
      nextIndex += close;
    }

    setWords(content.slice(0, nextIndex));
    timerRef.current = setTimeout(() => {
      setIndex(nextIndex + 1);
    }, 100);

    return () => clearTimeout(timerRef.current);
  }, [content, index]);

  return (
    <div className={`font ${className || ''}`}>
      <span dangerouslySetInnerHTML={{ __html: words }} />
      {blink && <span>|</span>}
    </div>
  );
});

function Home() {
  const typeWriterRef = useRef(null);

  return (
    <div className="home" onDoubleClick={() => typeWriterRef.current?.showAll()}>
      <TypeWriter className="info" ref={typeWriterRef} contents={homeContents} />
    </div>
  );
}

function PhotoCarousel({ isPlaying, onImageClick }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!isPlaying) return undefined;

    const timer = setInterval(() => {
      setActiveIndex((index) => (index + 1) % photoList.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [isPlaying]);

  const previous = () => {
    setActiveIndex((index) => (index - 1 + photoList.length) % photoList.length);
  };

  const next = () => {
    setActiveIndex((index) => (index + 1) % photoList.length);
  };

  return (
    <div className="el-carousel el-carousel--horizontal banner">
      <div className="el-carousel__container">
        {photoList.map((item, index) => {
          const total = photoList.length;
          const prevIndex = (activeIndex - 1 + total) % total;
          const nextIndex = (activeIndex + 1) % total;
          let stageClass = 'is-hidden';
          let transform = 'translateX(240px) scale(0.83)';

          if (index === activeIndex) {
            stageClass = 'is-active';
            transform = 'translateX(240px) scale(1)';
          } else if (index === prevIndex) {
            stageClass = 'is-in-stage is-left';
            transform = 'translateX(0) scale(0.83)';
          } else if (index === nextIndex) {
            stageClass = 'is-in-stage is-right';
            transform = 'translateX(480px) scale(0.83)';
          }

          return (
            <div
              className={`el-carousel__item el-carousel__item--card is-animating ${stageClass}`}
              key={item.id}
              style={{ transform }}
            >
              <img
                className="myImg"
                src={item.src}
                alt={item.alt}
                style={{ height: '400px', width: '100%' }}
                onClick={() => onImageClick(item)}
              />
              {index !== activeIndex && <div className="el-carousel__mask" />}
            </div>
          );
        })}
        <button
          className="el-carousel__arrow el-carousel__arrow--left"
          type="button"
          aria-label="Previous"
          onClick={previous}
        >
          &lsaquo;
        </button>
        <button
          className="el-carousel__arrow el-carousel__arrow--right"
          type="button"
          aria-label="Next"
          onClick={next}
        >
          &rsaquo;
        </button>
        <ul className="el-carousel__indicators el-carousel__indicators--horizontal">
          {photoList.map((item, index) => (
            <li
              className={`el-carousel__indicator el-carousel__indicator--horizontal ${
                index === activeIndex ? 'is-active' : ''
              }`}
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
  );
}

function ModalImg({ image, onClose }) {
  if (!image) return null;

  return (
    <div id="myModal" className="modal">
      <span className="close" onClick={onClose}>
        &times;
      </span>
      <img className="modal-content" src={image.src} id="img01" alt={image.alt} />
      <div id="caption" dangerouslySetInnerHTML={{ __html: image.alt }} />
    </div>
  );
}

function Photo() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    setIsPlaying(true);
  }, []);

  const openImage = (item) => {
    setIsPlaying(false);
    setModalImage(item);
  };

  const closeImage = () => {
    setModalImage(null);
    setIsPlaying(true);
  };

  return (
    <div className="photo">
      <PhotoCarousel isPlaying={isPlaying} onImageClick={openImage} />
      <ModalImg image={modalImage} onClose={closeImage} />
    </div>
  );
}

function Games() {
  return (
    <div className="games">
      {gameList.map((item) => (
        <ul className="content" key={item.id}>
          <li>
            <div className="img">
              <a href={item.link} target="_blank" rel="noreferrer">
                <img src={item.src} alt={item.alt} />
              </a>
            </div>
            <div className="info">
              <a href={item.link} target="_blank" rel="noreferrer">
                <div className="desc">{item.title}</div>
              </a>
            </div>
          </li>
        </ul>
      ))}
    </div>
  );
}

function Main({ currentPath }) {
  let page = <Home />;

  if (currentPath === '/photo') {
    page = <Photo />;
  } else if (currentPath === '/games') {
    page = <Games />;
  }

  return <main className="el-main w">{page}</main>;
}

function ParticlesBackground() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const resize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      particlesRef.current = Array.from({ length: 100 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 1 + Math.random() * 3,
        alpha: 0.2 + Math.random() * 0.7,
        vx: (Math.random() * 0.3 + 0.3) * (Math.random() > 0.5 ? 1 : -1),
        vy: (Math.random() * 0.3 + 0.3) * (Math.random() > 0.5 ? 1 : -1),
      }));
    };

    const render = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(51, 51, 51, ${particle.alpha})`;
        context.fill();

        for (let nextIndex = index + 1; nextIndex < particlesRef.current.length; nextIndex += 1) {
          const nextParticle = particlesRef.current[nextIndex];
          const distance = Math.hypot(
            particle.x - nextParticle.x,
            particle.y - nextParticle.y
          );

          if (distance < 140) {
            const alpha = (1 - distance / 140) * 0.5;
            context.strokeStyle = `rgba(3, 3, 3, ${alpha})`;
            context.beginPath();
            context.moveTo(particle.x, particle.y);
            context.lineTo(nextParticle.x, nextParticle.y);
            context.stroke();
          }
        }
      });

      animationRef.current = requestAnimationFrame(render);
    };

    resize();
    render();
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="canvas particles-canvas"
      style={{ backgroundColor: '#fff' }}
    />
  );
}

export default function App() {
  const currentPath = useHashRoute();

  return (
    <div className="index">
      <Header currentPath={currentPath} />
      <Main currentPath={currentPath} />
      <Footer />
      <ParticlesBackground />
    </div>
  );
}
