import { Link } from 'react-router-dom';
import { Plane, Ship, Truck, Train, ShieldCheck, Boxes, ArrowRight } from 'lucide-react';
import { serviceCatalog as services } from '../../data/serviceCatalog';
import FadeImage from '../Common/FadeImage';
import './ServiceStrip.css';

const iconMap = { Plane, Ship, Truck, Train, ShieldCheck, Boxes };

export const ServiceStrip = () => {
  return (
    <section className="service-strip-section section-padding bg-primary">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-heading fade-up">
          <span className="eyebrow">CORE FREIGHT CAPABILITIES</span>
          <h2>Multimodal Logistics Architecture</h2>
          <p>
            Engineered linehaulage networks connecting deepsea ports, trans-Eurasian railheads, scheduled air cargo gateways, and overland bonded corridors.
          </p>
        </div>

        {/* 6-Card Responsive Grid */}
        <div className="service-cards-grid">
          {services.map((svc, idx) => {
            const Icon = iconMap[svc.icon] || Boxes;
            return (
              <div className={`service-feature-card fade-up delay-${Math.min((idx % 3) * 100 + 100, 300)}`} key={svc.id}>
                {svc.image && (
                  <div className="sfc-preview-img-wrapper">
                    <FadeImage src={svc.image} alt={svc.shortTitle} className="sfc-preview-img" />
                    <span className="sfc-preview-mode-tag">{svc.mode}</span>
                  </div>
                )}
                <div className="sfc-card-body">
                  <div className="sfc-top-row">
                    <div className="sfc-icon-wrapper">
                      <Icon size={20} />
                    </div>
                    <span className="sfc-mode-tag">{svc.mode}</span>
                  </div>

                  <h3 className="sfc-title">{svc.shortTitle}</h3>
                  <p className="sfc-tagline">{svc.tagline}</p>

                  <div className="sfc-meta-list">
                    <div className="sfc-meta-item">
                      <span className="smi-label">Transit Benchmark:</span>
                      <span className="smi-val tabular-nums">{svc.leadTime}</span>
                    </div>
                    <div className="sfc-meta-item">
                      <span className="smi-label">Network Reach:</span>
                      <span className="smi-val">{svc.coverage}</span>
                    </div>
                  </div>

                  <Link to={`/services/${svc.id}`} className="sfc-link-action">
                    <span>Explore Capabilities</span>
                    <ArrowRight size={15} className="arrow-icon" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="service-strip-cta-banner fade-up">
          <div className="ssc-text">
            <h4>Need a specialized combination of Air, Sea, and Road?</h4>
            <p>Our trade lane engineers design bespoke hybrid corridors tailored to your inventory holding velocity.</p>
          </div>
          <Link to="/quote" className="btn btn-primary">
            Request Multimodal Route <ArrowRight size={15} />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default ServiceStrip;
