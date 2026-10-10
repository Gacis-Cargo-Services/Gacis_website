import { useState, useEffect } from 'react';
import { Activity, Ship, Plane, Train, ArrowUpRight, ArrowDownLeft, Pause, Play } from 'lucide-react';
import './HeroNetworkAnimation.css';

// Regional Multimodal Hub Database (Sea Ports, Train Rail Corridors, Flight Air Cargo Hubs)
const regionalHubData = {
  'Indian Subcontinent': {
    regionName: 'INDIAN SUBCONTINENT',
    tag: 'IND HUB',
    role: 'South Asian Maritime, Dedicated Freight Rail & Air Cargo Hub',
    status: '12 Deepwater Major Sea Ports & Dedicated Freight Rail (DFC) Active',
    seaPorts: ['Bombay / JNPT (BOM)', 'Chennai (MAA)', 'Visakhapatnam (VTZ)', 'Mundra (MUN)', 'Cochin (COK)', 'Kolkata / Haldia (CCU)'],
    trainRoutes: ['Western DFC (Dadri–JNPT)', 'Eastern DFC', 'ICD Tughlakabad (TKD)'],
    flightRoutes: ['BOM Air Cargo Gateway', 'DEL Air Cargo City', 'MAA International Freight Apron']
  },
  'Far East Asia': {
    regionName: 'FAR EAST ASIA',
    tag: 'FAR EAST',
    role: 'Pacific Rim Mega Container Seaports & Air Logistics City',
    status: 'High-Speed Container Berths & Automated Rail Gantries Live',
    seaPorts: ['Shanghai (SHA)', 'Singapore (SIN)', 'Busan (PUS)', 'Tokyo / Yokohama (TYO)', 'Hong Kong (HKG)'],
    trainRoutes: ['Yiwu-Khorgos Trans-Eurasian Rail', 'China-ASEAN Rail Freight'],
    flightRoutes: ['Hong Kong (HKG) Air Hub', 'Shanghai Pudong (PVG)', 'Tokyo Narita (NRT)']
  },
  'South East Asia & Far East Asia': {
    regionName: 'SOUTH EAST ASIA & FAR EAST ASIA',
    tag: 'SE & FAR EAST',
    role: 'ASEAN Straits Transshipment & East Asian Manufacturing Belt',
    status: 'Straits Intermodal Linehaul & Coastal Feeder Mesh Operating',
    seaPorts: ['Singapore (SIN)', 'Port Klang (PKG)', 'Shanghai (SHA)', 'Busan (PUS)', 'Tanjung Pelepas (TPP)'],
    trainRoutes: ['Kunming-Singapore ASEAN Rail', 'Trans-Asian Railway Network'],
    flightRoutes: ['Singapore Changi (SIN)', 'Bangkok Suvarnabhumi (BKK)', 'Kuala Lumpur (KUL)']
  },
  'South East Asia': {
    regionName: 'SOUTH EAST ASIA',
    tag: 'SE ASIA',
    role: 'Malacca Strait Global Feeder & Transshipment Crossroads',
    status: 'Deepwater Container Terminals & Inter-Island Feeders Verified',
    seaPorts: ['Singapore (SIN)', 'Port Klang (PKG)', 'Tanjung Pelepas (TPP)', 'Jakarta / Tanjung Priok (JKT)'],
    trainRoutes: ['Pan-Asia Southern Rail Link', 'Thailand-Malaysia Rail Corridor'],
    flightRoutes: ['Singapore Changi (SIN)', 'Kuala Lumpur (KUL)']
  },
  'Mid East Asia': {
    regionName: 'MID EAST ASIA',
    tag: 'MID EAST',
    role: 'Arabian Gulf Sea-Air Hub & Intermodal Gateway',
    status: 'Free Zone Customs Pre-Cleared & Sea-Air Fast Transfer Synchronized',
    seaPorts: ['Jebel Ali / Dubai (DXB)', 'Dammam Port (DMM)', 'Salalah Port (SLL)', 'Khalifa Port (AUH)', 'Sohar (OHS)'],
    trainRoutes: ['Etihad Rail Freight Net', 'GCC Integrated Rail Corridor'],
    flightRoutes: ['Dubai World Central (DWC)', 'Emirates SkyCargo Hub (DXB)', 'Doha Cargo City (DOH)']
  },
  'East & South Africa': {
    regionName: 'EAST & SOUTH AFRICA',
    tag: 'E & S AFRICA',
    role: 'Indian Ocean Seaboard & Pan-African Mining/Agri Terminals',
    status: 'Deepwater Container Terminals & Standard Gauge Rail (SGR) Live',
    seaPorts: ['Durban Port (DUR)', 'Mombasa Gateway (MBA)', 'Dar es Salaam (DAR)', 'Cape Town (CPT)', 'Maputo (MPM)'],
    trainRoutes: ['Kenya SGR Mombasa-Nairobi', 'Transnet Freight Rail (South Africa)'],
    flightRoutes: ['Johannesburg OR Tambo (JNB)', 'Nairobi Jomo Kenyatta (NBO)']
  },
  'Africa': {
    regionName: 'AFRICA CONTINENT',
    tag: 'AFRICA',
    role: 'Pan-African Mineral, Agri & Strategic Maritime Corridors',
    status: 'Deepwater Marine Terminals & Export Gateway Clearance Active',
    seaPorts: ['Djibouti Port (JIB)', 'Durban Port (DUR)', 'Mombasa Port (MBA)', 'Dar es Salaam (DAR)', 'Lagos / Apapa (LOS)'],
    trainRoutes: ['Ethio-Djibouti Railway', 'Transnet Heavy Haul Rail', 'Tazara Railway'],
    flightRoutes: ['Addis Ababa Bole (ADD)', 'Johannesburg (JNB)', 'Cairo Air Cargo (CAI)']
  },
  'South & North America': {
    regionName: 'SOUTH & NORTH AMERICA',
    tag: 'AMERICAS',
    role: 'Pan-American Transatlantic & Pacific Marine Terminals',
    status: 'Class I Railroad Intermodal Ramps & Container Berths Operating',
    seaPorts: ['Santos Port (SSZ Brazil)', 'New York / New Jersey (NYC)', 'Houston (HOU)', 'Los Angeles / LB (LAX)', 'Callao (CLO)'],
    trainRoutes: ['BNSF / Union Pacific Intermodal Rail', 'Ferronorte Rail (Brazil)', 'CN / CPKC North America'],
    flightRoutes: ['Miami Cargo Gateway (MIA)', 'Chicago O’Hare (ORD)', 'São Paulo Guarulhos (GRU)']
  },
  'North America': {
    regionName: 'NORTH AMERICA',
    tag: 'N. AMERICA',
    role: 'East & West Coast Deepwater Ports with Double-Stack Rail Intermodal',
    status: 'Automated Container Terminals & Intermodal Ramps Discharging',
    seaPorts: ['New York / NJ (NYC)', 'Los Angeles / Long Beach (LAX)', 'Houston (HOU)', 'Savannah (SAV)', 'Vancouver (YVR)'],
    trainRoutes: ['BNSF Transcon Rail Corridor', 'Union Pacific Double-Stack Network'],
    flightRoutes: ['Miami International (MIA)', 'JFK International (NYC)', 'Chicago O’Hare (ORD)']
  },
  'South America': {
    regionName: 'SOUTH AMERICA',
    tag: 'S. AMERICA',
    role: 'Latin American Atlantic & Pacific Container Gateways',
    status: 'Export Grain & Mineral Berths with Customs Bonded Transfer Cleared',
    seaPorts: ['Santos Port (SSZ Brazil)', 'Buenos Aires (BUE)', 'Callao (CLO Peru)', 'Valparaiso (VAP Chile)'],
    trainRoutes: ['Ferronorte Agri-Rail Corridor', 'Malvinas Intermodal Line'],
    flightRoutes: ['São Paulo Viracopos (VCP)', 'Bogotá El Dorado (BOG)']
  },
  'European Union': {
    regionName: 'EUROPEAN UNION',
    tag: 'EU UNION',
    role: 'North Sea & Mediterranean Mega-Ports with Rhine Barge & Rail',
    status: 'Automated Container Gantries & Inland River Network Active',
    seaPorts: ['Rotterdam Mega Port (RTM)', 'Hamburg (HAM)', 'Antwerp-Bruges (ANR)', 'Valencia (VLC)', 'Genoa (GOA)'],
    trainRoutes: ['Rhine-Alpine Rail Corridor', 'Betuweroute Dedicated Freight Line'],
    flightRoutes: ['Frankfurt CargoCity (FRA)', 'Amsterdam Schiphol (AMS)', 'Paris Charles de Gaulle (CDG)']
  }
};

