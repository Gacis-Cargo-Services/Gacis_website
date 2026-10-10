import { useEffect, useRef, useState } from 'react';
import { Map as LeafletMap, tileLayer, marker as createMarker, icon, divIcon, polyline, LatLngBounds, map as createMap } from 'leaflet/dist/leaflet-src.esm.js';
import 'leaflet/dist/leaflet.css';
import { Plus, Minus, RotateCcw, Compass, Waves, Building2 } from 'lucide-react';
import { primaryHubs, maritimeSeaDomains } from '../../data/locations';
import './RealGeographicMap.css';

// ─── Utility: Smooth curved great-circle arc points ─────────────────────
// `extraBias` shifts the quadratic control point so two arcs can be drawn on
// the same chord as parallel inbound / outbound lanes.
function getCurvedArcPoints(start, end, numPoints = 40, extraBias = 0) {
  const points = [];
  const startLat = start.lat;
  const startLng = start.lng;
  const endLat = end.lat;
  const endLng = end.lng;

  // Midpoint
  const midLat = (startLat + endLat) / 2;
  const midLng = (startLng + endLng) / 2;

  // Distance calculation for proportional curvature
  const dLat = endLat - startLat;
  const dLng = endLng - startLng;
  const dist = Math.sqrt(dLat * dLat + dLng * dLng);
  const curvature = Math.min(dist * 0.14, 5.5) + extraBias;

  // Perpendicular curve offset
  const offsetLat = midLat + (dLng > 0 ? curvature : -curvature);
  const offsetLng = midLng;

  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const lat = (1 - t) * (1 - t) * startLat + 2 * (1 - t) * t * offsetLat + t * t * endLat;
    const lng = (1 - t) * (1 - t) * startLng + 2 * (1 - t) * t * offsetLng + t * t * endLng;
    points.push([lat, lng]);
  }
  return points;
}

// ─── Utility: Great-circle distance in km (haversine) ────────────────────
// Used to build the proximity graph so each port only links to its nearest
// regional neighbours instead of every port in the region.
function haversineKm(a, b) {
  const R = 6371;
  const toRad = (deg) => deg * Math.PI / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) * Math.sin(dLat / 2)
    + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

// ─── Utility: One continuous chain through every port in a region ───────────
// Threads ALL ports into a single ordered path using a greedy nearest-
// neighbour walk, so the result is one connected network: no isolated ports,
// no disconnected segments and no separate two-port loops. Consecutive ports
// are always physical neighbours, which keeps the chain geographically
// sensible and short.
//
// The starting port matters for path quality, so every port is tried as the
// seed and the walk with the shortest total length wins.
function buildRegionalChain(ports) {
  if (ports.length === 0) return [];
  if (ports.length === 1) return [ports[0]];

  let bestPath = null;
  let bestLength = Infinity;

  for (let seed = 0; seed < ports.length; seed++) {
    const remaining = new Set(ports.map((p) => p.name));
    const path = [];
    let current = ports[seed];
    let total = 0;

    remaining.delete(current.name);
    path.push(current);

    while (remaining.size > 0) {
      let nearest = null;
      let nearestKm = Infinity;
      for (let i = 0; i < ports.length; i++) {
        const candidate = ports[i];
        if (!remaining.has(candidate.name)) continue;
        const km = haversineKm(current, candidate);
        if (km < nearestKm) {
          nearestKm = km;
          nearest = candidate;
        }
      }
      if (!nearest) break; // unreachable in practice — same region/CSS guard
      total += nearestKm;
      path.push(nearest);
      remaining.delete(nearest.name);
      current = nearest;
    }

    if (path.length === ports.length && total < bestLength) {
      bestLength = total;
      bestPath = path;
    }
  }

  // Fall back to the data order only if no complete walk was found.
  return bestPath || ports;
}

