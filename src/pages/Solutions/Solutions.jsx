import { Link } from 'react-router-dom';
import { 
  Car, HeartPulse, Zap, Cpu, ShoppingBag, Factory, ShieldCheck,
  ArrowRight, CheckCircle2, Award, Compass, Truck, Ship, Plane, Train, Boxes, Lock, Layers
} from 'lucide-react';
import { industries } from '../../data/industries';
import SEO from '../../components/Common/SEO';
import PageHeader from '../../components/Common/PageHeader';
import './Solutions.css';

const iconMap = { Car, HeartPulse, Zap, Cpu, ShoppingBag, Factory, ShieldCheck };

export const Solutions = () => {
  return (
    <div className="solutions-page">
      <SEO 
        title="Industry Freight & Supply Chain Solutions — GACIS Intelligence"
        description="Engineered shipping and logistics solutions for Automotive, Pharmaceuticals, Electronics & Air Cargo, Oil & Energy, Maritime & Retail, Manufacturing, and Hazmat & Chemicals."
        canonical="/solutions"
      />

      {/* Hero Header */}
      <PageHeader 
        eyebrow="VERTICAL INDUSTRY FREIGHT INTEGRATION"
        title="Industry Shipping & Supply Chain Solutions"
        description="Customized multimodal shipping architecture engineered to overcome sector-specific compliance, temperature, security, and velocity constraints for global enterprises."
        statusTag="7 DEDICATED SECTOR DESKS ACTIVE"
        videoSrc="/images/video/solution%20page%20video.mp4"
      />

      {/* Main Section */}
      <section className="section-padding bg-primary">
        <div className="container">
          
          <div className="section-heading">
            <span className="eyebrow text-gold">SECTOR-SPECIFIC FREIGHT ARCHITECTURE</span>
            <h2>Connected Shipping Solutions for Global Enterprises</h2>
            <p>
              Each industry vertical is directly integrated into GACIS ocean strings, air charters, block train networks, customs portals, and specialized freight equipment.
            </p>
          </div>

          {/* Industries Matrix Grid */}
          <div className="industries-matrix-grid">
            {industries.map((ind) => {
              const Icon = iconMap[ind.icon] || Factory;

              return (
                <div className="industry-solution-card fade-up" key={ind.id}>
                  
                  {/* Header Row */}
                  <div className="isc-header">
                    <div className="isc-icon-wrap">
                      <Icon size={24} />
                      <span className="isc-id-tag">{ind.id.toUpperCase()} DESK</span>
                    </div>
                    <span className="isc-sla-badge" title="Logistics SLA">{ind.logisticsSLA}</span>
                  </div>

                  {ind.image && (
                    <div className="isc-image-wrap">
                      <img
                        src={ind.image}
                        alt={`${ind.title} logistics operations`}
                        className="isc-image"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  )}

                  <h3 className="isc-title">{ind.title}</h3>
                  <p className="isc-tagline">{ind.tagline}</p>

                  {/* Connected Services Links */}
                  <div className="isc-connected-services-block">
                    <span className="isc-block-lbl">CONNECTED SHIPPING & FREIGHT SERVICES:</span>
                    <div className="isc-service-links-row">
                      {ind.connectedServices.map((srv) => (
                        <Link key={srv.id} to={`/services/${srv.id}`} className="isc-service-chip">
                          <span className="isc-mode-prefix">[{srv.mode}]</span> {srv.name}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Primary Trade Corridors */}
                  <div className="isc-corridors-block">
                    <span className="isc-block-lbl">PRIMARY INTEGRATED TRADE CORRIDORS:</span>
                    <div className="isc-corridors-list">
                      {ind.connectedCorridors.map((c, cIdx) => (
                        <span className="isc-corridor-tag" key={cIdx}>
                          <Compass size={12} className="corridor-icon" /> {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Challenge & Solution Grid */}
                  <div className="isc-cs-grid">
                    <div className="isc-challenge-box">
                      <span className="isc-box-lbl text-red">LOGISTICS CHALLENGE:</span>
                      <p>{ind.challenge}</p>
                    </div>

                    <div className="isc-solution-box">
                      <span className="isc-box-lbl text-gold">GACIS SHIPPING SOLUTION:</span>
                      <p>{ind.solution}</p>
                    </div>
                  </div>

                  {/* Shipping Equipment & Customs Integration */}
                  <div className="isc-specs-bar">
                    <div className="isc-spec-col">
                      <span className="isc-spec-lbl">FREIGHT EQUIPMENT:</span>
                      <div className="isc-equip-list">
                        {ind.shippingEquipment.map((eq, eqIdx) => (
                          <span className="isc-equip-chip" key={eqIdx}>{eq}</span>
                        ))}
                      </div>
                    </div>

                    <div className="isc-spec-col">
                      <span className="isc-spec-lbl">CUSTOMS & COMPLIANCE:</span>
                      <span className="isc-customs-val">{ind.customsIntegration}</span>
                    </div>
                  </div>

                  {/* Key Operational Highlights */}
                  <div className="isc-highlights-strip">
                    {ind.highlights.map((h, i) => (
                      <span className="isc-highlight-chip" key={i}>
                        <CheckCircle2 size={13} className="check-icon-gold" /> {h}
                      </span>
                    ))}
                  </div>

                  {/* Card Footer with Direct Lead-Gen Quote Button */}
                  <div className="isc-footer">
                    <div className="isc-stat-pill">
                      <span className="isp-lbl">Verified Metric</span>
                      <span className="isp-val tabular-nums">{ind.metrics.onTime || ind.metrics.tempIntegrity || ind.metrics.maxPayload || ind.metrics.securityRating || ind.metrics.complianceScore}</span>
                    </div>

                    <div className="isc-actions">
                      <Link 
                        to={`/quote?cargoType=${encodeURIComponent(ind.title)}`}
                        state={{ cargoType: ind.title }}
                        className="btn btn-primary btn-sm isc-btn-book"
                      >
                        Book {ind.title.split(' ')[0]} Linehaul <ArrowRight size={14} className="arrow-icon" />
                      </Link>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Direct Advisory Banner */}
      <section className="section-padding-sm bg-dark">
        <div className="container">
          <div className="industry-cta-inner fade-up">
            <div>
              <h3 style={{ color: '#fff' }}>Require bespoke shipping & trade lane engineering?</h3>
              <p style={{ color: 'rgba(255,255,255,0.78)', margin: 0 }}>
                Our sector specialization desks work directly with enterprise supply chain directors to engineer custom Service Level Agreements (SLAs), dedicated charter lines, and bonded customs clearance.
              </p>
            </div>
            <Link to="/contact" className="btn btn-primary btn-large">
              Speak with Sector Lead <ArrowRight size={16} className="arrow-icon" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Solutions;
