import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Leaf, Globe2, MapPin, Phone, Mail, User, Globe, ExternalLink } from 'lucide-react';
import { officialOffices, headOffice, globalOffices } from '../../data/offices';
import './Footer.css';

export const Footer = () => {
  return (
    <footer className="site-footer bg-dark">
      <div className="container">
        
        {/* Footer Top Strip: Statement & Fast Action */}
        <div className="footer-top-strip">
          <div className="footer-brand-col">
            <Link to="/" className="footer-brand-logo" aria-label="GACIS Home">
              <div className="footer-brand-logo-wrap">
                <img src="/images/logo.webp" alt="GACIS Global Logistics" className="footer-logo-img" />
                <span className="footer-brand-name">GACIS</span>
              </div>
            </Link>
            <p className="footer-tagline">
              Moving what matters. Across borders with absolute precision.
            </p>
            <div className="footer-badges">
              <span className="footer-badge"><Globe2 size={13} /> 150+ Direct Gateways</span>
              <Link to="/about" className="footer-badge"><ShieldCheck size={13} /> Partner-Certified Network</Link>
              <span className="footer-badge"><Leaf size={13} /> Scope 3 Monitored</span>
            </div>
          </div>

          <div className="footer-quick-action-box">
            <div className="fqa-content">
              <span className="fqa-eyebrow">Direct Desk Access</span>
              <h4>Need an engineered freight calculation?</h4>
              <p>Our multimodal trade lane specialists respond with customized routing and rates within 24 hours.</p>
            </div>
            <div className="fqa-buttons">
              <Link to="/quote" className="btn btn-primary btn-sm">
                Request Route Quote <ArrowRight size={14} />
              </Link>
              <Link to="/contact" className="btn btn-dark btn-sm">
                <Globe2 size={14} /> Global Inquiries
              </Link>
            </div>
          </div>
        </div>

        {/* ── Official Offices Contact Section ── */}
        <div className="footer-offices-section">
          <div className="fos-header">
            <div className="fos-title-group">
              <span className="fqa-eyebrow">GLOBAL OFFICE DIRECTORY</span>
              <h4>Official Office Locations &amp; Direct Desks</h4>
            </div>
            <Link to="/contact" className="fos-directory-link">
              <span>View Full Interactive Map &amp; Routing</span> <ArrowRight size={13} />
            </Link>
          </div>

          <div className="footer-offices-grid">
            {/* Chennai Head Office Card */}
            {headOffice && (
              <div className="footer-office-card foc-head-office">
                <div className="foc-badge-row">
                  <span className="foc-badge foc-head-badge">HEAD OFFICE</span>
                  <span className="foc-flag" aria-hidden="true">{headOffice.flag}</span>
                </div>
                <h5 className="foc-city">{headOffice.city}, {headOffice.country}</h5>
                <strong className="foc-entity">{headOffice.name}</strong>

                <div className="foc-info-list">
                  <div className="foc-info-item">
                    <MapPin size={13} className="foc-icon" aria-hidden="true" />
                    <span className="foc-text">{headOffice.fullAddress}</span>
                  </div>

                  <div className="foc-info-item">
                    <Phone size={13} className="foc-icon" aria-hidden="true" />
                    <div className="foc-phone-stack">
                      {headOffice.phones.map((p, i) => (
                        <span key={i}>
                          <small>{p.label}:</small>{' '}
                          <a href={`tel:${p.tel}`} className="foc-link">
                            {p.number}
                          </a>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="foc-info-item">
                    <User size={13} className="foc-icon" aria-hidden="true" />
                    <span className="foc-text">
                      <small>Contact:</small> {headOffice.contacts[0].name}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Global Offices Cards */}
            {globalOffices.map((office) => (
              <div className="footer-office-card" key={office.id}>
                <div className="foc-badge-row">
                  <span className="foc-badge">GLOBAL OFFICE</span>
                  <span className="foc-flag" aria-hidden="true">{office.flag}</span>
                </div>
                <h5 className="foc-city">{office.city}, {office.country}</h5>
                <strong className="foc-entity">{office.name}</strong>

                <div className="foc-info-list">
                  <div className="foc-info-item">
                    <MapPin size={13} className="foc-icon" aria-hidden="true" />
                    <span className="foc-text">{office.fullAddress}</span>
                  </div>

                  {office.phones.length > 0 && (
                    <div className="foc-info-item">
                      <Phone size={13} className="foc-icon" aria-hidden="true" />
                      <div className="foc-phone-stack">
                        {office.phones.map((p, i) => (
                          <span key={i}>
                            <small>{p.label}:</small>{' '}
                            <a href={`tel:${p.tel}`} className="foc-link">
                              {p.number}
                            </a>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {office.contacts && office.contacts.length > 0 && (
                    <div className="foc-info-item">
                      <User size={13} className="foc-icon" aria-hidden="true" />
                      <div className="foc-contacts-stack">
                        {office.contacts.map((c, i) => (
                          <div key={i} className="foc-contact-person">
                            <span className="foc-contact-name">{c.name}</span>
                            {c.mobile && (
                              <a href={`tel:${c.tel}`} className="foc-link foc-sub-link">
                                {c.mobile}
                              </a>
                            )}
                            {c.email && (
                              <a href={`mailto:${c.email}`} className="foc-link foc-sub-link foc-email">
                                {c.email}
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {office.website && (
                    <div className="foc-info-item">
                      <Globe size={13} className="foc-icon" aria-hidden="true" />
                      <a 
                        href={office.website} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="foc-link foc-web-link"
                      >
                        gaciscargoservices.com <ExternalLink size={10} />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Columns */}
        <div className="footer-links-grid">
          <div className="footer-col">
            <h5>Multimodal Services</h5>
            <Link to="/services/air-freight">Air Freight Intelligence</Link>
            <Link to="/services/fcl-freight">Ocean Freight &amp; Seaways</Link>
            <Link to="/services/road-freight">Cross-Border Road Transport</Link>
            <Link to="/services/rail-corridors">Intermodal Rail Corridors</Link>
            <Link to="/services/customs-compliance">Customs &amp; Compliance</Link>
            <Link to="/services/project-logistics">Project Cargo &amp; Heavy Lift</Link>
          </div>

          <div className="footer-col">
            <h5>Industry Solutions</h5>
            <Link to="/solutions">Automotive</Link>
            <Link to="/solutions">Pharmaceuticals</Link>
            <Link to="/solutions">Oil &amp; Energy</Link>
            <Link to="/solutions">Electronics &amp; Air Cargo</Link>
            <Link to="/solutions">Maritime &amp; Retail</Link>
            <Link to="/solutions">Manufacturing</Link>
            <Link to="/solutions">Hazmat &amp; Chemicals</Link>
          </div>

          <div className="footer-col">
            <h5>Global Network &amp; Corridors</h5>
            <Link to="/global-network">Chennai Corporate Headquarters</Link>
            <Link to="/global-network">Dubai Regional Hub</Link>
            <Link to="/global-network">Port Klang ASEAN Hub</Link>
            <Link to="/global-network">Colombo Indian Ocean Gateway</Link>
            <Link to="/global-network">Mumbai Western Gateway</Link>
            <Link to="/global-network">Frankfurt European Gateway</Link>
          </div>

          <div className="footer-col">
            <h5>Corporate &amp; Standards</h5>
            <Link to="/about">About GACIS Story</Link>
            <Link to="/sustainability">Sustainability &amp; ESG Mandate</Link>
            <Link to="/resources">Logistics Knowledge Hub</Link>
            <Link to="/contact">Commercial Contacts &amp; Offices</Link>
            <Link to="/quote">Corridor Rate Estimator</Link>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom-bar">
          <div className="footer-legal-copy">
            <span>© {new Date().getFullYear()} GACIS Cargo Services Pvt. Ltd. All rights reserved.</span>
            <span className="footer-legal-divider">•</span>
            <span className="footer-offices-summary">
              Head Office: Chennai, India · Offices: Klang, Malaysia · Colombo, Sri Lanka · Dubai, UAE · Mumbai, India
            </span>
          </div>

          <div className="footer-legal-links">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-of-service">Terms of Service</Link>
            <Link to="/sustainability">Environmental Policy</Link>
            <Link to="/contact">Support</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