// 7 Exact Corridors Specified by the User
export const corridorRoutes = [
  // ─── EXPORT CORRIDORS (4) ───
  {
    id: 'export-1',
    tradeType: 'EXPORT',
    name: 'Indian Subcontinent ⇄ Far East Asia ⇄ Mid East Asia',
    sub: 'Export Corridor 1 · Asia & Middle East Belt',
    nodes: [
      { name: 'Indian Subcontinent', x: 75, y: 130, labelY: 26 },
      { name: 'Far East Asia', x: 230, y: 65, labelY: -16 },
      { name: 'Mid East Asia', x: 385, y: 105, labelY: 26 }
    ]
  },
  {
    id: 'export-2',
    tradeType: 'EXPORT',
    name: 'Mid East Asia ⇄ East & South Africa ⇄ South & North America',
    sub: 'Export Corridor 2 · Trans-Oceanic Intercontinental String',
    nodes: [
      { name: 'Mid East Asia', x: 75, y: 130, labelY: 26 },
      { name: 'East & South Africa', x: 230, y: 65, labelY: -16 },
      { name: 'South & North America', x: 385, y: 105, labelY: 26 }
    ]
  },
  {
    id: 'export-3',
    tradeType: 'EXPORT',
    name: 'Africa ⇄ Indian Subcontinent ⇄ Far East Asia',
    sub: 'Export Corridor 3 · Indo-Pacific Trade Highway',
    nodes: [
      { name: 'Africa', x: 75, y: 130, labelY: 26 },
      { name: 'Indian Subcontinent', x: 230, y: 65, labelY: -16 },
      { name: 'Far East Asia', x: 385, y: 105, labelY: 26 }
    ]
  },
  {
    id: 'export-4',
    tradeType: 'EXPORT',
    name: 'Indian Subcontinent ⇄ South & North America ⇄ European Union',
    sub: 'Export Corridor 4 · Transatlantic & Euro-America Loop',
    nodes: [
      { name: 'Indian Subcontinent', x: 75, y: 130, labelY: 26 },
      { name: 'South & North America', x: 230, y: 65, labelY: -16 },
      { name: 'European Union', x: 385, y: 105, labelY: 26 }
    ]
  },

  // ─── IMPORT CORRIDORS (3) ───
  {
    id: 'import-1',
    tradeType: 'IMPORT',
    name: 'South East Asia & Far East Asia ⇄ Indian Subcontinent',
    sub: 'Import Corridor 1 · Direct Inbound Feeder & Linehaul',
    nodes: [
      { name: 'South East Asia', x: 75, y: 130, labelY: 26 },
      { name: 'Far East Asia', x: 230, y: 65, labelY: -16 },
      { name: 'Indian Subcontinent', x: 385, y: 105, labelY: 26 }
    ]
  },
  {
    id: 'import-2',
    tradeType: 'IMPORT',
    name: 'European Union ⇄ Indian Subcontinent ⇄ South East Asia & Far East Asia',
    sub: 'Import Corridor 2 · Eurasian Trans-Continental Trade String',
    nodes: [
      { name: 'European Union', x: 75, y: 130, labelY: 26 },
      { name: 'Indian Subcontinent', x: 230, y: 65, labelY: -16 },
      { name: 'South East Asia & Far East Asia', x: 385, y: 105, labelY: 26 }
    ]
  },
  {
    id: 'import-3',
    tradeType: 'IMPORT',
    name: 'South & North America ⇄ Indian Subcontinent',
    sub: 'Import Corridor 3 · Pan-American Inbound Seaway',
    nodes: [
      { name: 'North America', x: 75, y: 130, labelY: 26 },
      { name: 'South America', x: 230, y: 65, labelY: -16 },
      { name: 'Indian Subcontinent', x: 385, y: 105, labelY: 26 }
    ]
  }
];