// ─── Service-port map coordinates ─────────────────────────────────────────────
// Coordinates are map-display coordinates for the service coverage directory.
// They are intentionally kept separate from primary hub data so the existing
// hub/sea network remains unchanged.
const SERVICE_PORT_COORDS = {
  'Shanghai': [31.2304, 121.4737],
  'Ningbo-Zhoushan': [29.8683, 121.5440],
  'Shenzhen — Yantian / Shekou': [22.55, 114.27],
  'Qingdao': [36.0671, 120.3826],
  'Tianjin / Xingang': [39.0, 117.75],
  'Xiamen': [24.4798, 118.0894],
  'Guangzhou / Nansha': [22.62, 113.70],
  'Dalian': [38.9140, 121.6147],
  'Lianyungang': [34.75, 119.15],
  'Rizhao': [35.39, 119.53],
  'Kwai Tsing Container Terminals': [22.33, 114.11],
  'Kaohsiung': [22.61, 120.30],
  'Keelung': [25.13, 121.74],
  'Taichung': [24.22, 120.50],
  'Port of Singapore': [1.2644, 103.82],
  'Port Klang': [3.00, 101.40],
  'Tanjung Pelepas': [1.36, 103.55],
  'Penang': [5.40, 100.35],
  'Johor Port': [1.46, 103.92],
  'Kuantan': [3.97, 103.43],
  'Tanjung Priok / Jakarta': [-6.10, 106.88],
  'Tanjung Perak / Surabaya': [-7.20, 112.75],
  'Belawan / Medan': [3.78, 98.68],
  'Tanjung Emas / Semarang': [-6.95, 110.42],
  'Makassar': [-5.10, 119.43],
  'Busan': [35.08, 129.04],
  'Incheon': [37.46, 126.62],
  'Gwangyang': [34.91, 127.70],
  'Pyeongtaek-Dangjin': [36.98, 126.84],
  'Laem Chabang': [13.08, 100.88],
  'Bangkok Port': [13.71, 100.51],
  'Map Ta Phut': [12.69, 101.15],
  'Songkhla': [7.20, 100.59],
  'Cai Mep-Thi Vai': [10.55, 107.05],
  'Cat Lai / Ho Chi Minh City': [10.77, 106.70],
  'Hai Phong': [20.86, 106.68],
  'Da Nang': [16.05, 108.20],
  'Sihanoukville Autonomous Port': [10.63, 103.50],
  'Phnom Penh Autonomous Port': [11.57, 104.93],
  'Yangon / Thilawa': [16.75, 96.27],
  'Kyaukphyu': [19.43, 93.55],
  'Tokyo': [35.65, 139.78],
  'Yokohama': [35.45, 139.65],
  'Nagoya': [35.08, 136.88],
  'Kobe': [34.68, 135.19],
  'Osaka': [34.65, 135.43],
  'Hakata / Fukuoka': [33.60, 130.40],
  'Felixstowe': [51.96, 1.35],
  'Southampton': [50.90, -1.40],
  'London Gateway': [51.50, 0.55],
  'Liverpool': [53.44, -3.02],
  'Gioia Tauro': [38.43, 15.90],
  'Genoa': [44.40, 8.93],
  'La Spezia': [44.10, 9.82],
  'Trieste': [45.65, 13.77],
  'Livorno': [43.55, 10.31],
  'Hamburg': [53.54, 9.97],
  'Bremerhaven': [53.55, 8.58],
  'Wilhelmshaven': [53.53, 8.14],
  'Le Havre': [49.49, 0.12],
  'Marseille Fos': [43.34, 4.87],
  'Dunkirk': [51.03, 2.38],
  'Nantes-Saint-Nazaire': [47.28, -2.20],
  'Antwerp-Bruges': [51.26, 4.40],
  'Port of Varna': [43.20, 27.92],
  'Port of Burgas': [42.49, 27.47],
  'Rotterdam': [51.95, 4.14],
  'Amsterdam': [52.40, 4.90],
  'Basel Rhine Ports': [47.56, 7.59],
  'Valencia': [39.45, -0.32],
  'Barcelona': [41.35, 2.17],
  'Algeciras': [36.13, -5.43],
  'Vienna Danube Port': [48.20, 16.48],
  'Jebel Ali / Dubai': [25.00, 55.06],
  'Khalifa Port / Abu Dhabi': [24.80, 54.67],
  'Khor Fakkan': [25.34, 56.36],
  'Chennai': [13.08, 80.29],
  'Nhava Sheva / JNPT': [18.95, 72.95],
  'Mundra': [22.74, 69.72],
  'Kolkata / Haldia': [22.00, 88.05],
  'Cochin / Kochi': [9.97, 76.27],
  'Visakhapatnam': [17.69, 83.28],
  // Common connection aliases used by the service directory.
  'Colombo': [6.95, 79.84],
  'Dubai / Jebel Ali': [25.00, 55.06],
  'Singapore': [1.2644, 103.82],
  'Los Angeles / Long Beach': [33.75, -118.25],
  'New York / New Jersey': [40.67, -74.05],
  'Jebel Ali': [25.00, 55.06],
  'Jakarta / Tanjung Priok': [-6.10, 106.88],
  'Tokyo / Yokohama': [35.55, 139.72],
  'Surabaya': [-7.20, 112.75],
  'Sihanoukville': [10.63, 103.50],
  'Chittagong': [22.31, 91.80],
  'Piraeus': [37.94, 23.63],
  'Constanta': [44.17, 28.65],
  'Kandla': [23.03, 70.22],
  'Mombasa': [-4.04, 39.67],
  'Durban': [-29.87, 31.05],
  'Shenzhen / Yantian': [22.55, 114.27],
  'Hong Kong': [22.33, 114.11],
  // ── Philippines ──
  'Manila North Harbour': [14.60, 120.96],
  'Batangas': [13.76, 121.05],
  'Subic Bay': [14.80, 120.28],
  // ── Northern & Baltic Europe ──
  'Port of Gdansk': [54.40, 18.67],
  'Port of Gdynia': [54.53, 18.54],
  'Thessaloniki': [40.64, 22.94],
  'Sines': [37.95, -8.88],
  'Leixões': [41.18, -8.70],
  'Gothenburg': [57.71, 11.97],
  'Helsinki': [60.17, 24.94],
  'HaminaKotka': [60.57, 27.19],
  'Copenhagen / Malmö': [55.71, 12.60],
  'Aarhus': [56.16, 10.21],
  // ── Middle East ──
  'Jeddah Islamic Port': [21.50, 39.17],
  'King Abdulaziz Port / Dammam': [26.42, 50.10],
  'Jubail Commercial Port': [27.03, 49.66],
  'Salalah Port': [17.02, 54.00],
  'Sohar Port': [24.50, 56.62],
  'Hamad Port': [24.60, 51.62],
  'Shuwaikh Port': [29.35, 47.93],
  'Shuaiba Industrial Port': [29.02, 48.14],
  'Khalifa Bin Salman Port': [26.20, 50.60],
  // ── South Asia ──
  'Tuticorin / V.O.C Port': [8.76, 78.13],
  'Mormugao / Goa': [15.40, 73.80],
  'Ennore / Kamarajar': [13.22, 80.32],
  'Mongla': [22.48, 89.60],
  'Karachi / Port Muhammad Bin Qasim': [24.85, 67.00],
  'Gwadar': [25.12, 62.33],
  'Malé Commercial Port': [4.18, 73.51],
  // ── Africa ──
  'Cape Town': [-33.91, 18.42],
  'Port Elizabeth / Gqeberha': [-33.96, 25.63],
  'Apapa / Lagos': [6.44, 3.37],
  'Tin Can Island': [6.44, 3.34],
  'Onne Port / Port Harcourt': [4.72, 7.15],
  'Luanda': [-8.84, 13.23],
  'Dakar': [14.68, -17.43],
  'Dar es Salaam': [-6.82, 39.30],
  'Tema': [5.67, 0.02],
  'Abidjan': [5.28, -4.02],
  'Port Said East': [31.26, 32.30],
  'Alexandria / Damietta': [31.20, 29.90],
  'Tanger Med': [35.90, -5.50],
  'Casablanca': [33.60, -7.63],
  'Djibouti Port': [11.60, 43.13],
  'Maputo Port': [-25.96, 32.57],
  // ── North America ──
  'Seattle / Tacoma': [47.60, -122.34],
  'Houston': [29.73, -95.09],
  'Savannah': [32.08, -81.10],
  'Baltimore': [39.28, -76.58],
  'Miami': [25.78, -80.18],
  'Charleston': [32.78, -79.93],
  'Norfolk / Hampton Roads': [36.94, -76.27],
  'Vancouver': [49.29, -123.11],
  'Prince Rupert': [54.31, -130.32],
  'Montreal': [45.55, -73.55],
  'Halifax': [44.65, -63.58],
  'Manzanillo': [19.05, -104.32],
  'Lázaro Cárdenas': [18.00, -102.19],
  'Veracruz': [19.20, -96.13],
  'Altamira': [22.35, -97.90],
  'Cartagena': [10.40, -75.50],
  'Buenaventura': [3.87, -77.25],
  // ── South America ──
  'Santos': [-23.96, -46.33],
  'Paranaguá': [-25.51, -48.52],
  'Itajaí': [-26.90, -48.65],
  'Navegantes / Itapoá': [-26.90, -48.66],
  'Buenos Aires': [-34.60, -58.37],
  'Rosario': [-32.95, -60.64],
  'Montevideo': [-34.90, -56.20],
  'San Antonio': [-33.60, -71.62],
  'Valparaíso': [-33.05, -71.62],
  'Callao': [-12.05, -77.14],
  'Guayaquil': [-2.19, -79.89],
  // ── Oceania ──
  'Sydney': [-33.86, 151.21],
  'Melbourne': [-37.84, 144.93],
  'Brisbane': [-27.47, 153.03],
  'Fremantle': [-32.06, 115.74],
  'Adelaide': [-34.94, 138.52],
  'Auckland': [-36.84, 174.77],
  'Tauranga': [-37.69, 176.17]
};

