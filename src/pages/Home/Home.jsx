import { lazy, Suspense } from 'react';
import Hero from '../../components/Home/Hero';
import NewsTickerBar from '../../components/Home/NewsTickerBar';
import ServiceStrip from '../../components/Home/ServiceStrip';
import TrustStats from '../../components/Home/TrustStats';
import Differentiators from '../../components/Home/Differentiators';
import ProcessSection from '../../components/Home/ProcessSection';
import ErrorBoundary from '../../components/Common/ErrorBoundary';
import LazyOnVisible from '../../components/Common/LazyOnVisible';
import SEO from '../../components/Common/SEO';
import './Home.css';

const IndustrySection = lazy(() => import('../../components/Home/IndustrySection'));
const SocialProof = lazy(() => import('../../components/Home/SocialProof'));
const Testimonials = lazy(() => import('../../components/Home/Testimonials'));
const CompanyCards = lazy(() => import('../../components/Home/CompanyCards'));
const CtaBanner = lazy(() => import('../../components/Home/CtaBanner'));

const Home = () => {
  return (
    <div className="home-page">
      <SEO
        title="Global Freight Forwarding & Multimodal Logistics Intelligence"
        description="GACIS powers high-value trade corridors across the Gulf, Central Asia (CIS), South Asia, and Europe with multimodal block trains, sea-air routing, and real-time corridor intelligence."
        canonical="/"
      />
      <Hero />
      <NewsTickerBar />
      <ServiceStrip />
      <TrustStats />
      <Differentiators />
      <ProcessSection />
      <LazyOnVisible minHeight={420}>
        <Suspense fallback={null}>
          <IndustrySection />
          <SocialProof />
          <Testimonials />
          <CompanyCards />
          <CtaBanner />
        </Suspense>
      </LazyOnVisible>
    </div>
  );
};

export default Home;