export const HeroNetworkAnimation = () => {
  const [routeIndex, setRouteIndex] = useState(0);
  const [nodeIndex, setNodeIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentRoute = corridorRoutes[routeIndex];
  const currentNode = currentRoute.nodes[nodeIndex];
  const activeHubInfo = regionalHubData[currentNode.name] || regionalHubData['Indian Subcontinent'];
  const isExport = currentRoute.tradeType === 'EXPORT';

  // 3.5 s interval: cycles through nodes of active route, respects pause
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setNodeIndex((prevNode) => {
        if (prevNode < corridorRoutes[routeIndex].nodes.length - 1) {
          return prevNode + 1;
        } else {
          setRouteIndex((prevRoute) => (prevRoute + 1) % corridorRoutes.length);
          return 0;
        }
      });
    }, 3500);

    return () => clearInterval(timer);
  }, [routeIndex, isPaused]);

  return (
    <div className="hero-network-console">
      {/* ── Console Header Bar ── */}
      <div className="hnc-top-bar">
        <div className="hnc-title-row">
          <span className={`live-radar-dot${isPaused ? ' is-paused' : ''}`}></span>
          <span className="hnc-system-title">GACIS MULTIMODAL ROUTE MONITOR</span>
        </div>
        <div className="hnc-top-right-group">
          <span className={`trade-top-tag ${isExport ? 'tag-export' : 'tag-import'}`}>
            {isExport ? <ArrowUpRight size={12} className="tag-arrow" /> : <ArrowDownLeft size={12} className="tag-arrow" />}
            {currentRoute.tradeType}
          </span>
          {/* Pause / Play toggle */}
          <button
            type="button"
            className={`hnc-pause-btn${isPaused ? ' is-paused' : ''}`}
            onClick={() => setIsPaused((p) => !p)}
            aria-label={isPaused ? 'Resume animation' : 'Pause animation'}
            title={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? <Play size={11} /> : <Pause size={11} />}
          </button>
          <div className="hnc-status-badge">
            <Activity size={13} className={`pulse-icon${isPaused ? ' stopped' : ''}`} />
          </div>
        </div>
      </div>

      {/* ── Visualizer SVG Wave Graph ── */}
      <div className="hnc-visualizer-canvas">
        <svg viewBox="0 0 460 170" className="hnc-svg" aria-label="GACIS Multimodal Trade Route Graph">
          <defs>
            <linearGradient id="corridorGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#68151d" />
              <stop offset="50%" stopColor="#c8202f" />
              <stop offset="100%" stopColor="#d4a843" />
            </linearGradient>

            <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Grid Lines */}
          <line x1="20" y1="85" x2="440" y2="85" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
          <line x1="20" y1="40" x2="440" y2="40" stroke="rgba(255,255,255,0.03)" strokeDasharray="3 3" />
          <line x1="20" y1="130" x2="440" y2="130" stroke="rgba(255,255,255,0.03)" strokeDasharray="3 3" />

          {/* Static Track Guide Wave */}
          <path
            d="M 75,130 C 140,130 170,65 230,65 C 290,65 320,105 385,105"
            fill="none"
            stroke="rgba(255,255,255,0.16)"
            strokeWidth="3"
            strokeDasharray="5 5"
          />

          {/* Active Flow Line with gradient */}
          <path
            d="M 75,130 C 140,130 170,65 230,65 C 290,65 320,105 385,105"
            fill="none"
            stroke="url(#corridorGrad)"
            strokeWidth="4"
            className="corridor-flow-path"
          />

          {/* Region Nodes along the curve */}
          {currentRoute.nodes.map((node, idx) => {
            const isActive = idx === nodeIndex;
            const isCompleted = idx < nodeIndex;

            return (
              <g 
                key={`${currentRoute.id}-${node.name}-${idx}`} 
                transform={`translate(${node.x}, ${node.y})`} 
                className={`map-node ${isActive ? 'is-active-port' : isCompleted ? 'is-completed-port' : 'is-pending-port'}`}
              >


                {/* Node Center Circle */}
                <circle 
                  r={isActive ? 8.5 : 7} 
                  fill={isActive ? '#d4a843' : isCompleted ? '#22c55e' : '#68151d'} 
                  stroke="#ffffff" 
                  strokeWidth={isActive ? 2.5 : 1.5}
                />
                <circle r={isActive ? 3.5 : 2.5} fill="#ffffff" />

                {/* Region Label */}
                <text 
                  x="0" 
                  y={node.labelY} 
                  textAnchor="middle" 
                  className={`node-label ${isActive ? 'label-active' : ''}`}
                >
                  {node.name}
                </text>
              </g>
            );
          })}


        </svg>
      </div>

      {/* ── Active Hub Comprehensive Multimodal Breakdown (100% Non-Truncated) ── */}
      <div className="hnc-active-hub-display" key={`${routeIndex}-${nodeIndex}`}>
        
        {/* Active Hub Header */}
        <div className="ah-header-row">
          <div className="ah-title-wrap">
            <span className="ah-badge">ACTIVE HUB ({nodeIndex + 1}/{currentRoute.nodes.length})</span>
            <span className="ah-region-title text-gold">{activeHubInfo.regionName}</span>
          </div>
          <span className="ah-status-pill">
            <span className="live-status-dot"></span>
            {activeHubInfo.status}
          </span>
        </div>

        {/* 1. Sea Ports Row */}
        <div className="ah-multimodal-block">
          <div className="ah-mode-title">
            <Ship size={13} className="mode-icon text-cyan" />
            <span>ACTIVE SEA PORTS & MARINE TERMINALS</span>
          </div>
          <div className="ah-pills-row">
            {activeHubInfo.seaPorts.map((port, pIdx) => (
              <span key={pIdx} className="ah-pill pill-sea">
                ⚓ {port}
              </span>
            ))}
          </div>
        </div>

        {/* 2. Train Rail Routes Row */}
        <div className="ah-multimodal-block">
          <div className="ah-mode-title">
            <Train size={13} className="mode-icon text-amber" />
            <span>ACTIVE TRAIN ROUTES & FREIGHT RAILWAYS</span>
          </div>
          <div className="ah-pills-row">
            {activeHubInfo.trainRoutes.map((rail, rIdx) => (
              <span key={rIdx} className="ah-pill pill-rail">
                🚆 {rail}
              </span>
            ))}
          </div>
        </div>

        {/* 3. Flight Air Cargo Routes Row */}
        <div className="ah-multimodal-block">
          <div className="ah-mode-title">
            <Plane size={13} className="mode-icon text-purple" />
            <span>ACTIVE FLIGHT ROUTES & AIR CARGO HUBS</span>
          </div>
          <div className="ah-pills-row">
            {activeHubInfo.flightRoutes.map((flight, fIdx) => (
              <span key={fIdx} className="ah-pill pill-air">
                ✈️ {flight}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Active Trade Corridor Footer Strip ── */}
      <div className="hnc-stage-strip">
        <div className="hss-header">
          <span className="hss-step">
            CORRIDOR {routeIndex + 1} OF {corridorRoutes.length}: [{currentRoute.tradeType}] {currentRoute.name}
          </span>
          <span className="hss-sub-badge">{currentRoute.sub}</span>
        </div>

        {/* Interactive Corridor Switcher Pills */}
        <div className="hss-route-pills">
          {corridorRoutes.map((route, idx) => (
            <button
              key={route.id}
              type="button"
              className={`hss-pill ${routeIndex === idx ? 'is-active' : ''} ${route.tradeType === 'EXPORT' ? 'pill-export' : 'pill-import'}`}
              onClick={() => {
                setRouteIndex(idx);
                setNodeIndex(0);
              }}
              aria-label={`Switch to [${route.tradeType}] ${route.name}`}
              title={`[${route.tradeType}] ${route.name}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroNetworkAnimation;