const SERVICE_PORT_ALIASES = {
  'Dubai / Jebel Ali': 'Jebel Ali / Dubai',
  'Jebel Ali': 'Jebel Ali / Dubai',
  'Singapore': 'Port of Singapore',
  'Jakarta / Tanjung Priok': 'Tanjung Priok / Jakarta',
  'Tokyo / Yokohama': 'Yokohama',
  'Surabaya': 'Tanjung Perak / Surabaya',
  'Sihanoukville': 'Sihanoukville Autonomous Port',
  'Shenzhen / Yantian': 'Shenzhen — Yantian / Shekou',
  'Hong Kong': 'Kwai Tsing Container Terminals'
};

function resolveServicePortName(name) {
  return SERVICE_PORT_ALIASES[name] || name;
}

export const RealGeographicMap = ({ 
  activeHub, 
  onSelectHub, 
  activeSeaDomain, 
  onSelectSeaDomain,
  viewMode = 'hubs', // 'hubs' | 'seas'
  selectedLaneFilter = 'ALL',
  hoveredLaneId = null,
  servicePortNetwork = [],
  activeServicePort = null,
  onSelectServicePort,
  activeRegion = 'all'
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const hubMarkersRef = useRef({});
  const seaMarkersRef = useRef({});
  const servicePortMarkersRef = useRef({});
  const connectionMarkersRef = useRef({});
  const laneArrowMarkersRef = useRef({});
  const polylineLayersRef = useRef([]);
  const hasInitializedServicePortRef = useRef(false);
  const lastFittedRegionRef = useRef('all');
  const resolveLabelCollisionsRef = useRef(null);

  // Current map zoom drives automatic port-name labelling.
  const [zoomLevel, setZoomLevel] = useState(3);
  const PORT_LABEL_ZOOM = 4.0;

  // ─── Label collision resolution ───────────────────────────────────────────
  // Three kinds of labels can land on the same spot: a hub city that is also a
  // port (Port Klang, Singapore, Hamburg, Durban …), two ports on the same
  // coastline (Lagos/Tin Can Island, Kobe/Osaka, the UAE gateways …), and sea
  // beacons sitting under a port. Every label is measured and nudged to the
  // free side of its pin; only a label with no free side is hidden. Hover and
  // focus always reveal a hidden label, so no name becomes unreachable.
  const resolveLabelCollisions = () => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // 1. Gather every label that is meant to be on screen.
    const owners = [];
    const collect = (markersRef, kind) => {
      Object.entries(markersRef.current).forEach(([key, marker]) => {
        const el = typeof marker.getElement === 'function' ? marker.getElement() : null;
        if (!el || el.offsetParent === null) return; // marker hidden
        const label = kind === 'hub'
          ? el.querySelector('.pin-label-pill')
          : kind === 'sea'
            ? el.querySelector('.sea-label-pill')
            : el.querySelector('.service-port-label');
        if (!label) return;
        // Port names are only on screen when labelled / selected.
        if (kind === 'port'
          && !el.classList.contains('is-service-labeled')
          && !el.classList.contains('is-service-origin')
          && !el.classList.contains('is-service-destination')) return;
        owners.push({ key, el, label, kind });
      });
    };
    collect(hubMarkersRef, 'hub');
    collect(servicePortMarkersRef, 'port');
    collect(seaMarkersRef, 'sea');

    if (owners.length === 0) return;

    // Sea pills sit below their pin by default; everything else sits above.
    const flipClass = (owner) => (
      owner.kind === 'sea' ? 'is-label-above' : 'is-label-below'
    );

    // 2. Clear previous decisions, then measure both sides of every label.
    // Classes are batched with a single forced reflow between passes so this
    // stays cheap even with ~100 labels.
    owners.forEach((o) => {
      o.label.classList.remove('is-label-below', 'is-label-above', 'is-label-collided');
    });
    void document.body.offsetWidth;

    owners.forEach((o) => {
      const r = o.label.getBoundingClientRect();
      o.a = { l: r.left, r: r.right, t: r.top, b: r.bottom };
    });

    owners.forEach((o) => o.label.classList.add(flipClass(o)));
    void document.body.offsetWidth;

    owners.forEach((o) => {
      const r = o.label.getBoundingClientRect();
      o.b = { l: r.left, r: r.right, t: r.top, b: r.bottom };
    });

    owners.forEach((o) => o.label.classList.remove(flipClass(o)));
    void document.body.offsetWidth;

    // 3. Priority: the active selection first, then hubs, then idle labels.
    const rank = (o) => {
      if (o.kind === 'hub') {
        if (o.el.querySelector('.is-origin-pin')) return 60;
        if (o.el.querySelector('.is-destination-pin')) return 55;
        if (o.el.querySelector('.is-region-pin')) return 40;
        return 35;
      }
      if (o.kind === 'port') {
        if (o.el.classList.contains('is-service-origin')) return 50;
        if (o.el.classList.contains('is-service-destination')) return 45;
        return 30;
      }
      return 10; // sea
    };
    owners.sort((x, y) => rank(y) - rank(x) || x.key.localeCompare(y.key));

    const overlaps = (a, b) => (
      a.l < b.r - 1 && a.r > b.l + 1 && a.t < b.b - 1 && a.b > b.t + 1
    );
    const hitsAny = (rect) => placed.some((p) => overlaps(rect, p));

    // 4. Greedily place each label on its default side, else the other side.
    const placed = [];
    owners.forEach((o) => {
      if (!hitsAny(o.a)) {
        placed.push(o.a);
        return;
      }
      if (!hitsAny(o.b)) {
        o.label.classList.add(flipClass(o));
        placed.push(o.b);
        return;
      }
      // No free side — hide, but keep hover/focus revealing it.
      o.label.classList.add('is-label-collided');
    });
  };
  resolveLabelCollisionsRef.current = resolveLabelCollisions;

  const scheduleLabelCollisionCheck = () => {
    requestAnimationFrame(() => {
      const fn = resolveLabelCollisionsRef.current;
      if (fn) fn();
    });
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // Prevent double initialization in React strict mode

    // Cartographic frame spanning Americas, Europe, Middle East, India, Asia
    const initialBounds = [
      [-10.0, -90.0], // SW: Houston / South America / Indian Ocean
      [62.0, 150.0]    // NE: North Sea / Japan / Far East
    ];

    const mapInstance = createMap(mapContainerRef.current, {
      center: [26.0, 50.0],
      zoom: window.innerWidth < 768 ? 2.2 : 3.0,
      minZoom: 1.8,
      maxZoom: 9,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: window.innerWidth >= 768,
      worldCopyJump: true
    });

    mapInstanceRef.current = mapInstance;

    // High-Resolution Tactical Dark Tiles (Esri World Dark Gray Base)
    tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 16,
      attribution: 'Esri, DeLorme, NAVTEQ'
    }).addTo(mapInstance);

    // Reference labels layer
    tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 16,
      attribution: ''
    }).addTo(mapInstance);

    // Initial frame
    mapInstance.fitBounds(initialBounds, {
      padding: window.innerWidth < 768 ? [15, 15] : [30, 30],
      maxZoom: 3.5
    });

    // Track zoom so port names can appear automatically once the user
    // zooms in far enough to read them without overlap.
    setZoomLevel(mapInstance.getZoom());
    mapInstance.on('zoomend', () => {
      setZoomLevel(mapInstance.getZoom());
    });

    // Labels overlap whenever the viewport moves because ports sit close
    // together — re-resolve after pan and zoom settle.
    mapInstance.on('zoomend', scheduleLabelCollisionCheck);
    mapInstance.on('moveend', scheduleLabelCollisionCheck);

    // 1. Initialize Hub Markers with clean icon structures
    primaryHubs.forEach((hub) => {
      const isDubai = hub.id === 'uae-desk';
      const isSelected = activeHub?.id === hub.id;
      
      const customIcon = divIcon({
        className: 'gacis-map-pin-container',
        html: `
          <div class="clean-hub-pin ${isDubai ? 'is-dubai-hq' : ''} ${isSelected ? 'is-origin-pin' : ''}">
            <div class="pin-radar-ring"></div>
            <div class="pin-dot-core"></div>
            <div class="pin-label-pill">
              <span class="plp-flag">${hub.flag}</span>
              <span class="plp-city">${hub.city}</span>
            </div>
          </div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      const hubMarker = createMarker([hub.geo.lat, hub.geo.lng], { 
        icon: customIcon,
        zIndexOffset: isDubai ? 800 : 500
      }).addTo(mapInstance);

      hubMarker.on('click', () => {
        onSelectHub && onSelectHub(hub);
      });

      hubMarkersRef.current[hub.id] = hubMarker;
    });

    // 2. Initialize Sea Domain Beacons
    maritimeSeaDomains.forEach((sea) => {
      const isSelected = activeSeaDomain?.id === sea.id;

      const seaIcon = divIcon({
        className: 'gacis-map-pin-container gacis-sea-pin-container',
        html: `
          <div class="clean-sea-beacon ${isSelected ? 'is-active-sea' : ''}">
            <div class="sea-radar-ring"></div>
            <div class="sea-beacon-dot">⚓</div>
            <div class="sea-label-pill">
              <span class="slp-name">${sea.name}</span>
            </div>
          </div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      const seaMarker = createMarker([sea.geo.lat, sea.geo.lng], { 
        icon: seaIcon,
        zIndexOffset: 350
      }).addTo(mapInstance);

      seaMarker.on('click', () => {
        onSelectSeaDomain && onSelectSeaDomain(sea);
      });

      seaMarkersRef.current[sea.id] = seaMarker;
    });

    // 3. Initialize Global Service Port Markers.
    // These are intentionally lighter than primary hub pins so the map can
    // expose the full port directory without replacing the existing hub UI.
    servicePortNetwork.forEach((country) => {
      country.ports.forEach((port) => {
        const coords = SERVICE_PORT_COORDS[port.name];
        if (!coords) return;

        const portIcon = divIcon({
          className: 'gacis-service-port-container',
          html: `
            <button
              type="button"
              class="service-port-pin"
              aria-label="Open ${port.name} service port"
              title="${port.name} · ${country.country}"
            >
              <span class="service-port-pulse"></span>
              <span class="service-port-core"></span>
              <span class="service-port-label">
                <span class="service-port-flag">${country.flag}</span>
                <span>${port.name}</span>
                <small>${port.code}</small>
              </span>
            </button>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const marker = createMarker(coords, {
          icon: portIcon,
          zIndexOffset: 250
        }).addTo(mapInstance);

        marker.on('click', () => {
          onSelectServicePort && onSelectServicePort({ ...port, country: country.country, countryId: country.id, flag: country.flag, regionId: country.regionId });
        });

        servicePortMarkersRef.current[`${country.id}:${port.name}`] = marker;
      });
    });

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update visibility & appearance of markers based on viewMode, activeHub, and activeSeaDomain
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // 1. Remove existing route polyline layers
    polylineLayersRef.current.forEach(layer => map.removeLayer(layer));
    polylineLayersRef.current = [];

    // 1b. Remove lane arrowheads drawn for the previous view
    Object.values(laneArrowMarkersRef.current).forEach(marker => map.removeLayer(marker));
    laneArrowMarkersRef.current = {};

    // ── Region mode: only the selected region is visible. Hub trade lanes,
    // other regions' hubs/ports and their global routes are all suppressed;
    // only intra-region connections are drawn. ──
    const regionHubs = activeRegion !== 'all'
      ? primaryHubs.filter(h => h.regionId === activeRegion)
      : [];
    const isRegionMode = activeRegion !== 'all' && viewMode === 'hubs';

    if (isRegionMode) {
      // Draw arcs between every pair of hubs in the region
      for (let i = 0; i < regionHubs.length; i++) {
        for (let j = i + 1; j < regionHubs.length; j++) {
          const a = regionHubs[i];
          const b = regionHubs[j];
          const arcPoints = getCurvedArcPoints(a.geo, b.geo);

          const glowLine = polyline(arcPoints, {
            color: '#f59e0b',
            weight: 2.5,
            opacity: 0.70,
            className: 'region-connection-line',
            lineCap: 'round'
          }).addTo(map);

          const flowLine = polyline(arcPoints, {
            color: '#fef08a',
            weight: 1.5,
            opacity: 0.85,
            dashArray: '5, 8',
            className: 'region-connection-flow',
            lineCap: 'round'
          }).addTo(map);

          polylineLayersRef.current.push(glowLine, flowLine);
        }
      }

      // ── Continuous regional chain ─────────────────────────────────────────────
      // Every port in the region is threaded into ONE connected chain ordered
      // geographically (nearest-neighbour walk), so there are no isolated
      // ports, no disconnected segments and no separate two-port loops.
      // Consecutive ports are always physical neighbours, which keeps the
      // chain short and readable instead of a long-haul web.
      const LANE_BIAS = 0.42;

      const regionPorts = [];
      servicePortNetwork
        .filter((c) => c.regionId === activeRegion)
        .forEach((country) => {
          country.ports.forEach((port) => {
            const coords = SERVICE_PORT_COORDS[port.name];
            if (!coords) return;
            regionPorts.push({ name: port.name, lat: coords[0], lng: coords[1] });
          });
        });

      const regionChain = buildRegionalChain(regionPorts);

      // Draws one directional lane plus a bearing arrowhead along it.
      const drawLane = (points, kind) => {
        const isOut = kind === 'out';
        const lineColor = isOut ? '#38bdf8' : '#fbbf24';
        const flowColor = isOut ? '#e0f2fe' : '#fde68a';

        const glow = polyline(points, {
          color: lineColor,
          weight: 2.4,
          opacity: 0.5,
          className: `region-lane region-lane-${kind}`,
          lineCap: 'round'
        }).addTo(map);

        const flow = polyline(points, {
          color: flowColor,
          weight: 2,
          opacity: 1,
          dashArray: '7, 11',
          className: `region-lane-flow region-lane-flow-${kind}`,
          lineCap: 'round'
        }).addTo(map);

        polylineLayersRef.current.push(glow, flow);

        // Arrowhead at the head of the lane, rotated to the local screen angle.
        const idx = Math.floor(points.length * 0.68);
        const at = points[idx];
        const prev = points[Math.max(idx - 1, 0)];
        const next = points[Math.min(idx + 1, points.length - 1)];
        const pPrev = map.latLngToContainerPoint([prev[0], prev[1]]);
        const pNext = map.latLngToContainerPoint([next[0], next[1]]);
        const angle = Math.atan2(pNext.y - pPrev.y, pNext.x - pPrev.x) * 180 / Math.PI + 90;

        const arrowIcon = divIcon({
          className: 'region-lane-arrow',
          html: `<span class="lane-arrow lane-arrow-${kind}" style="transform: rotate(${angle}deg)"></span>`,
          iconSize: [18, 18],
          iconAnchor: [9, 9]
        });

        const arrowMarker = createMarker([at[0], at[1]], {
          icon: arrowIcon,
          interactive: false,
          zIndexOffset: 480
        }).addTo(map);

        const arrowId = `lane-${polylineLayersRef.current.length}-${kind}`;
        laneArrowMarkersRef.current[arrowId] = arrowMarker;
      };

      // Thread the chain: every consecutive pair becomes one outbound lane
      // (leaving the earlier port) and one inbound lane (arriving at it).
      regionChain.forEach((from, index) => {
        const to = regionChain[index + 1];
        if (!to) return;

        const outboundPoints = getCurvedArcPoints(from, to, 34, LANE_BIAS);
        const inboundPoints = getCurvedArcPoints(from, to, 34, -LANE_BIAS).slice().reverse();

        drawLane(outboundPoints, 'out'); // along the chain
        drawLane(inboundPoints, 'in');   // back along the chain
      });

      // Fly the map to the region — only when the region itself changes, so it
      // never fights the hub/port flyTo handlers. Regions that have ports but
      // no operating desk (South America, Oceania) fit to their port chain
      // instead of to hubs, so selecting them still flies the map there.
      const regionChanged = lastFittedRegionRef.current !== activeRegion;
      lastFittedRegionRef.current = activeRegion;
      if (regionChanged && (regionHubs.length > 0 || regionChain.length > 0)) {
        const boundsPoints = regionHubs.length > 0
          ? regionHubs.map(h => [h.geo.lat, h.geo.lng])
          : regionChain.map(p => [p.lat, p.lng]);
        const bounds = new LatLngBounds(boundsPoints);
        map.fitBounds(bounds, { padding: [60, 60], maxZoom: 5, animate: true, duration: 0.6 });
      }
    }

    const activeLanes = activeHub?.connectedTradeLanes || [];
    const connectedDestIds = new Set(activeLanes.map(l => l.destinationId));

    // 2. Draw Clean Origin-to-Destination Trade Lanes (when in Hub mode).
    // Suppressed in region mode so only intra-region connections are visible.
    if (viewMode === 'hubs' && activeHub && activeLanes.length > 0 && !isRegionMode) {
      // Filter lanes if selectedLaneFilter is set
      const lanesToDraw = selectedLaneFilter === 'ALL'
        ? activeLanes
        : activeLanes.filter(l => l.modes?.includes(selectedLaneFilter) || l.primaryMode?.toUpperCase().includes(selectedLaneFilter));

      lanesToDraw.forEach((lane) => {
        const destHub = primaryHubs.find(h => h.id === lane.destinationId);
        if (!destHub) return;

        const arcPoints = getCurvedArcPoints(activeHub.geo, destHub.geo);
        const isHovered = hoveredLaneId === lane.destinationId;

        // Color coding by mode
        const isAir = lane.modes?.includes('AIR') && !lane.modes?.includes('SEA');
        const isRail = lane.modes?.includes('RAIL') || lane.primaryMode?.toLowerCase().includes('rail');
        const laneColor = isAir ? '#38bdf8' : isRail ? '#f59e0b' : '#c8202f';
        const flowColor = isAir ? '#e0f2fe' : isRail ? '#fef08a' : '#ffd700';

        // Base sleek glow line
        const glowLine = polyline(arcPoints, {
          color: laneColor,
          weight: isHovered ? 4.5 : 2.5,
          opacity: isHovered ? 0.95 : 0.65,
          className: `clean-corridor-line ${isHovered ? 'is-highlighted-lane' : ''}`,
          lineCap: 'round'
        }).addTo(map);

        // Subtle moving dash flow
        const flowLine = polyline(arcPoints, {
          color: flowColor,
          weight: isHovered ? 2.5 : 1.5,
          opacity: isHovered ? 1.0 : 0.8,
          dashArray: '6, 8',
          className: 'clean-corridor-flow',
          lineCap: 'round'
        }).addTo(map);

        // Tooltip
        const tooltipHtml = `
          <div class="clean-route-tooltip">
            <div class="crt-header">
              <span class="crt-route">${activeHub.city} ⇄ ${lane.destinationCity}</span>
              <span class="crt-flag">${lane.flag}</span>
            </div>
            <div class="crt-mode-tag">${lane.primaryMode} · ⏱️ ${lane.transitTime}</div>
            <div class="crt-cargo"><strong>Outbound:</strong> ${lane.outboundCargo}</div>
            <div class="crt-cargo"><strong>Inbound:</strong> ${lane.inboundCargo}</div>
          </div>
        `;

        flowLine.bindTooltip(tooltipHtml, {
          sticky: true,
          className: 'clean-tooltip-container'
        });

        flowLine.on('click', () => {
          onSelectHub && onSelectHub(destHub);
        });
        glowLine.on('click', () => {
          onSelectHub && onSelectHub(destHub);
        });

        polylineLayersRef.current.push(glowLine, flowLine);
      });
    }

    // 3. Update Hub Marker Classes & Styles
    primaryHubs.forEach((hub) => {
      const marker = hubMarkersRef.current[hub.id];
      if (!marker) return;

      const isDubai = hub.id === 'uae-desk';
      const isOrigin = activeHub?.id === hub.id;
      const isDestination = connectedDestIds.has(hub.id);
      const isVisibleInMode = viewMode === 'hubs';
      const isInRegion = !isRegionMode || hub.regionId === activeRegion;
      // Outside the selected region, hubs are hidden entirely so only the
      // active region's topology remains on screen.
      const isHiddenByRegion = isRegionMode && !isInRegion;

      const updatedIcon = divIcon({
        className: `gacis-map-pin-container ${!isVisibleInMode ? 'pin-mode-dimmed' : ''} ${isHiddenByRegion ? 'pin-mode-hidden' : ''} ${isRegionMode && isInRegion ? 'pin-region-highlight' : ''}`,
        html: `
          <div class="clean-hub-pin ${isDubai ? 'is-dubai-hq' : ''} ${isOrigin ? 'is-origin-pin' : ''} ${isDestination ? 'is-destination-pin' : ''} ${isRegionMode && isInRegion ? 'is-region-pin' : ''}">
            <div class="pin-radar-ring"></div>
            <div class="pin-dot-core"></div>
            ${isOrigin ? '<span class="origin-status-badge">ORIGIN</span>' : ''}
            <div class="pin-label-pill">
              <span class="plp-flag">${hub.flag}</span>
              <span class="plp-city">${hub.city}</span>
            </div>
          </div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      marker.setIcon(updatedIcon);
      marker.setZIndexOffset(isOrigin ? 1200 : isRegionMode && isInRegion ? 950 : isDestination ? 900 : isDubai ? 750 : 400);
    });

    // 4. Update Global Service Port Markers + active connection routes.
    // The full 152-port directory stays clickable, but only the selected
    // origin and its connected destinations render at full strength —
    // everything else recedes to a small dim dot so it doesn't visually
    // stack on top of the 14 hub pins and each other at low zoom.
    // In region mode, ports outside the selected region are hidden entirely
    // and only intra-region connections are drawn.
    const activeServiceConnections = activeServicePort?.connections || [];
    const activeServiceName = activeServicePort?.name || null;
    const connectedServiceNames = new Set(
      activeServiceConnections.map((name) => resolveServicePortName(name))
    );

    Object.entries(servicePortMarkersRef.current).forEach(([key, marker]) => {
      const [, portName] = key.split(':');
      const canonicalName = resolveServicePortName(portName);
      const isOrigin = canonicalName === resolveServicePortName(activeServiceName || '');
      const isDestination = connectedServiceNames.has(canonicalName);
      // In region mode, only show ports belonging to the selected region; hide all others.
      const countryEntry = servicePortNetwork.find(c => c.ports.some(p => p.name === portName));
      const portEntry = countryEntry?.ports.find(p => p.name === portName);
      const portFlag = countryEntry?.flag || '';
      const portCode = portEntry?.code || '';
      const portRegion = countryEntry?.regionId || null;
      const isInRegion = !isRegionMode || portRegion === activeRegion;
      const isDim = (!isOrigin && !isDestination) || (isRegionMode && !isInRegion);
      const isHiddenInRegion = isRegionMode && !isInRegion;
      // Names are shown for the selected origin and its links, for every port
      // of the active region, and for every port once the user zooms in far
      // enough that labels no longer collide.
      const isLabeled = isOrigin || isDestination || (isRegionMode && isInRegion) || zoomLevel >= PORT_LABEL_ZOOM;

      const updatedPortIcon = divIcon({
        className: `gacis-service-port-container ${viewMode !== 'hubs' ? 'is-service-hidden' : ''} ${isHiddenInRegion ? 'is-service-hidden' : ''} ${isOrigin ? 'is-service-origin' : ''} ${isDestination ? 'is-service-destination' : ''} ${isDim ? 'is-service-dim' : ''} ${isLabeled ? 'is-service-labeled' : ''} ${isRegionMode && isInRegion && !isOrigin ? 'is-service-region' : ''}`,
        html: `
          <button
            type="button"
            class="service-port-pin"
            aria-label="Open ${portName} service port"
            title="${portFlag} ${portName}${portCode ? ' · ' + portCode : ''}"
          >
            <span class="service-port-pulse"></span>
            <span class="service-port-core"></span>
            ${isRegionMode && isInRegion ? `
              <span class="service-port-bearing" aria-hidden="true">
                <span class="spb-sweep"></span>
                <span class="spb-ring"></span>
                <span class="spb-needle"></span>
              </span>
            ` : ''}
            <span class="service-port-label">
              ${portFlag ? `<span class="service-port-flag">${portFlag}</span>` : ''}
              <span class="service-port-name">${portName}</span>
              ${portCode ? `<small class="service-port-code">${portCode}</small>` : ''}
              ${isOrigin ? '<span class="service-port-tag is-origin-tag">ORIGIN</span>' : ''}
              ${isDestination ? '<span class="service-port-tag is-dest-tag">LINKED</span>' : ''}
            </span>
          </button>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });
      marker.setIcon(updatedPortIcon);
      marker.setZIndexOffset(isOrigin ? 1300 : isDestination ? 1000 : isLabeled ? 700 : 150);
    });

    // Remove connection-only markers from the previous selected port.
    Object.values(connectionMarkersRef.current).forEach(marker => map.removeLayer(marker));
    connectionMarkersRef.current = {};

    // Per-port blue connection lines are skipped in region mode: the region
    // mesh already draws every intra-region link, so drawing both would
    // duplicate lines and re-clutter the map.
    if (viewMode === 'hubs' && !isRegionMode && activeServicePort?.name && activeServiceConnections.length > 0) {
      const originCoords = SERVICE_PORT_COORDS[activeServicePort.name];
      if (originCoords) {
        activeServiceConnections.forEach((connection, index) => {
          const canonical = resolveServicePortName(connection);
          const destinationCoords = SERVICE_PORT_COORDS[canonical] || SERVICE_PORT_COORDS[connection];
          if (!destinationCoords) return;

          const arcPoints = getCurvedArcPoints(
            { lat: originCoords[0], lng: originCoords[1] },
            { lat: destinationCoords[0], lng: destinationCoords[1] },
            32
          );

          const routeLine = polyline(arcPoints, {
            color: canonical === resolveServicePortName(activeServicePort.name) ? '#ffd700' : '#38bdf8',
            weight: 2,
            opacity: 0.55,
            dashArray: '5, 9',
            className: 'service-port-connection-line',
            lineCap: 'round'
          }).addTo(map);

          polylineLayersRef.current.push(routeLine);

          // If the destination is not already in the service directory,
          // create a connection-only marker so the route endpoint remains visible.
          const hasDirectoryPort = Object.keys(servicePortMarkersRef.current)
            .some(key => key.endsWith(`:${canonical}`));

          if (!hasDirectoryPort) {
            const externalIcon = divIcon({
              className: 'gacis-service-port-container connection-only',
              html: `
                <button
                  type="button"
                  class="service-port-pin is-external-destination"
                  aria-label="Service destination ${connection}"
                  title="${connection}"
                >
                  <span class="service-port-pulse"></span>
                  <span class="service-port-core"></span>
                  <span class="service-port-label">
                    <span>•</span><span>${connection}</span>
                  </span>
                </button>
              `,
              iconSize: [14, 14],
              iconAnchor: [7, 7]
            });

            const externalMarker = createMarker(destinationCoords, {
              icon: externalIcon,
              zIndexOffset: 850
            }).addTo(map);

            externalMarker.on('click', () => {
              const matching = servicePortNetwork
                .flatMap(country => country.ports.map(port => ({ ...port, country: country.country, countryId: country.id, flag: country.flag, regionId: country.regionId })))
                .find(port => resolveServicePortName(port.name) === canonical);

              if (matching) {
                onSelectServicePort && onSelectServicePort(matching);
              }
            });

            connectionMarkersRef.current[`${connection}-${index}`] = externalMarker;
          }
        });
      }
    }

    // 5. Update Sea Domain Markers
    maritimeSeaDomains.forEach((sea) => {
      const marker = seaMarkersRef.current[sea.id];
      if (!marker) return;

      const isSeaActive = activeSeaDomain?.id === sea.id;
      const isVisibleInMode = viewMode === 'seas';

      const updatedSeaIcon = divIcon({
        className: `gacis-map-pin-container gacis-sea-pin-container ${!isVisibleInMode ? 'pin-mode-hidden' : ''}`,
        html: `
          <div class="clean-sea-beacon ${isSeaActive ? 'is-active-sea' : ''}">
            <div class="sea-radar-ring"></div>
            <div class="sea-beacon-dot">⚓</div>
            <div class="sea-label-pill">
              <span class="slp-name">${sea.name}</span>
            </div>
          </div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      marker.setIcon(updatedSeaIcon);
      marker.setZIndexOffset(isSeaActive ? 1100 : 350);
    });

    // Icons have just been rebuilt — drop any stacked name pills.
    scheduleLabelCollisionCheck();

  }, [activeHub, activeSeaDomain, activeServicePort, servicePortNetwork, viewMode, selectedLaneFilter, hoveredLaneId, onSelectServicePort, activeRegion, zoomLevel]);

  // Smooth flyTo when activeHub changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !activeHub || viewMode !== 'hubs') return;

    map.flyTo([activeHub.geo.lat, activeHub.geo.lng], 4.2, {
      duration: 1.1,
      easeLinearity: 0.25
    });
  }, [activeHub, viewMode]);

  // Smooth flyTo when activeSeaDomain changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !activeSeaDomain || viewMode !== 'seas') return;

    map.flyTo([activeSeaDomain.geo.lat, activeSeaDomain.geo.lng], activeSeaDomain.zoomLevel || 5.0, {
      duration: 1.2,
      easeLinearity: 0.25
    });
  }, [activeSeaDomain, viewMode]);

  // Smooth flyTo when a service port is selected.
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !activeServicePort?.name || viewMode !== 'hubs') return;
    if (!hasInitializedServicePortRef.current) {
      hasInitializedServicePortRef.current = true;
      return;
    }

    const coords = SERVICE_PORT_COORDS[activeServicePort.name];
    if (!coords) return;

    map.flyTo(coords, 4.6, {
      duration: 1.1,
      easeLinearity: 0.25
    });
  }, [activeServicePort, viewMode]);

  // Zoom and frame handlers
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleResetView = () => {
    const initialBounds = [
      [-10.0, -90.0],
      [62.0, 150.0]
    ];
    mapInstanceRef.current?.fitBounds(initialBounds, {
      padding: window.innerWidth < 768 ? [15, 15] : [30, 30],
      animate: true,
      duration: 1.0
    });
  };

  return (
    <div className="real-geographic-map-root">
      {/* Leaflet Map Canvas */}
      <div ref={mapContainerRef} className="leaflet-map-element" />

      {/* Map Control Room Telemetry Overlay */}
      <div className="geo-map-status-overlay">
        <span className="gso-dot"></span>
        <span>
          {viewMode === 'hubs' 
            ? `ACTIVE ORIGIN: ${activeHub?.city?.toUpperCase()} · ${activeHub?.connectedTradeLanes?.length || 0} CONNECTED CORRIDORS`
            : `MARITIME DOMAIN: ${activeSeaDomain?.name?.toUpperCase()}`
          }
        </span>
        {viewMode === 'hubs' && zoomLevel < PORT_LABEL_ZOOM && (
          <span className="gso-hint">ZOOM IN TO NAME ALL 152 PORTS</span>
        )}
      </div>

      {/* GACIS Floating Map Controls */}
      <div className="geo-map-controls">
        <button 
          type="button" 
          className="gmc-btn" 
          onClick={handleZoomIn} 
          aria-label="Zoom in"
          title="Zoom In"
        >
          <Plus size={16} />
        </button>
        <button 
          type="button" 
          className="gmc-btn" 
          onClick={handleZoomOut} 
          aria-label="Zoom out"
          title="Zoom Out"
        >
          <Minus size={16} />
        </button>
        <button 
          type="button" 
          className="gmc-btn reset-btn" 
          onClick={handleResetView} 
          aria-label="Reset Global View"
          title="Reset Global View"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      {/* Floating Tactical Legend */}
      <div className="geo-map-legend">
        {viewMode === 'hubs' ? (
          <>
            <div className="legend-item">
              <span className="legend-dot origin-dot"></span>
              <span>Selected Origin</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot dest-dot"></span>
              <span>Direct Destination</span>
            </div>
            <div className="legend-item">
              <span className="legend-line corridor-line"></span>
              <span>Active Trade Lane</span>
            </div>
          </>
        ) : (
          <>
            <div className="legend-item">
              <span className="legend-dot sea-active-dot"></span>
              <span>Focused Sea Domain</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot sea-beacon-dot-legend">⚓</span>
              <span>Maritime Waterway</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RealGeographicMap;