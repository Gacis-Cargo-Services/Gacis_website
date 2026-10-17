import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { 
  CheckCircle, ChevronRight, ArrowLeft, Send, Plane, Ship, Truck, Train, Boxes, Compass, Sparkles, RefreshCw
} from 'lucide-react';
import useFormSubmit from '../../hooks/useFormSubmit';
import './QuoteWizard.css';

const mapServiceMode = (modeStr) => {
  if (!modeStr) return 'Multimodal';
  const upper = modeStr.toUpperCase();
  if (upper.includes('AIR')) return 'Air Freight';
  if (upper.includes('SEA') || upper.includes('OCEAN')) return 'Ocean Freight';
  if (upper.includes('RAIL')) return 'Rail Freight';
  if (upper.includes('ROAD')) return 'Road Freight';
  if (upper.includes('PROJECT')) return 'Project Logistics';
  return 'Multimodal';
};

const mapCargoType = (cargoStr) => {
  if (!cargoStr) return 'General Cargo';
  if (cargoStr.includes('Pharma')) return 'Pharmaceuticals';
  if (cargoStr.includes('Auto')) return 'Automotive Parts';
  if (cargoStr.includes('High-Tech') || cargoStr.includes('Electronics')) return 'High-Tech Electronics';
  if (cargoStr.includes('Dangerous') || cargoStr.includes('DGR')) return 'Dangerous Goods (DGR)';
  if (cargoStr.includes('Machinery') || cargoStr.includes('Industrial') || cargoStr.includes('Project')) return 'General Cargo';
  return 'General Cargo';
};

const mapPriority = (priorityStr) => {
  if (!priorityStr) return 'Standard';
  if (priorityStr.includes('Urgent')) return 'Urgent';
  if (priorityStr.includes('Express')) return 'Express';
  return 'Standard';
};

