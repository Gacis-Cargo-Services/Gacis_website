import { useState } from 'react';
import { 
  Mail, MapPin, Phone, Building2, Send, CheckCircle, Clock, 
  Headphones, ExternalLink, Navigation, Globe, User, ShieldCheck, MapPinned 
} from 'lucide-react';
import { officialOffices, headOffice, globalOffices } from '../../data/offices';
import useFormSubmit from '../../hooks/useFormSubmit';
import SEO from '../../components/Common/SEO';
import PageHeader from '../../components/Common/PageHeader';
import './Contact.css';

export const Contact = () => {
  const [activeOfficeId, setActiveOfficeId] = useState('chennai');
  const activeOffice = officialOffices.find(o => o.id === activeOfficeId) || officialOffices[0];

  const {
    formData,
    updateField,
    errors,
    isSubmitting,
    isSuccess,
    submissionReference,
    serverError,
    submit,
    reset
  } = useFormSubmit({
    endpoint: import.meta.env.VITE_CONTACT_ENDPOINT || null,
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      corridor: 'Gulf ⇄ Central Asia (CIS)',
      message: ''
    }
  });

  const handleContactSubmit = async (e) => {
    await submit(e, {
      name: { required: true },
      email: { required: true, email: true },
      subject: { required: true },
      message: { required: true, minLength: 10 }
    });
  };

  const handleSelectMapOffice = (officeId) => {
    setActiveOfficeId(officeId);
    const mapEl = document.getElementById('office-locations-map');
    if (mapEl) {
      mapEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  return (
    <div className="contact-page">
      <SEO 
        title="Contact GACIS Global Logistics Desk — Head Office & Global Offices"
        description="Connect with GACIS trade lane specialists. Official offices in Chennai (Head Office, India), Klang (Malaysia), Colombo (Sri Lanka), Dubai (UAE), and Mumbai (India)."
        canonical="/contact"
      />

      {/* Hero Header */}
      <PageHeader
        eyebrow="DIRECT COMMERCIAL DESK"
        eyebrowIcon={Headphones}
        title="Connect with Our Trade Lane Specialists"
        description="Have a complex corridor requirement, time-critical air charter, or bulk container movement? Our central pricing and trade desks respond with verified rate schedules within 24 hours."
        statusTag="AVERAGE RESPONSE TIME: < 24 HOURS"
        videoSrc="/images/video/gacis%20video%2020sec.mp4"
      />

      <section className="section-padding bg-secondary">
        <div className="container">
          <div className="contact-main-grid">
            
            {/* Left: Contact Form Card */}
            <div className="contact-form-column">
              <div className="contact-card">
                <div className="cfc-header">
                  <span className="eyebrow">COMMERCIAL INQUIRY FORM</span>
                  <h2>Submit Your Shipment Inquiry</h2>
                  <p>Provide your cargo parameters below. Your inquiry is directly routed to the relevant corridor specialist.</p>
                </div>

                {isSuccess ? (
                  <div className="contact-success-state" role="status" aria-live="polite">
                    <div className="success-icon-wrap">
                      <CheckCircle size={36} />
                    </div>
                    <h3>Inquiry Received</h3>
                    <p className="success-ref">REFERENCE NUMBER: <strong>{submissionReference}</strong></p>
                    <p className="success-text">
                      Thank you, {formData.name}. Your inquiry regarding <em>{formData.subject}</em> has been assigned to the commercial desk. A specialist will follow up with verified routing and rate details.
                    </p>
                    <button className="btn btn-secondary mt-4" onClick={reset}>
                      Submit Another Inquiry
                    </button>
                  </div>
                ) : (
                  <form className="contact-form" onSubmit={handleContactSubmit} noValidate>
                    {serverError && (
                      <div className="form-alert-error" role="alert">
                        {serverError}
                      </div>
                    )}

                    <div className="cf-row-2">
                      <div className="cf-field">
                        <label htmlFor="contact-name">Full Name *</label>
                        <input 
                          id="contact-name"
                          type="text" 
                          placeholder="Elena Rostova"
                          value={formData.name}
                          onChange={e => updateField('name', e.target.value)}
                          aria-invalid={!!errors.name}
                          required
                        />
                        {errors.name && <span className="field-error-msg">{errors.name}</span>}
                      </div>

                      <div className="cf-field">
                        <label htmlFor="contact-email">Corporate Email *</label>
                        <input 
                          id="contact-email"
                          type="email" 
                          placeholder="elena@company.com"
                          value={formData.email}
                          onChange={e => updateField('email', e.target.value)}
                          aria-invalid={!!errors.email}
                          required
                        />
                        {errors.email && <span className="field-error-msg">{errors.email}</span>}
                      </div>
                    </div>

                    <div className="cf-row-2">
                      <div className="cf-field">
                        <label htmlFor="contact-phone">Contact Phone / WhatsApp</label>
                        <input 
                          id="contact-phone"
                          type="tel" 
                          placeholder="+91 99628 41182"
                          value={formData.phone}
                          onChange={e => updateField('phone', e.target.value)}
                        />
                      </div>

                      <div className="cf-field">
                        <label htmlFor="contact-corridor">Trade Corridor of Interest</label>
                        <select 
                          id="contact-corridor"
                          value={formData.corridor}
                          onChange={e => updateField('corridor', e.target.value)}
                        >
                          <option value="Gulf ⇄ Central Asia (CIS)">Gulf ⇄ Central Asia (CIS)</option>
                          <option value="South Asia (India) ⇄ Central Asia">South Asia (India) ⇄ Central Asia</option>
                          <option value="Southeast Asia ⇄ Europe">Southeast Asia ⇄ Europe</option>
                          <option value="South Asia ⇄ Gulf">South Asia ⇄ Gulf</option>
                          <option value="Trans-Caspian Rail Belt">Trans-Caspian Rail Belt</option>
                          <option value="Global Air Charter Desk">Global Air Charter Desk</option>
                        </select>
                      </div>
                    </div>

                    <div className="cf-field">
                      <label htmlFor="contact-subject">Inquiry Subject *</label>
                      <input 
                        id="contact-subject"
                        type="text" 
                        placeholder="e.g. Weekly Container Allocation to Tashkent / Almaty"
                        value={formData.subject}
                        onChange={e => updateField('subject', e.target.value)}
                        aria-invalid={!!errors.subject}
                        required
                      />
                      {errors.subject && <span className="field-error-msg">{errors.subject}</span>}
                    </div>

                    <div className="cf-field">
                      <label htmlFor="contact-message">Cargo Details & Specific Requirements *</label>
                      <textarea 
                        id="contact-message"
                        rows={4}
                        placeholder="Please mention origin, destination, cargo classification, estimated volume/weight, and timeline requirements..."
                        value={formData.message}
                        onChange={e => updateField('message', e.target.value)}
                        aria-invalid={!!errors.message}
                        required
                      />
                      {errors.message && <span className="field-error-msg">{errors.message}</span>}
                    </div>

                    <button 
                      type="submit" 
                      className="btn btn-primary btn-large btn-block"
                      disabled={isSubmitting}
                      aria-label={isSubmitting ? 'Transmitting dispatch request' : 'Send operational message'}
                    >
                      {isSubmitting ? 'Transmitting Dispatch...' : 'Send Operational Message'} <Send size={15} />
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Right: Official Offices Directory (Head Office + Global Offices) */}
            <div className="contact-hubs-column">
              <div className="chc-header">
                <span className="eyebrow">OFFICIAL DIRECTORY</span>
                <h2>Office Addresses &amp; Contacts</h2>
                <p>Official corporate headquarters and international operating desks.</p>
              </div>

              <div className="hubs-scroll-list">
                
                {/* ── 01. CHENNAI HEAD OFFICE (PROMINENTLY DISPLAYED) ── */}
                {headOffice && (
                  <div className="hub-contact-card office-card-head" key={headOffice.id}>
                    <div className="office-card-header-bar">
                      <span className="office-status-badge head-office-tag">
                        <ShieldCheck size={12} /> HEAD OFFICE
                      </span>
                      <button 
                        type="button" 
                        className="office-map-pin-btn"
                        onClick={() => handleSelectMapOffice(headOffice.id)}
                        title="View on Map"
                        aria-label="View Chennai Head Office on Map"
                      >
                        <MapPinned size={14} /> Map
                      </button>
                    </div>

                    <div className="hcc-top">
                      <span className="hcc-flag" aria-hidden="true">{headOffice.flag}</span>
                      <div className="hcc-titles">
                        <span className="hcc-country-tag">{headOffice.country} — {headOffice.city}</span>
                        <h4 className="office-entity-name">{headOffice.name}</h4>
                      </div>
                    </div>

                    <div className="hcc-info-rows">
                      {/* Hierarchy Step 1: Complete Postal Address */}
                      <div className="hcc-row address-row">
                        <MapPin size={16} className="hcc-icon" aria-hidden="true" />
                        <div className="hcc-text-block">
                          <strong className="hcc-field-label">Postal Address:</strong>
                          <div className="hcc-address-lines">
                            {headOffice.addressLines.map((line, idx) => (
                              <span key={idx}>{line}</span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Hierarchy Step 2: Telephone and Mobile Contacts */}
                      <div className="hcc-row phone-row">
                        <Phone size={16} className="hcc-icon" aria-hidden="true" />
                        <div className="hcc-text-block">
                          <strong className="hcc-field-label">Telephone &amp; Mobile:</strong>
                          <div className="hcc-phone-list">
                            {headOffice.phones.map((phone, pIdx) => (
                              <span key={pIdx} className="phone-item">
                                <span className="phone-label">{phone.label}:</span>{' '}
                                <a href={`tel:${phone.tel}`} className="contact-link phone-link">
                                  {phone.number}
                                </a>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Hierarchy Step 3: Contact Person */}
                      <div className="hcc-row contact-person-row">
                        <User size={16} className="hcc-icon" aria-hidden="true" />
                        <div className="hcc-text-block">
                          <strong className="hcc-field-label">Contact Person:</strong>
                          <span className="person-name">{headOffice.contacts[0].name}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── 02. OUR GLOBAL OFFICES SECTION ── */}
                <div className="global-offices-subgroup">
                  <div className="global-offices-divider">
                    <span className="god-eyebrow">INTERNATIONAL NETWORK</span>
                    <h3 className="god-title">Our Global Offices</h3>
                  </div>

                  <div className="global-offices-cards-list">
                    {globalOffices.map((office) => (
                      <div className="hub-contact-card office-card-global" key={office.id}>
                        <div className="office-card-header-bar">
                          <span className="office-status-badge global-office-tag">
                            GLOBAL OFFICE
                          </span>
                          <button 
                            type="button" 
                            className="office-map-pin-btn"
                            onClick={() => handleSelectMapOffice(office.id)}
                            title={`View ${office.city} on Map`}
                            aria-label={`View ${office.city} on Map`}
                          >
                            <MapPinned size={14} /> Map
                          </button>
                        </div>

                        <div className="hcc-top">
                          <span className="hcc-flag" aria-hidden="true">{office.flag}</span>
                          <div className="hcc-titles">
                            <span className="hcc-country-tag">{office.country} — {office.city}</span>
                            <h4 className="office-entity-name">{office.name}</h4>
                          </div>
                        </div>

                        <div className="hcc-info-rows">
                          {/* Hierarchy Step 1: Complete Postal Address */}
                          <div className="hcc-row address-row">
                            <MapPin size={16} className="hcc-icon" aria-hidden="true" />
                            <div className="hcc-text-block">
                              <strong className="hcc-field-label">Postal Address:</strong>
                              <div className="hcc-address-lines">
                                {office.addressLines.map((line, idx) => (
                                  <span key={idx}>{line}</span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Hierarchy Step 2: Telephone and Mobile Contacts */}
                          {office.phones.length > 0 && (
                            <div className="hcc-row phone-row">
                              <Phone size={16} className="hcc-icon" aria-hidden="true" />
                              <div className="hcc-text-block">
                                <strong className="hcc-field-label">Telephone &amp; Mobile:</strong>
                                <div className="hcc-phone-list">
                                  {office.phones.map((phone, pIdx) => (
                                    <span key={pIdx} className="phone-item">
                                      <span className="phone-label">{phone.label}:</span>{' '}
                                      <a href={`tel:${phone.tel}`} className="contact-link phone-link">
                                        {phone.number}
                                      </a>
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Hierarchy Step 3: Contact Person(s) */}
                          {office.contacts && office.contacts.length > 0 && (
                            <div className="hcc-row contact-person-row">
                              <User size={16} className="hcc-icon" aria-hidden="true" />
                              <div className="hcc-text-block">
                                <strong className="hcc-field-label">
                                  {office.contacts.length > 1 ? 'Designated Contacts:' : 'Contact Person:'}
                                </strong>
                                <div className="contacts-multiline">
                                  {office.contacts.map((c, cIdx) => (
                                    <div key={cIdx} className="contact-person-entry">
                                      <span className="person-name"><strong>{c.name}</strong></span>
                                      {c.mobile && (
                                        <span className="person-mobile">
                                          <Phone size={11} className="inline-icon" />{' '}
                                          <a href={`tel:${c.tel}`} className="contact-link">
                                            {c.mobile}
                                          </a>
                                        </span>
                                      )}
                                      {c.email && (
                                        <span className="person-email">
                                          <Mail size={11} className="inline-icon" />{' '}
                                          <a href={`mailto:${c.email}`} className="contact-link email-link">
                                            {c.email}
                                          </a>
                                        </span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Hierarchy Step 4: Website link where supplied */}
                          {office.website && (
                            <div className="hcc-row website-row">
                              <Globe size={16} className="hcc-icon" aria-hidden="true" />
                              <div className="hcc-text-block">
                                <strong className="hcc-field-label">Website:</strong>
                                <a 
                                  href={office.website} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="contact-link website-link"
                                >
                                  {office.website} <ExternalLink size={11} />
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* ─── Embedded Interactive Location Map ─── */}
          <div className="contact-map-section" id="office-locations-map">
            <div className="cms-header">
              <div>
                <span className="eyebrow">OFFICE LOCATIONS &amp; DIRECTIONS</span>
                <h3>Find Our Official Corporate Offices</h3>
              </div>

              <div className="cms-office-tabs" role="tablist" aria-label="Official Office Location Tabs">
                {officialOffices.map((office) => (
                  <button
                    key={office.id}
                    type="button"
                    role="tab"
                    aria-selected={activeOfficeId === office.id}
                    className={`cms-tab-btn ${activeOfficeId === office.id ? 'is-active' : ''} ${office.isHeadOffice ? 'is-head-tab' : ''}`}
                    onClick={() => setActiveOfficeId(office.id)}
                  >
                    <Building2 size={14} />
                    <span>{office.city}</span>
                    {office.isHeadOffice && <span className="tab-head-pill">HQ</span>}
                  </button>
                ))}
              </div>
            </div>

            <div className="cms-map-card">
              <div className="cms-map-frame-wrapper">
                <iframe
                  title={`${activeOffice.name} — ${activeOffice.city} Google Map`}
                  src={activeOffice.mapUrl}
                  width="100%"
                  height="360"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="cms-map-iframe"
                />
              </div>

              <div className="cms-office-meta-bar">
                <div className="comb-info">
                  <div className="comb-title-row">
                    <h4>{activeOffice.name}</h4>
                    {activeOffice.isHeadOffice && (
                      <span className="office-status-badge head-office-tag">HEAD OFFICE</span>
                    )}
                  </div>
                  <p><MapPin size={13} /> {activeOffice.fullAddress}</p>
                </div>

                <div className="comb-actions">
                  <div className="comb-contact-fast">
                    {activeOffice.phones.length > 0 ? (
                      activeOffice.phones.map((p, idx) => (
                        <span key={idx}>
                          <Phone size={13} />{' '}
                          <a href={`tel:${p.tel}`} className="comb-link">
                            {p.label}: {p.number}
                          </a>
                        </span>
                      ))
                    ) : activeOffice.contacts[0]?.mobile ? (
                      <span>
                        <Phone size={13} />{' '}
                        <a href={`tel:${activeOffice.contacts[0].tel}`} className="comb-link">
                          {activeOffice.contacts[0].name}: {activeOffice.contacts[0].mobile}
                        </a>
                      </span>
                    ) : null}

                    {activeOffice.contacts[0]?.name && (
                      <span><User size={13} /> {activeOffice.contacts.map(c => c.name).join(' · ')}</span>
                    )}
                  </div>

                  <a
                    href={activeOffice.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-sm"
                  >
                    <Navigation size={14} /> Get Directions <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Contact;
