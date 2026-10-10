import { lazy, Suspense, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock3, Globe2 } from 'lucide-react';
import LazyVideo from '../../components/Common/LazyVideo';
import './Hero.css';

const HeroNetworkAnimation = lazy(() => import('./HeroNetworkAnimation'));

const timeZones = [
  { label: 'India', zone: 'Asia/Kolkata' },
  { label: 'Sri Lanka', zone: 'Asia/Colombo' },
  { label: 'Malaysia', zone: 'Asia/Kuala_Lumpur' },
  { label: 'UAE', zone: 'Asia/Dubai' },
  { label: 'Russia', zone: 'Europe/Moscow' },
  { label: 'China', zone: 'Asia/Shanghai' },
  { label: 'USA', zone: 'America/New_York' },
  { label: 'Brazil', zone: 'America/Sao_Paulo' },
  { label: 'Africa', zone: 'Africa/Johannesburg' },
  { label: 'Europe', zone: 'Europe/London' },
];

const formatTime = (zone) => new Intl.DateTimeFormat('en-US', {
  timeZone: zone,
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
}).format(new Date());

export const Hero = ({ videoSrc, videoPoster }) => {
  const [times, setTimes] = useState({});

  useEffect(() => {
    const updateTimes = () => {
      setTimes(Object.fromEntries(
        timeZones.map(({ label, zone }) => [label, formatTime(zone)]),
      ));
    };

    updateTimes();
    const interval = window.setInterval(updateTimes, 30000);
    return () => window.clearInterval(interval);
  }, []);

  const scrollToSimulator = (event) => {
    event.preventDefault();
    const element = document.getElementById('route-simulator');
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="hero-editorial">
      <div className="hero-backdrop-wrapper">
        {videoSrc ? (
          <>
            <LazyVideo
              src={videoSrc}
              poster={videoPoster}
              className="hero-backdrop-video"
              autoPlay
              loop
              muted
              playsInline
            />
            <div className="hero-backdrop-video-overlay" />
          </>
        ) : (
          <>
            <img
              src="/images/hero_bg.webp"
              alt="GACIS Global Freight Corridors"
              className="hero-backdrop-img"
              width={1920}
              height={1080}
              fetchPriority="high"
              decoding="async"
            />
            <div className="hero-backdrop-overlay" />
          </>
        )}
      </div>

      <div className="container hero-container">
        <div className="hero-grid">
          <div className="hero-content reveal-left">
            <div className="hero-brand" aria-label="GACIS Cargo Services">
              <div className="hero-brand-mark">
                <img src="/images/logo.webp" alt="" className="hero-brand-logo" />
              </div>
              <div className="hero-brand-name">
                <span className="hero-brand-gacis">GACIS</span>
                <span className="hero-brand-services">Cargo Services</span>
              </div>
            </div>

            <div className="hero-route-heading">
              <span className="hero-eyebrow">Strategic Freight Corridors</span>
              <span className="hero-corridor-tag">Far East ↔ Asia ↔ Central Asia ↔ Europe ↔ Africa ↔ North America ↔ South America</span>
            </div>

            <h1 className="hero-headline">
              Intelligent movement.<br />
              <span className="text-gradient-red">Absolute precision.</span>
            </h1>

            <p className="hero-subtext">
              Powering high-value supply chains across the Gulf, Central Asia, and South Asian corridors with multimodal block trains, sea-air routing, and live corridor tracking.
            </p>

            <div className="hero-actions">
              <a href="#route-simulator" onClick={scrollToSimulator} className="btn btn-primary btn-large">
                <span>Design a Route</span>
                <ArrowRight size={17} className="arrow-icon" />
              </a>
              <Link to="/global-network" className="btn btn-outline-white btn-large">
                <Globe2 size={17} />
                <span>Explore Network</span>
              </Link>
            </div>

            <div className="hero-corridors-list">
              <div className="corridor-group">
                <span className="cg-title text-export">Export:</span>
                <ul className="cg-list">
                  <li>Indian Subcontinent – Far East Asia – Middle East</li>
                  <li>Middle East – East &amp; South Africa – South &amp; North America</li>
                  <li>Africa – Indian Subcontinent – Far East Asia</li>
                  <li>Indian Subcontinent – South &amp; North America – European Union</li>
                </ul>
              </div>
              <div className="corridor-group">
                <span className="cg-title text-import">Import:</span>
                <ul className="cg-list">
                  <li>Southeast Asia &amp; Far East Asia – Indian Subcontinent</li>
                  <li>European Union – Indian Subcontinent – Southeast Asia &amp; Far East Asia</li>
                  <li>South &amp; North America – Indian Subcontinent</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="hero-visual-column reveal-right delay-200">
            <div className="hero-world-time" aria-label="Current regional times">
              <div className="hero-time-title">
                <Clock3 size={16} />
                <strong>GLOBAL 24×7 OPERATIONS</strong>
              </div>
              <div className="hero-time-zones">
                {timeZones.map(({ label }) => (
                  <div className="hero-time-zone" key={label}>
                    <span>{label}</span>
                    <strong>{times[label] || '--:--'}</strong>
                  </div>
                ))}
              </div>
            </div>
            <Suspense fallback={<div className="hero-console-skeleton" aria-hidden="true" />}>
              <HeroNetworkAnimation />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