export const QuoteWizard = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isPreFilled, setIsPreFilled] = useState(false);

  const {
    formData,
    setFormData,
    updateField,
    _errors,
    isSubmitting,
    isSuccess,
    submissionReference,
    submit,
    reset
  } = useFormSubmit({
    endpoint: import.meta.env.VITE_QUOTE_ENDPOINT || null,
    defaultValues: {
      service: 'Air Freight',
      origin: '',
      destination: '',
      cargoType: 'General Cargo',
      weight: '',
      volume: '',
      specialHandling: 'None',
      targetDate: '',
      priority: 'Standard',
      incoterms: 'DDP',
      company: '',
      name: '',
      email: '',
      phone: ''
    }
  });

  // Prefill form from Route Simulator location.state or URL search parameters
  useEffect(() => {
    const stateOrigin = location.state?.origin;
    const searchOrigin = searchParams.get('origin');
    const originVal = stateOrigin || searchOrigin;

    const destVal = location.state?.destination || searchParams.get('destination');
    const modeVal = location.state?.mode || searchParams.get('mode');
    const cargoVal = location.state?.cargoType || searchParams.get('cargoType');
    const priorityVal = location.state?.priority || searchParams.get('priority');
    const transitTime = location.state?.transitTime || searchParams.get('transitTime');
    const optCO2 = location.state?.optCO2 || searchParams.get('optCO2');

    if (originVal || destVal || modeVal || cargoVal) {
      setFormData(prev => ({
        ...prev,
        origin: originVal || prev.origin,
        destination: destVal || prev.destination,
        service: modeVal ? mapServiceMode(modeVal) : prev.service,
        cargoType: cargoVal ? mapCargoType(cargoVal) : prev.cargoType,
        priority: priorityVal ? mapPriority(priorityVal) : prev.priority,
        weight: prev.weight || '14000',
        volume: (transitTime || optCO2) 
          ? `1 TEU (${[transitTime ? `${transitTime} Days Est.` : null, optCO2 ? `${optCO2} tCO2e` : null].filter(Boolean).join(', ')})`
          : prev.volume
      }));
      setIsPreFilled(true);
    }
  }, [location.state, searchParams, setFormData]);

  const nextStep = () => {
    // Validate current step before advancing
    if (step === 1) {
      if (!formData.service || !formData.origin.trim() || !formData.destination.trim()) {
        alert('Please complete the service, origin, and destination fields.');
        return;
      }
    }
    if (step === 2) {
      if (!formData.weight || Number(formData.weight) <= 0) {
        alert('Please specify an estimated gross weight in kg.');
        return;
      }
    }
    if (step === 4) {
      if (!formData.name.trim() || !formData.email.trim() || !formData.company.trim()) {
        alert('Please complete your full name, business email, and company.');
        return;
      }
    }
    setStep(prev => Math.min(prev + 1, 6));
  };

  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleFinalSubmit = async (e) => {
    const success = await submit(e, {
      email: { required: true, email: true },
      name: { required: true },
      company: { required: true }
    });
    if (success) {
      setStep(6);
    }
  };

  const restartQuote = () => {
    reset();
    setStep(1);
  };

  return (
    <div className="quote-wizard-card">
      
      {/* Progress Bar (Steps 1 to 5) */}
      {step < 6 && (
        <div className="wizard-progress-bar">
          {[
            { num: 1, label: 'Corridor' },
            { num: 2, label: 'Cargo Specs' },
            { num: 3, label: 'Service & Incoterms' },
            { num: 4, label: 'Commercial Contact' },
            { num: 5, label: 'Review Summary' }
          ].map(s => (
            <div key={s.num} className={`progress-step-node ${step >= s.num ? 'is-active' : ''} ${step > s.num ? 'is-complete' : ''}`}>
              <div className="psn-circle">
                {step > s.num ? <CheckCircle size={14} /> : s.num}
              </div>
              <span className="psn-label">{s.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Wizard Content Body */}
      <div className="wizard-body">
        
        {/* Step 1: Corridor & Service Mode */}
        {step === 1 && (
          <div className="step-panel fade-up">
            <span className="step-eyebrow">STEP 1 OF 5</span>
            <h3>Select Mode & Primary Trade Corridor</h3>
            <p className="step-desc">Choose your transportation mode preference and routing endpoints.</p>

            {isPreFilled && (
              <div className="wizard-prefilled-banner">
                <Sparkles size={16} className="wpb-sparkle" />
                <span>
                  Corridor pre-filled from Multimodal Route Planner: <strong>{formData.origin} ⇄ {formData.destination}</strong> ({formData.service} • {formData.priority} Priority)
                </span>
              </div>
            )}

            <div className="service-selector-grid">
              {[
                { name: 'Air Freight', icon: Plane, tag: '1–3 Days' },
                { name: 'Ocean Freight', icon: Ship, tag: 'FCL & LCL' },
                { name: 'Road Freight', icon: Truck, tag: 'GCC Overland' },
                { name: 'Rail Freight', icon: Train, tag: 'Silk Corridor' },
                { name: 'Multimodal', icon: Compass, tag: 'Optimized Hybrid' },
                { name: 'Project Logistics', icon: Boxes, tag: 'Heavy Lift' }
              ].map(s => {
                const Icon = s.icon;
                const isSelected = formData.service === s.name;
                return (
                  <button
                    type="button"
                    key={s.name}
                    className={`mode-select-btn ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => updateField('service', s.name)}
                  >
                    <Icon size={20} />
                    <span className="msb-name">{s.name}</span>
                    <span className="msb-tag">{s.tag}</span>
                  </button>
                );
              })}
            </div>

            <div className="form-grid-2 mt-4">
              <div className="form-group">
                <label>Origin City / Seaport / Airport *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Dubai (DXB) or Jebel Ali"
                  value={formData.origin}
                  onChange={e => updateField('origin', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Destination City / Hub *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Almaty Logistics Park (ALA)"
                  value={formData.destination}
                  onChange={e => updateField('destination', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Cargo Specifications */}
        {step === 2 && (
          <div className="step-panel fade-up">
            <span className="step-eyebrow">STEP 2 OF 5</span>
            <h3>Cargo Classification & Physical Dimensions</h3>
            <p className="step-desc">Provide estimated cargo weight, volume, and special handling parameters.</p>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Cargo Classification</label>
                <select value={formData.cargoType} onChange={e => updateField('cargoType', e.target.value)}>
                  <option value="General Cargo">General Dry Cargo / Palletized</option>
                  <option value="Pharmaceuticals">Pharmaceuticals & GDP Cold-Chain (+2°C to +8°C)</option>
                  <option value="Automotive Parts">Automotive Assembly Parts (CKD/SKD)</option>
                  <option value="High-Tech Electronics">High-Value Microelectronics & Semiconductors</option>
                  <option value="Dangerous Goods (DGR)">Dangerous Goods / Hazmat (Class 1–9)</option>
                  <option value="Oversized Project Cargo">Oversized / Heavy Lift Project Cargo</option>
                </select>
              </div>

              <div className="form-group">
                <label>Special Handling Requirements</label>
                <select value={formData.specialHandling} onChange={e => updateField('specialHandling', e.target.value)}>
                  <option value="None">Standard Commercial Handling</option>
                  <option value="Active Temperature Controlled">Active Temperature Controlled Container</option>
                  <option value="TAPA TSR-1 High Security Escort">TAPA TSR-1 High Security Escort</option>
                  <option value="Armed Courier On-Board (OBC)">Armed Courier On-Board (OBC)</option>
                  <option value="Hydraulic Multi-Axle Trailer Required">Hydraulic Multi-Axle Trailer Required</option>
                </select>
              </div>

              <div className="form-group">
                <label>Total Estimated Gross Weight (kg) *</label>
                <input 
                  type="number" 
                  placeholder="e.g. 2400"
                  value={formData.weight}
                  onChange={e => updateField('weight', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Total Volume (CBM) or Container Count</label>
                <input 
                  type="text" 
                  placeholder="e.g. 12.5 CBM or 1x 40ft HC"
                  value={formData.volume}
                  onChange={e => updateField('volume', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Service Priority & Incoterms */}
        {step === 3 && (
          <div className="step-panel fade-up">
            <span className="step-eyebrow">STEP 3 OF 5</span>
            <h3>Service Level, Priority & Commercial Incoterms</h3>
            <p className="step-desc">Specify trade risk distribution and targeted transit velocities.</p>

            <div className="form-grid-3">
              <div className="form-group">
                <label>Transit Priority</label>
                <select value={formData.priority} onChange={e => updateField('priority', e.target.value)}>
                  <option value="Standard">Standard (Lowest Cost & Balanced Lead Time)</option>
                  <option value="Express">Express (Scheduled Expedited Linehaul)</option>
                  <option value="Urgent">Urgent (Charter / Next Flight Out)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Trade Incoterms (2020)</label>
                <select value={formData.incoterms} onChange={e => updateField('incoterms', e.target.value)}>
                  <option value="DDP">DDP — Delivered Duty Paid (Recommended)</option>
                  <option value="DAP">DAP — Delivered at Place</option>
                  <option value="CIF">CIF — Cost, Insurance & Freight</option>
                  <option value="FOB">FOB — Free on Board</option>
                  <option value="EXW">EXW — Ex Works (Door Pickup)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Target Delivery Date</label>
                <input 
                  type="date" 
                  value={formData.targetDate}
                  onChange={e => updateField('targetDate', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Contact & Commercial Details */}
        {step === 4 && (
          <div className="step-panel fade-up">
            <span className="step-eyebrow">STEP 4 OF 5</span>
            <h3>Commercial Shipper Information</h3>
            <p className="step-desc">Where should our global trade desk deliver the formal quotation?</p>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Company Legal Entity *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Al-Futtaim Logistics / Siemens Industrial"
                  value={formData.company}
                  onChange={e => updateField('company', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Contact Name & Title *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Tariq Al-Mansoor (Supply Chain Director)"
                  value={formData.name}
                  onChange={e => updateField('name', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Business Email Address *</label>
                <input 
                  type="email" 
                  placeholder="tariq@company.com"
                  value={formData.email}
                  onChange={e => updateField('email', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Direct Phone Number / WhatsApp</label>
                <input 
                  type="tel" 
                  placeholder="+971 50 123 4567"
                  value={formData.phone}
                  onChange={e => updateField('phone', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Review Summary */}
        {step === 5 && (
          <div className="step-panel fade-up">
            <span className="step-eyebrow">STEP 5 OF 5</span>
            <h3>Review Route Calculation Request</h3>
            <p className="step-desc">Verify your shipment parameters prior to lodging with the GACIS commercial desk.</p>

            <div className="review-summary-card">
              <div className="rsc-grid">
                <div className="rsc-item">
                  <span className="rsc-lbl">SERVICE MODE:</span>
                  <span className="rsc-val">{formData.service}</span>
                </div>
                <div className="rsc-item">
                  <span className="rsc-lbl">TRADE CORRIDOR:</span>
                  <span className="rsc-val">{formData.origin} ⇄ {formData.destination}</span>
                </div>
                <div className="rsc-item">
                  <span className="rsc-lbl">CARGO SPECS:</span>
                  <span className="rsc-val">{formData.cargoType} • {formData.weight} kg {formData.volume ? `(${formData.volume})` : ''}</span>
                </div>
                <div className="rsc-item">
                  <span className="rsc-lbl">PRIORITY & INCOTERMS:</span>
                  <span className="rsc-val">{formData.priority} Priority • {formData.incoterms}</span>
                </div>
                <div className="rsc-item">
                  <span className="rsc-lbl">CONTACT ENTITY:</span>
                  <span className="rsc-val">{formData.name}, {formData.company} ({formData.email})</span>
                </div>
                <div className="rsc-item">
                  <span className="rsc-lbl">CARBON INTELLIGENCE:</span>
                  <span className="rsc-val text-gold">GLEC Scope 3 Baseline Audit Attached</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Confirmation Receipt */}
        {step === 6 && (
          <div className="step-panel confirmation-panel text-center fade-up">
            <div className="confirm-icon-wrap">
              <CheckCircle size={44} />
            </div>
            <h2>Route Calculation Request Logged</h2>
            <p className="confirm-ref-tag">
              REFERENCE ID: <strong className="tabular-nums">{submissionReference || 'GAC-Q-78921'}</strong>
            </p>
            <p className="confirm-desc">
              Thank you, {formData.name}. Our commercial trade desk in Dubai and regional gateway specialists are compiling your customized rate schedule and transit lead-time estimates.
            </p>

            <div className="confirm-actions">
              <button className="btn btn-primary" onClick={() => navigate('/')}>
                Return to Network Home
              </button>
              <button className="btn btn-secondary" onClick={restartQuote}>
                <RefreshCw size={14} /> Calculate Another Route
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Navigation Footer Controls (Steps 1 to 5) */}
      {step < 6 && (
        <div className="wizard-footer-controls">
          <button 
            type="button"
            className="btn btn-secondary" 
            onClick={prevStep}
            disabled={step === 1}
            style={{ visibility: step === 1 ? 'hidden' : 'visible' }}
          >
            <ArrowLeft size={15} /> Back
          </button>

          {step < 5 ? (
            <button type="button" className="btn btn-primary" onClick={nextStep}>
              Next Step <ChevronRight size={15} />
            </button>
          ) : (
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Transmitting Request...' : 'Confirm & Request Quote'} <Send size={15} />
            </button>
          )}
        </div>
      )}

    </div>
  );
};

export default QuoteWizard;
