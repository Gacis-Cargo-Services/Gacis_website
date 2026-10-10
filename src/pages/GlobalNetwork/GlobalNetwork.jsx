import { lazy, Suspense, useState, useEffect } from 'react';
import {
  MapPin, Mail, Building2, Globe2, ArrowRight, Phone, Check,
  Activity, ShieldCheck, Radio, ChevronRight, Waves, Anchor, Navigation, Search
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../../components/Common/SEO';
import LazyVideo from '../../components/Common/LazyVideo';
import { loadLocations } from '../../data/lazyData';
import './GlobalNetwork.css';

const RealGeographicMap = lazy(() => import('../../components/NetworkMap/RealGeographicMap'));

const servicePortNetwork = [
  // ── NORTHEAST ASIA ─────────────────────────────────────────────────────────
  { id: 'CN', country: 'China', flag: '🇨🇳', regionId: 'northeast-asia', scope: 'ALL MAJOR PORTS', ports: [
    { name: 'Shanghai', code: 'CNSHA', connections: ['Ningbo-Zhoushan', 'Qingdao', 'Tianjin / Xingang', 'Busan', 'Kaohsiung', 'Port of Singapore', 'Jebel Ali / Dubai', 'Hamburg', 'Rotterdam', 'Felixstowe', 'Los Angeles / Long Beach', 'New York / New Jersey'] },
    { name: 'Ningbo-Zhoushan', code: 'CNNGB', connections: ['Shanghai', 'Qingdao', 'Busan', 'Port of Singapore', 'Jebel Ali / Dubai', 'Hamburg', 'Rotterdam', 'Los Angeles / Long Beach'] },
    { name: 'Shenzhen — Yantian / Shekou', code: 'CNSZX', connections: ['Shanghai', 'Kwai Tsing Container Terminals', 'Port of Singapore', 'Jebel Ali / Dubai', 'Hamburg', 'Rotterdam', 'Los Angeles / Long Beach', 'New York / New Jersey'] },
    { name: 'Qingdao', code: 'CNTAO', connections: ['Shanghai', 'Ningbo-Zhoushan', 'Busan', 'Port of Singapore', 'Jebel Ali / Dubai', 'Hamburg', 'Rotterdam'] },
    { name: 'Tianjin / Xingang', code: 'CNTSN', connections: ['Shanghai', 'Dalian', 'Busan', 'Port of Singapore', 'Jebel Ali / Dubai', 'Hamburg', 'Rotterdam'] },
    { name: 'Xiamen', code: 'CNXMN', connections: ['Shanghai', 'Port of Singapore', 'Jebel Ali / Dubai', 'Hamburg', 'Rotterdam'] },
    { name: 'Guangzhou / Nansha', code: 'CNCAN', connections: ['Shanghai', 'Shenzhen — Yantian / Shekou', 'Port of Singapore', 'Jebel Ali / Dubai', 'Hamburg', 'Rotterdam'] },
    { name: 'Dalian', code: 'CNDLC', connections: ['Shanghai', 'Tianjin / Xingang', 'Busan', 'Port of Singapore', 'Jebel Ali / Dubai'] },
    { name: 'Lianyungang', code: 'CNLYG', connections: ['Shanghai', 'Qingdao', 'Port of Singapore', 'Jebel Ali / Dubai'] },
    { name: 'Rizhao', code: 'CNRZH', connections: ['Qingdao', 'Shanghai', 'Tianjin / Xingang'] }
  ]},
  { id: 'HK', country: 'Hong Kong', flag: '🇭🇰', regionId: 'northeast-asia', ports: [
    { name: 'Kwai Tsing Container Terminals', code: 'HKHKG', connections: ['Shanghai', 'Shenzhen — Yantian / Shekou', 'Busan', 'Port of Singapore', 'Jebel Ali / Dubai', 'Hamburg', 'Rotterdam', 'Los Angeles / Long Beach'] }
  ]},
  { id: 'TW', country: 'Taiwan', flag: '🇹🇼', regionId: 'northeast-asia', ports: [
    { name: 'Kaohsiung', code: 'TWKHH', connections: ['Shanghai', 'Busan', 'Port of Singapore', 'Jebel Ali / Dubai', 'Hamburg', 'Rotterdam', 'Los Angeles / Long Beach'] },
    { name: 'Keelung', code: 'TWKEL', connections: ['Shanghai', 'Kaohsiung', 'Busan', 'Port of Singapore', 'Los Angeles / Long Beach'] },
    { name: 'Taichung', code: 'TWTXG', connections: ['Kaohsiung', 'Port of Singapore', 'Jebel Ali / Dubai'] }
  ]},
  { id: 'KR', country: 'South Korea', flag: '🇰🇷', regionId: 'northeast-asia', ports: [
    { name: 'Busan', code: 'KRPUS', connections: ['Shanghai', 'Ningbo-Zhoushan', 'Kaohsiung', 'Port of Singapore', 'Jebel Ali / Dubai', 'Hamburg', 'Rotterdam', 'Los Angeles / Long Beach', 'New York / New Jersey'] },
    { name: 'Incheon', code: 'KRINC', connections: ['Busan', 'Shanghai', 'Jebel Ali / Dubai', 'Los Angeles / Long Beach'] },
    { name: 'Gwangyang', code: 'KRKUV', connections: ['Busan', 'Shanghai', 'Jebel Ali / Dubai', 'Los Angeles / Long Beach'] },
    { name: 'Pyeongtaek-Dangjin', code: 'KRPTK', connections: ['Busan', 'Shanghai', 'Jebel Ali / Dubai'] }
  ]},
  { id: 'JP', country: 'Japan', flag: '🇯🇵', regionId: 'northeast-asia', ports: [
    { name: 'Tokyo', code: 'JPTYO', connections: ['Yokohama', 'Busan', 'Shanghai', 'Port of Singapore', 'Jebel Ali / Dubai', 'Hamburg', 'Rotterdam', 'Los Angeles / Long Beach', 'New York / New Jersey'] },
    { name: 'Yokohama', code: 'JPYOK', connections: ['Tokyo', 'Busan', 'Shanghai', 'Port of Singapore', 'Jebel Ali / Dubai', 'Hamburg', 'Los Angeles / Long Beach'] },
    { name: 'Nagoya', code: 'JPNGO', connections: ['Tokyo', 'Busan', 'Shanghai', 'Jebel Ali / Dubai', 'Los Angeles / Long Beach'] },
    { name: 'Kobe', code: 'JPUKB', connections: ['Osaka', 'Busan', 'Shanghai', 'Jebel Ali / Dubai', 'Los Angeles / Long Beach'] },
    { name: 'Osaka', code: 'JPOSA', connections: ['Kobe', 'Busan', 'Shanghai', 'Jebel Ali / Dubai'] },
    { name: 'Hakata / Fukuoka', code: 'JPFUK', connections: ['Busan', 'Shanghai', 'Kobe'] }
  ]},
  // ── SOUTHEAST ASIA ──────────────────────────────────────────────────────────
  { id: 'SG', country: 'Singapore', flag: '🇸🇬', regionId: 'southeast-asia', ports: [
    { name: 'Port of Singapore', code: 'SGSIN', connections: ['Port Klang', 'Tanjung Pelepas', 'Tanjung Priok / Jakarta', 'Laem Chabang', 'Cai Mep-Thi Vai', 'Busan', 'Shanghai', 'Jebel Ali / Dubai', 'Hamburg', 'Rotterdam', 'Felixstowe', 'Los Angeles / Long Beach', 'New York / New Jersey'] }
  ]},
  { id: 'MY', country: 'Malaysia', flag: '🇲🇾', regionId: 'southeast-asia', ports: [
    { name: 'Port Klang', code: 'MYPKG', connections: ['Port of Singapore', 'Tanjung Pelepas', 'Tanjung Priok / Jakarta', 'Jebel Ali / Dubai', 'Hamburg', 'Rotterdam', 'Los Angeles / Long Beach'] },
    { name: 'Tanjung Pelepas', code: 'MYTPP', connections: ['Port of Singapore', 'Port Klang', 'Busan', 'Jebel Ali / Dubai', 'Hamburg', 'Rotterdam', 'Los Angeles / Long Beach'] },
    { name: 'Penang', code: 'MYPEN', connections: ['Port of Singapore', 'Port Klang', 'Jebel Ali / Dubai'] },
    { name: 'Johor Port', code: 'MYJHB', connections: ['Port of Singapore', 'Port Klang'] },
    { name: 'Kuantan', code: 'MYKUA', connections: ['Port of Singapore', 'Port Klang'] }
  ]},
  { id: 'ID', country: 'Indonesia', flag: '🇮🇩', regionId: 'southeast-asia', ports: [
    { name: 'Tanjung Priok / Jakarta', code: 'IDTPP', connections: ['Port of Singapore', 'Port Klang', 'Tanjung Perak / Surabaya', 'Busan', 'Shanghai', 'Jebel Ali / Dubai', 'Hamburg', 'Rotterdam'] },
    { name: 'Tanjung Perak / Surabaya', code: 'IDSUB', connections: ['Tanjung Priok / Jakarta', 'Port of Singapore', 'Port Klang', 'Jebel Ali / Dubai'] },
    { name: 'Belawan / Medan', code: 'IDBLW', connections: ['Port of Singapore', 'Port Klang', 'Jebel Ali / Dubai'] },
    { name: 'Tanjung Emas / Semarang', code: 'IDSRG', connections: ['Tanjung Priok / Jakarta', 'Port of Singapore', 'Port Klang'] },
    { name: 'Makassar', code: 'IDUPG', connections: ['Tanjung Priok / Jakarta', 'Tanjung Perak / Surabaya', 'Port of Singapore'] }
  ]},
  { id: 'TH', country: 'Thailand', flag: '🇹🇭', regionId: 'southeast-asia', ports: [
    { name: 'Laem Chabang', code: 'THLCH', connections: ['Port of Singapore', 'Port Klang', 'Cai Mep-Thi Vai', 'Shanghai', 'Jebel Ali / Dubai', 'Hamburg', 'Los Angeles / Long Beach'] },
    { name: 'Bangkok Port', code: 'THBKK', connections: ['Laem Chabang', 'Port of Singapore', 'Port Klang'] },
    { name: 'Map Ta Phut', code: 'THMTP', connections: ['Laem Chabang', 'Port of Singapore'] },
    { name: 'Songkhla', code: 'THSGZ', connections: ['Port of Singapore', 'Port Klang'] }
  ]},
  { id: 'VN', country: 'Vietnam', flag: '🇻🇳', regionId: 'southeast-asia', ports: [
    { name: 'Cai Mep-Thi Vai', code: 'VNCMT', connections: ['Port of Singapore', 'Port Klang', 'Hai Phong', 'Busan', 'Shanghai', 'Jebel Ali / Dubai', 'Hamburg', 'Rotterdam', 'Los Angeles / Long Beach'] },
    { name: 'Cat Lai / Ho Chi Minh City', code: 'VNSGN', connections: ['Cai Mep-Thi Vai', 'Port of Singapore', 'Port Klang', 'Shanghai'] },
    { name: 'Hai Phong', code: 'VNHPH', connections: ['Cai Mep-Thi Vai', 'Port of Singapore', 'Shanghai', 'Busan', 'Jebel Ali / Dubai'] },
    { name: 'Da Nang', code: 'VNDAD', connections: ['Cai Mep-Thi Vai', 'Port of Singapore', 'Port Klang'] }
  ]},
  { id: 'KH', country: 'Cambodia', flag: '🇰🇭', regionId: 'southeast-asia', ports: [
    { name: 'Sihanoukville Autonomous Port', code: 'KHKOS', connections: ['Port of Singapore', 'Port Klang', 'Jebel Ali / Dubai', 'Shanghai'] },
    { name: 'Phnom Penh Autonomous Port', code: 'KHPPH', connections: ['Sihanoukville Autonomous Port', 'Port of Singapore', 'Port Klang'] }
  ]},
  { id: 'MM', country: 'Myanmar', flag: '🇲🇲', regionId: 'southeast-asia', ports: [
    { name: 'Yangon / Thilawa', code: 'MMRGN', connections: ['Port of Singapore', 'Port Klang', 'Jebel Ali / Dubai'] },
    { name: 'Kyaukphyu', code: 'MMKYP', connections: ['Port of Singapore', 'Colombo'] }
  ]},
  { id: 'PH', country: 'Philippines', flag: '🇵🇭', regionId: 'southeast-asia', ports: [
    { name: 'Manila North Harbour', code: 'PHMNL', connections: ['Port of Singapore', 'Busan', 'Shanghai', 'Port Klang', 'Jebel Ali / Dubai'] },
    { name: 'Batangas', code: 'PHBAT', connections: ['Manila North Harbour', 'Port of Singapore', 'Shanghai'] },
    { name: 'Subic Bay', code: 'PHSBB', connections: ['Manila North Harbour', 'Port of Singapore', 'Busan'] }
  ]},
  // ── EUROPE ──────────────────────────────────────────────────────────────────
  { id: 'GB', country: 'United Kingdom', flag: '🇬🇧', regionId: 'europe', ports: [
    { name: 'Felixstowe', code: 'GBFXT', connections: ['Rotterdam', 'Hamburg', 'Antwerp-Bruges', 'Genoa', 'New York / New Jersey', 'Los Angeles / Long Beach'] },
    { name: 'Southampton', code: 'GBSOU', connections: ['Felixstowe', 'Rotterdam', 'Hamburg', 'Genoa', 'New York / New Jersey'] },
    { name: 'London Gateway', code: 'GBLON', connections: ['Felixstowe', 'Rotterdam', 'Hamburg', 'New York / New Jersey'] },
    { name: 'Liverpool', code: 'GBLIV', connections: ['Felixstowe', 'Rotterdam', 'Hamburg', 'New York / New Jersey'] }
  ]},
  { id: 'IT', country: 'Italy', flag: '🇮🇹', regionId: 'europe', ports: [
    { name: 'Gioia Tauro', code: 'ITGIT', connections: ['Genoa', 'Felixstowe', 'Rotterdam', 'Hamburg', 'Valencia', 'Algeciras'] },
    { name: 'Genoa', code: 'ITGOA', connections: ['Gioia Tauro', 'La Spezia', 'Livorno', 'Hamburg', 'Rotterdam', 'Felixstowe'] },
    { name: 'La Spezia', code: 'ITSPE', connections: ['Genoa', 'Livorno', 'Rotterdam', 'Hamburg'] },
    { name: 'Trieste', code: 'ITTRS', connections: ['Genoa', 'Hamburg', 'Rotterdam', 'Vienna Danube Port'] },
    { name: 'Livorno', code: 'ITLIV', connections: ['Genoa', 'La Spezia', 'Rotterdam'] }
  ]},
  { id: 'DE', country: 'Germany', flag: '🇩🇪', regionId: 'europe', ports: [
    { name: 'Hamburg', code: 'DEHAM', connections: ['Bremerhaven', 'Rotterdam', 'Antwerp-Bruges', 'Felixstowe', 'Genoa', 'New York / New Jersey', 'Los Angeles / Long Beach'] },
    { name: 'Bremerhaven', code: 'DEBRV', connections: ['Hamburg', 'Rotterdam', 'Felixstowe', 'New York / New Jersey'] },
    { name: 'Wilhelmshaven', code: 'DEWVN', connections: ['Hamburg', 'Rotterdam', 'Felixstowe'] }
  ]},
  { id: 'FR', country: 'France', flag: '🇫🇷', regionId: 'europe', ports: [
    { name: 'Le Havre', code: 'FRLEH', connections: ['Rotterdam', 'Hamburg', 'Felixstowe', 'Antwerp-Bruges', 'New York / New Jersey'] },
    { name: 'Marseille Fos', code: 'FRMRS', connections: ['Genoa', 'Gioia Tauro', 'Rotterdam', 'Hamburg', 'Algeciras'] },
    { name: 'Dunkirk', code: 'FRDKK', connections: ['Le Havre', 'Rotterdam', 'Hamburg', 'Felixstowe'] },
    { name: 'Nantes-Saint-Nazaire', code: 'FRNTE', connections: ['Le Havre', 'Rotterdam', 'Hamburg'] }
  ]},
  { id: 'BE', country: 'Belgium', flag: '🇧🇪', regionId: 'europe', ports: [
    { name: 'Antwerp-Bruges', code: 'BEANR', connections: ['Rotterdam', 'Hamburg', 'Felixstowe', 'Genoa', 'New York / New Jersey'] }
  ]},
  { id: 'BG', country: 'Bulgaria', flag: '🇧🇬', regionId: 'europe', ports: [
    { name: 'Port of Varna', code: 'BGVAR', connections: ['Constanta', 'Piraeus', 'Genoa', 'Hamburg', 'Rotterdam'] },
    { name: 'Port of Burgas', code: 'BGBOJ', connections: ['Port of Varna', 'Constanta', 'Piraeus', 'Genoa'] }
  ]},
  { id: 'NL', country: 'Netherlands', flag: '🇳🇱', regionId: 'europe', ports: [
    { name: 'Rotterdam', code: 'NLRTM', connections: ['Antwerp-Bruges', 'Hamburg', 'Felixstowe', 'Genoa', 'New York / New Jersey', 'Los Angeles / Long Beach'] },
    { name: 'Amsterdam', code: 'NLAMS', connections: ['Rotterdam', 'Hamburg', 'Felixstowe'] }
  ]},
  { id: 'CH', country: 'Switzerland', flag: '🇨🇭', regionId: 'europe', ports: [
    { name: 'Basel Rhine Ports', code: 'CHBSL', connections: ['Rotterdam', 'Antwerp-Bruges', 'Hamburg', 'Genoa', 'La Spezia'] }
  ]},
  { id: 'ES', country: 'Spain', flag: '🇪🇸', regionId: 'europe', ports: [
    { name: 'Valencia', code: 'ESVLC', connections: ['Algeciras', 'Barcelona', 'Rotterdam', 'Hamburg', 'Felixstowe', 'Genoa', 'New York / New Jersey'] },
    { name: 'Barcelona', code: 'ESBCN', connections: ['Valencia', 'Algeciras', 'Genoa', 'Rotterdam', 'Hamburg'] },
    { name: 'Algeciras', code: 'ESALG', connections: ['Valencia', 'Barcelona', 'Felixstowe', 'Rotterdam', 'Genoa'] }
  ]},
  { id: 'AT', country: 'Austria', flag: '🇦🇹', regionId: 'europe', ports: [
    { name: 'Vienna Danube Port', code: 'ATVIE', connections: ['Hamburg', 'Rotterdam', 'Antwerp-Bruges', 'Constanta', 'Genoa', 'Trieste'] }
  ]},
  { id: 'PL', country: 'Poland', flag: '🇵🇱', regionId: 'europe', ports: [
    { name: 'Port of Gdansk', code: 'PLGDN', connections: ['Hamburg', 'Rotterdam', 'Felixstowe', 'Antwerp-Bruges'] },
    { name: 'Port of Gdynia', code: 'PLGDY', connections: ['Port of Gdansk', 'Hamburg', 'Rotterdam'] }
  ]},
  { id: 'GR', country: 'Greece', flag: '🇬🇷', regionId: 'europe', ports: [
    { name: 'Piraeus', code: 'GRPIR', connections: ['Genoa', 'Gioia Tauro', 'Valencia', 'Rotterdam', 'Hamburg', 'Port of Varna', 'Constanta'] },
    { name: 'Thessaloniki', code: 'GRTHS', connections: ['Piraeus', 'Constanta', 'Genoa', 'Hamburg'] }
  ]},
  { id: 'RO', country: 'Romania', flag: '🇷🇴', regionId: 'europe', ports: [
    { name: 'Constanta', code: 'ROCOS', connections: ['Port of Varna', 'Port of Burgas', 'Piraeus', 'Genoa', 'Hamburg'] }
  ]},
  { id: 'PT', country: 'Portugal', flag: '🇵🇹', regionId: 'europe', ports: [
    { name: 'Sines', code: 'PTSIN', connections: ['Algeciras', 'Rotterdam', 'Hamburg', 'Felixstowe'] },
    { name: 'Leixões', code: 'PTOPO', connections: ['Sines', 'Algeciras', 'Rotterdam'] }
  ]},
  { id: 'SE', country: 'Sweden', flag: '🇸🇪', regionId: 'europe', ports: [
    { name: 'Gothenburg', code: 'SEGOT', connections: ['Hamburg', 'Rotterdam', 'Felixstowe'] }
  ]},
  { id: 'FI', country: 'Finland', flag: '🇫🇮', regionId: 'europe', ports: [
    { name: 'Helsinki', code: 'FIHEL', connections: ['Gothenburg', 'Hamburg', 'Rotterdam'] },
    { name: 'HaminaKotka', code: 'FIHMK', connections: ['Helsinki', 'Hamburg', 'Rotterdam'] }
  ]},
  { id: 'DK', country: 'Denmark', flag: '🇩🇰', regionId: 'europe', ports: [
    { name: 'Copenhagen / Malmö', code: 'DKCPH', connections: ['Hamburg', 'Rotterdam', 'Gothenburg', 'Felixstowe'] }
  ]},
  // ── MIDDLE EAST ─────────────────────────────────────────────────────────────
  { id: 'AE', country: 'United Arab Emirates', flag: '🇦🇪', regionId: 'middle-east', ports: [
    { name: 'Jebel Ali / Dubai', code: 'AEJEA', connections: ['Khalifa Port / Abu Dhabi', 'Khor Fakkan', 'Salalah Port', 'Hamad Port', 'Chennai', 'Nhava Sheva / JNPT', 'Port of Singapore', 'Shanghai', 'Busan', 'Hamburg', 'Rotterdam', 'Felixstowe', 'Mombasa', 'Los Angeles / Long Beach', 'New York / New Jersey'] },
    { name: 'Khalifa Port / Abu Dhabi', code: 'AEKHL', connections: ['Jebel Ali / Dubai', 'Khor Fakkan', 'Chennai', 'Port of Singapore', 'Hamburg', 'Rotterdam'] },
    { name: 'Khor Fakkan', code: 'AEKLF', connections: ['Jebel Ali / Dubai', 'Khalifa Port / Abu Dhabi', 'Salalah Port', 'Chennai', 'Port of Singapore'] }
  ]},
  { id: 'SA', country: 'Saudi Arabia', flag: '🇸🇦', regionId: 'middle-east', ports: [
    { name: 'Jeddah Islamic Port', code: 'SAJED', connections: ['Jebel Ali / Dubai', 'Salalah Port', 'Djibouti Port', 'Chennai', 'Rotterdam', 'Hamburg'] },
    { name: 'King Abdulaziz Port / Dammam', code: 'SADMM', connections: ['Jebel Ali / Dubai', 'Jeddah Islamic Port', 'Hamad Port', 'Port of Singapore', 'Hamburg'] },
    { name: 'Jubail Commercial Port', code: 'SAJUB', connections: ['Jebel Ali / Dubai', 'Jeddah Islamic Port', 'King Abdulaziz Port / Dammam'] }
  ]},
  { id: 'OM', country: 'Oman', flag: '🇴🇲', regionId: 'middle-east', ports: [
    { name: 'Salalah Port', code: 'OMSLL', connections: ['Jebel Ali / Dubai', 'Jeddah Islamic Port', 'Khor Fakkan', 'Port of Singapore', 'Chennai', 'Hamburg', 'Rotterdam'] },
    { name: 'Sohar Port', code: 'OMSOH', connections: ['Jebel Ali / Dubai', 'Salalah Port', 'Khor Fakkan'] }
  ]},
  { id: 'QA', country: 'Qatar', flag: '🇶🇦', regionId: 'middle-east', ports: [
    { name: 'Hamad Port', code: 'QAHAM', connections: ['Jebel Ali / Dubai', 'King Abdulaziz Port / Dammam', 'Jeddah Islamic Port', 'Chennai', 'Port of Singapore', 'Hamburg', 'Rotterdam'] }
  ]},
  { id: 'KW', country: 'Kuwait', flag: '🇰🇼', regionId: 'middle-east', ports: [
    { name: 'Shuwaikh Port', code: 'KWSWK', connections: ['Jebel Ali / Dubai', 'Hamad Port', 'Jeddah Islamic Port'] },
    { name: 'Shuaiba Industrial Port', code: 'KWSHU', connections: ['Jebel Ali / Dubai', 'Shuwaikh Port'] }
  ]},
  { id: 'BH', country: 'Bahrain', flag: '🇧🇭', regionId: 'middle-east', ports: [
    { name: 'Khalifa Bin Salman Port', code: 'BHKBS', connections: ['Jebel Ali / Dubai', 'King Abdulaziz Port / Dammam', 'Hamad Port', 'Port of Singapore'] }
  ]},
  // ── SOUTH ASIA ──────────────────────────────────────────────────────────────
  { id: 'IN', country: 'India', flag: '🇮🇳', regionId: 'south-asia', ports: [
    { name: 'Chennai', code: 'INMAA', connections: ['Nhava Sheva / JNPT', 'Mundra', 'Kolkata / Haldia', 'Cochin / Kochi', 'Visakhapatnam', 'Tuticorin / V.O.C Port', 'Colombo', 'Port of Singapore', 'Jebel Ali / Dubai', 'Hamburg', 'Rotterdam', 'Los Angeles / Long Beach'] },
    { name: 'Nhava Sheva / JNPT', code: 'INNSA', connections: ['Chennai', 'Mundra', 'Kolkata / Haldia', 'Kandla', 'Colombo', 'Port of Singapore', 'Jebel Ali / Dubai', 'Hamburg', 'Rotterdam', 'Los Angeles / Long Beach', 'New York / New Jersey'] },
    { name: 'Mundra', code: 'INMUN', connections: ['Nhava Sheva / JNPT', 'Chennai', 'Kandla', 'Colombo', 'Port of Singapore', 'Jebel Ali / Dubai', 'Hamburg', 'Rotterdam', 'Los Angeles / Long Beach'] },
    { name: 'Kolkata / Haldia', code: 'INCCU', connections: ['Chennai', 'Nhava Sheva / JNPT', 'Chittagong', 'Port of Singapore', 'Jebel Ali / Dubai', 'Hamburg', 'Rotterdam'] },
    { name: 'Cochin / Kochi', code: 'INCOK', connections: ['Chennai', 'Mundra', 'Colombo', 'Port of Singapore', 'Jebel Ali / Dubai', 'Hamburg', 'Rotterdam'] },
    { name: 'Visakhapatnam', code: 'INVTZ', connections: ['Chennai', 'Kolkata / Haldia', 'Port of Singapore', 'Jebel Ali / Dubai'] },
    { name: 'Kandla', code: 'INKLA', connections: ['Mundra', 'Nhava Sheva / JNPT', 'Jebel Ali / Dubai', 'Port of Singapore'] },
    { name: 'Tuticorin / V.O.C Port', code: 'INTIC', connections: ['Chennai', 'Colombo', 'Cochin / Kochi', 'Jebel Ali / Dubai'] },
    { name: 'Mormugao / Goa', code: 'INMRM', connections: ['Nhava Sheva / JNPT', 'Colombo', 'Port of Singapore'] },
    { name: 'Ennore / Kamarajar', code: 'INENR', connections: ['Chennai', 'Visakhapatnam', 'Colombo'] }
  ]},
  { id: 'LK', country: 'Sri Lanka', flag: '🇱🇰', regionId: 'south-asia', ports: [
    { name: 'Colombo', code: 'LKCMB', connections: ['Chennai', 'Nhava Sheva / JNPT', 'Mundra', 'Cochin / Kochi', 'Port of Singapore', 'Jebel Ali / Dubai', 'Hamburg', 'Rotterdam', 'Los Angeles / Long Beach'] }
  ]},
  { id: 'BD', country: 'Bangladesh', flag: '🇧🇩', regionId: 'south-asia', ports: [
    { name: 'Chittagong', code: 'BDCGP', connections: ['Kolkata / Haldia', 'Chennai', 'Port of Singapore', 'Port Klang', 'Jebel Ali / Dubai', 'Colombo'] },
    { name: 'Mongla', code: 'BDMGL', connections: ['Chittagong', 'Kolkata / Haldia', 'Colombo'] }
  ]},
  { id: 'PK', country: 'Pakistan', flag: '🇵🇰', regionId: 'south-asia', ports: [
    { name: 'Karachi / Port Muhammad Bin Qasim', code: 'PKKHI', connections: ['Mundra', 'Nhava Sheva / JNPT', 'Kandla', 'Jebel Ali / Dubai', 'Port of Singapore', 'Hamburg', 'Rotterdam'] },
    { name: 'Gwadar', code: 'PKGWD', connections: ['Karachi / Port Muhammad Bin Qasim', 'Jebel Ali / Dubai', 'Port of Singapore'] }
  ]},
  { id: 'MV', country: 'Maldives', flag: '🇲🇻', regionId: 'south-asia', ports: [
    { name: 'Malé Commercial Port', code: 'MVMLE', connections: ['Colombo', 'Cochin / Kochi', 'Jebel Ali / Dubai'] }
  ]},
  // ── AFRICA ──────────────────────────────────────────────────────────────────
  { id: 'ZA', country: 'South Africa', flag: '🇿🇦', regionId: 'africa', ports: [
    { name: 'Durban', code: 'ZADDR', connections: ['Cape Town', 'Port Elizabeth / Gqeberha', 'Maputo Port', 'Dar es Salaam', 'Jebel Ali / Dubai', 'Port of Singapore', 'Hamburg', 'Rotterdam'] },
    { name: 'Cape Town', code: 'ZACPT', connections: ['Durban', 'Port Elizabeth / Gqeberha', 'Algeciras', 'Rotterdam', 'Hamburg'] },
    { name: 'Port Elizabeth / Gqeberha', code: 'ZAELS', connections: ['Durban', 'Cape Town', 'Hamburg', 'Rotterdam'] }
  ]},
  { id: 'NG', country: 'Nigeria', flag: '🇳🇬', regionId: 'africa', ports: [
    { name: 'Apapa / Lagos', code: 'NGAPP', connections: ['Tema', 'Abidjan', 'Jebel Ali / Dubai', 'Hamburg', 'Rotterdam', 'New York / New Jersey'] },
    { name: 'Tin Can Island', code: 'NGTIN', connections: ['Apapa / Lagos', 'Tema', 'Jebel Ali / Dubai', 'Hamburg'] },
    { name: 'Onne Port / Port Harcourt', code: 'NGONN', connections: ['Apapa / Lagos', 'Tema', 'Jebel Ali / Dubai'] }
  ]},
  { id: 'AO', country: 'Angola', flag: '🇦🇴', regionId: 'africa', ports: [
    { name: 'Luanda', code: 'AOLAD', connections: ['Cape Town', 'Durban', 'Jebel Ali / Dubai', 'Rotterdam', 'Hamburg'] }
  ]},
  { id: 'SN', country: 'Senegal', flag: '🇸🇳', regionId: 'africa', ports: [
    { name: 'Dakar', code: 'SNDKR', connections: ['Tanger Med', 'Algeciras', 'Rotterdam', 'Hamburg'] }
  ]},
  { id: 'KE', country: 'Kenya', flag: '🇰🇪', regionId: 'africa', ports: [
    { name: 'Mombasa', code: 'KEMBA', connections: ['Dar es Salaam', 'Djibouti Port', 'Durban', 'Jebel Ali / Dubai', 'Port of Singapore', 'Hamburg', 'Rotterdam'] }
  ]},
  { id: 'TZ', country: 'Tanzania', flag: '🇹🇿', regionId: 'africa', ports: [
    { name: 'Dar es Salaam', code: 'TZDAR', connections: ['Mombasa', 'Durban', 'Maputo Port', 'Jebel Ali / Dubai', 'Port of Singapore', 'Hamburg'] }
  ]},
  { id: 'GH', country: 'Ghana', flag: '🇬🇭', regionId: 'africa', ports: [
    { name: 'Tema', code: 'GHTEM', connections: ['Abidjan', 'Apapa / Lagos', 'Jebel Ali / Dubai', 'Hamburg', 'Rotterdam'] }
  ]},
  { id: 'CI', country: 'Ivory Coast', flag: '🇨🇮', regionId: 'africa', ports: [
    { name: 'Abidjan', code: 'CIABJ', connections: ['Tema', 'Apapa / Lagos', 'Jebel Ali / Dubai', 'Hamburg', 'Rotterdam'] }
  ]},
  { id: 'EG', country: 'Egypt', flag: '🇪🇬', regionId: 'africa', ports: [
    { name: 'Port Said East', code: 'EGPSE', connections: ['Alexandria / Damietta', 'Piraeus', 'Gioia Tauro', 'Algeciras', 'Jebel Ali / Dubai', 'Port of Singapore'] },
    { name: 'Alexandria / Damietta', code: 'EGALY', connections: ['Port Said East', 'Tanger Med', 'Piraeus', 'Genoa', 'Hamburg', 'Rotterdam'] }
  ]},
  { id: 'MA', country: 'Morocco', flag: '🇲🇦', regionId: 'africa', ports: [
    { name: 'Tanger Med', code: 'MATNG', connections: ['Algeciras', 'Valencia', 'Rotterdam', 'Hamburg', 'Felixstowe'] },
    { name: 'Casablanca', code: 'MACAS', connections: ['Tanger Med', 'Algeciras', 'Rotterdam', 'Hamburg'] }
  ]},
  { id: 'DJ', country: 'Djibouti', flag: '🇩🇯', regionId: 'africa', ports: [
    { name: 'Djibouti Port', code: 'DJJIB', connections: ['Mombasa', 'Dar es Salaam', 'Jeddah Islamic Port', 'Jebel Ali / Dubai', 'Chennai', 'Port of Singapore'] }
  ]},
  { id: 'MZ', country: 'Mozambique', flag: '🇲🇿', regionId: 'africa', ports: [
    { name: 'Maputo Port', code: 'MZMPM', connections: ['Durban', 'Dar es Salaam', 'Cape Town', 'Jebel Ali / Dubai'] }
  ]},
  // ── NORTH AMERICA ───────────────────────────────────────────────────────────
  { id: 'US', country: 'United States', flag: '🇺🇸', regionId: 'north-america', ports: [
    { name: 'Los Angeles / Long Beach', code: 'USLAX', connections: ['New York / New Jersey', 'Seattle / Tacoma', 'Houston', 'Vancouver', 'Busan', 'Shanghai', 'Port of Singapore', 'Jebel Ali / Dubai', 'Hamburg', 'Rotterdam'] },
    { name: 'New York / New Jersey', code: 'USNYC', connections: ['Los Angeles / Long Beach', 'Houston', 'Savannah', 'Montreal', 'Halifax', 'Busan', 'Shanghai', 'Jebel Ali / Dubai', 'Hamburg', 'Rotterdam', 'Felixstowe'] },
    { name: 'Seattle / Tacoma', code: 'USSEA', connections: ['Los Angeles / Long Beach', 'Vancouver', 'Prince Rupert', 'Busan', 'Shanghai', 'Yokohama'] },
    { name: 'Houston', code: 'USHOU', connections: ['Los Angeles / Long Beach', 'New York / New Jersey', 'Miami', 'Savannah', 'Cartagena', 'Jebel Ali / Dubai', 'Rotterdam', 'Hamburg'] },
    { name: 'Savannah', code: 'USSAV', connections: ['New York / New Jersey', 'Houston', 'Charleston', 'Rotterdam', 'Hamburg', 'Felixstowe'] },
    { name: 'Baltimore', code: 'USBAL', connections: ['New York / New Jersey', 'Savannah', 'Rotterdam', 'Hamburg'] },
    { name: 'Miami', code: 'USMIA', connections: ['New York / New Jersey', 'Houston', 'Cartagena', 'Rotterdam', 'Hamburg'] },
    { name: 'Charleston', code: 'USCHS', connections: ['Savannah', 'New York / New Jersey', 'Rotterdam', 'Hamburg'] },
    { name: 'Norfolk / Hampton Roads', code: 'USNOR', connections: ['New York / New Jersey', 'Savannah', 'Rotterdam', 'Hamburg'] }
  ]},
  { id: 'CA', country: 'Canada', flag: '🇨🇦', regionId: 'north-america', ports: [
    { name: 'Vancouver', code: 'CAVAN', connections: ['Los Angeles / Long Beach', 'Seattle / Tacoma', 'Prince Rupert', 'Busan', 'Shanghai', 'Yokohama'] },
    { name: 'Prince Rupert', code: 'CAPRU', connections: ['Vancouver', 'Los Angeles / Long Beach', 'Busan', 'Shanghai'] },
    { name: 'Montreal', code: 'CAMTR', connections: ['New York / New Jersey', 'Halifax', 'Rotterdam', 'Hamburg', 'Felixstowe'] },
    { name: 'Halifax', code: 'CAHAL', connections: ['Montreal', 'New York / New Jersey', 'Rotterdam', 'Hamburg'] }
  ]},
  { id: 'MX', country: 'Mexico', flag: '🇲🇽', regionId: 'north-america', ports: [
    { name: 'Manzanillo', code: 'MXZLO', connections: ['Los Angeles / Long Beach', 'Lázaro Cárdenas', 'Shanghai', 'Port of Singapore', 'Busan'] },
    { name: 'Lázaro Cárdenas', code: 'MXLZC', connections: ['Manzanillo', 'Los Angeles / Long Beach', 'Shanghai'] },
    { name: 'Veracruz', code: 'MXVER', connections: ['Houston', 'New York / New Jersey', 'Altamira', 'Rotterdam', 'Hamburg'] },
    { name: 'Altamira', code: 'MXATM', connections: ['Veracruz', 'Houston', 'Rotterdam'] }
  ]},
  { id: 'CO', country: 'Colombia', flag: '🇨🇴', regionId: 'south-america', ports: [
    { name: 'Cartagena', code: 'COCTG', connections: ['Houston', 'Miami', 'New York / New Jersey', 'Buenaventura', 'Rotterdam', 'Hamburg'] },
    { name: 'Buenaventura', code: 'COBUN', connections: ['Los Angeles / Long Beach', 'Cartagena', 'Manzanillo', 'Port of Singapore'] }
  ]},
  { id: 'BR', country: 'Brazil', flag: '🇧🇷', regionId: 'south-america', ports: [
    { name: 'Santos', code: 'BRSSZ', connections: ['Paranaguá', 'Itajaí', 'Buenaventura', 'Callao', 'San Antonio', 'Rotterdam', 'Hamburg'] },
    { name: 'Paranaguá', code: 'BRPNG', connections: ['Santos', 'Itajaí', 'Callao', 'San Antonio', 'Rotterdam'] },
    { name: 'Itajaí', code: 'BRITJ', connections: ['Santos', 'Paranaguá', 'Buenos Aires', 'Rotterdam'] },
    { name: 'Navegantes / Itapoá', code: 'BRNVN', connections: ['Itajaí', 'Santos', 'Paranaguá', 'Rotterdam'] }
  ]},
  { id: 'AR', country: 'Argentina', flag: '🇦🇷', regionId: 'south-america', ports: [
    { name: 'Buenos Aires', code: 'ARBUE', connections: ['Itajaí', 'Santos', 'Callao', 'Rotterdam', 'Hamburg'] },
    { name: 'Rosario', code: 'ARROS', connections: ['Buenos Aires', 'Santos', 'Paranaguá', 'Rotterdam'] }
  ]},
  { id: 'CL', country: 'Chile', flag: '🇨🇱', regionId: 'south-america', ports: [
    { name: 'San Antonio', code: 'CLSAI', connections: ['Valparaíso', 'Callao', 'Buenaventura', 'Los Angeles / Long Beach', 'Shanghai'] },
    { name: 'Valparaíso', code: 'CLVAP', connections: ['San Antonio', 'Callao', 'Los Angeles / Long Beach', 'Shanghai'] }
  ]},
  { id: 'PE', country: 'Peru', flag: '🇵🇪', regionId: 'south-america', ports: [
    { name: 'Callao', code: 'PECLL', connections: ['San Antonio', 'Valparaíso', 'Buenaventura', 'Los Angeles / Long Beach', 'Shanghai', 'Busan'] }
  ]},
  { id: 'EC', country: 'Ecuador', flag: '🇪🇨', regionId: 'south-america', ports: [
    { name: 'Guayaquil', code: 'ECGYE', connections: ['Buenaventura', 'Callao', 'Cartagena', 'Los Angeles / Long Beach', 'Rotterdam'] }
  ]},
  { id: 'UY', country: 'Uruguay', flag: '🇺🇾', regionId: 'south-america', ports: [
    { name: 'Montevideo', code: 'UYMVD', connections: ['Buenos Aires', 'Santos', 'Paranaguá', 'Rotterdam', 'Hamburg'] }
  ]},
  // ── OCEANIA ─────────────────────────────────────────────────────────────────
  { id: 'AU', country: 'Australia', flag: '🇦🇺', regionId: 'oceania', ports: [
    { name: 'Sydney', code: 'AUSYD', connections: ['Melbourne', 'Brisbane', 'Auckland', 'Port of Singapore', 'Shanghai', 'Los Angeles / Long Beach'] },
    { name: 'Melbourne', code: 'AUMEL', connections: ['Sydney', 'Adelaide', 'Auckland', 'Port of Singapore', 'Shanghai', 'Los Angeles / Long Beach'] },
    { name: 'Brisbane', code: 'AUBNE', connections: ['Sydney', 'Auckland', 'Port of Singapore', 'Shanghai', 'Busan'] },
    { name: 'Fremantle', code: 'AUFRE', connections: ['Adelaide', 'Melbourne', 'Port of Singapore', 'Tanjung Pelepas', 'Jebel Ali / Dubai', 'Shanghai'] },
    { name: 'Adelaide', code: 'AUADL', connections: ['Melbourne', 'Fremantle', 'Port of Singapore', 'Shanghai'] }
  ]},
  { id: 'NZ', country: 'New Zealand', flag: '🇳🇿', regionId: 'oceania', ports: [
    { name: 'Auckland', code: 'NZAKL', connections: ['Tauranga', 'Sydney', 'Brisbane', 'Port of Singapore', 'Shanghai', 'Los Angeles / Long Beach'] },
    { name: 'Tauranga', code: 'NZTRG', connections: ['Auckland', 'Sydney', 'Port of Singapore', 'Shanghai'] }
  ]}
];

const allServicePorts = servicePortNetwork.flatMap(country =>
  country.ports.map(port => ({ ...port, country: country.country, countryId: country.id, flag: country.flag, regionId: country.regionId }))
);


export const GlobalNetwork = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [activeViewMode, setActiveViewMode] = useState('hubs');
  const [activeHub, setActiveHub] = useState(null);
  const [activeSeaDomain, setActiveSeaDomain] = useState(null);
  const [laneModeFilter, setLaneModeFilter] = useState('ALL');
  const [hubDossierTab, setHubDossierTab] = useState('corridors');
  const [hoveredLaneId, setHoveredLaneId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [serviceCountryId, setServiceCountryId] = useState('IN');
  const [servicePortName, setServicePortName] = useState('Chennai');
  const [servicePortQuery, setServicePortQuery] = useState('');
  const [networkData, setNetworkData] = useState({ primaryHubs: [], maritimeSeaDomains: [], networkRegions: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLocations().then(({ primaryHubs, maritimeSeaDomains, networkRegions }) => {
      setNetworkData({ primaryHubs, maritimeSeaDomains, networkRegions });
      setActiveHub(primaryHubs[0]);
      setActiveSeaDomain(maritimeSeaDomains[0]);
      setIsLoading(false);
    });
  }, []);

  const { primaryHubs, maritimeSeaDomains, networkRegions } = networkData;

  // Filtered Hubs & Seas based on region tab and search query
  const filteredHubs = primaryHubs.filter(h => {
    const matchesRegion = activeTab === 'all' || h.regionId === activeTab;
    const matchesSearch = searchQuery === '' || 
      h.city.toLowerCase().includes(searchQuery.toLowerCase()) || 
      h.country.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  const filteredSeas = maritimeSeaDomains.filter(s => {
    const matchesRegion = activeTab === 'all' || s.regionId === activeTab;
    const matchesSearch = searchQuery === '' || 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.regionName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  const activeTradeLanes = activeHub?.connectedTradeLanes || [];
  const filteredTradeLanes = laneModeFilter === 'ALL'
    ? activeTradeLanes
    : activeTradeLanes.filter(l => (l.modes && l.modes.includes(laneModeFilter)) || (l.primaryMode && l.primaryMode.toUpperCase().includes(laneModeFilter)));
  const activeServiceCountry = servicePortNetwork.find(country => country.id === serviceCountryId) || servicePortNetwork[0];
  const filteredServiceCountries = servicePortNetwork.filter(country =>
    country.country.toLowerCase().includes(servicePortQuery.toLowerCase()) ||
    country.ports.some(port => port.name.toLowerCase().includes(servicePortQuery.toLowerCase()) || port.code.toLowerCase().includes(servicePortQuery.toLowerCase()))
  );
  const activeServicePort = activeServiceCountry?.ports.find(port => port.name === servicePortName) || activeServiceCountry?.ports[0];

  // Regions served purely through the port network (South America, Oceania)
  // have no operating desks, so their selector ribbon shows their service
  // ports instead of going blank.
  const regionPortChips = activeTab === 'all'
    ? []
    : servicePortNetwork
      .filter(country => country.regionId === activeTab)
      .flatMap(country => country.ports.map(port => ({
        ...port,
        country: country.country,
        countryId: country.id,
        flag: country.flag,
        regionId: country.regionId
      })))
      .filter(port => searchQuery === '' ||
        port.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        port.country.toLowerCase().includes(searchQuery.toLowerCase()));
  const ribbonShowsPorts = activeViewMode === 'hubs' && filteredHubs.length === 0 && regionPortChips.length > 0;


  const handleSelectSea = (sea) => {
    setActiveSeaDomain(sea);
    setActiveViewMode('seas');
    const el = document.getElementById('strategic-map-console');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectHub = (hub) => {
    setActiveHub(hub);
    setActiveSeaDomain(null);
    setActiveViewMode('hubs');
    const el = document.getElementById('strategic-map-console');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectServicePort = (port) => {
    if (!port) return;
    setServiceCountryId(port.countryId);
    setServicePortName(port.name);
    setActiveViewMode('hubs');
    setActiveSeaDomain(null);
    // Light up the region the clicked port belongs to so its cluster of
    // ports and internal connections stand out in the region colour.
    if (port.regionId) {
      setActiveTab(port.regionId);
    }
  };

  if (isLoading) {
    return (
      <div className="global-network-page">
        <div className="network-loading" role="status" aria-label="Loading network data">
          <div className="loading-spinner" />
          <p>Loading Global Network...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="global-network-page">
      <SEO 
        title="Global Network & Trade Corridors — Strategic Freight Operations"
        description="Explore GACIS trade lanes across South Asia, the Gulf, Europe, Asia, Africa, the Americas and Oceania, with 170 mapped service ports, multimodal block trains, sea-air routing and regional operating desks."
        canonical="/global-network"
      />

      {/* ─── 01. COMMAND CENTER HERO HEADER ─── */}
      <section className="network-hero-command">
        {/* Video Background - Lazy Loaded */}
        <div className="network-hero-video-wrapper" aria-hidden="true">
          <LazyVideo
            src="/images/video/VEO_%E2%80%94_SECOND_CINEMATIC_SMAR.mp4"
            className="network-hero-video"
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="network-hero-video-overlay" />
        </div>

        <div className="container">
          <div className="nhc-badge-row">
            <span className="nhc-pulse-badge">
              <Radio size={14} className="radar-signal-svg" />
              <span>GACIS OPERATIONAL NETWORK</span>
            </span>
            <span className="nhc-telemetry-tag">
              <Waves size={13} /> INDIA · GULF · CIS · ASIA · EUROPE · AMERICAS
            </span>
          </div>

          <h1 className="nhc-title">Regional Operating Desks & Trade Corridors</h1>
          <p className="nhc-desc">
            Direct freight operations bridging Chennai Corporate Headquarters, Dubai Commercial Desk, and Central Asia intermodal routes with synchronized customs clearance and dedicated scheduled linehauls.
          </p>

          {/* Quick Telemetry KPI Bar */}
          <div className="network-telemetry-bar">
            <div className="ntb-stat">
              <span className="ntb-val text-cyan tabular-nums">{primaryHubs.length}+</span>
              <span className="ntb-label">Operating Desks &amp; Hubs</span>
            </div>
            <div className="ntb-divider" />
            <div className="ntb-stat">
              <span className="ntb-val text-gold tabular-nums">{maritimeSeaDomains.length}+</span>
              <span className="ntb-label">Strategic Maritime Seas</span>
            </div>
            <div className="ntb-divider" />
            <div className="ntb-stat">
              <span className="ntb-val tabular-nums">{allServicePorts.length}+</span>
              <span className="ntb-label">Global Service Ports</span>
            </div>
            <div className="ntb-divider" />
            <div className="ntb-stat">
              <span className="ntb-val tabular-nums">24/7</span>
              <span className="ntb-label">Commercial Coordination</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 02. REGIONAL & MARITIME VIEW CONTROLLER ─── */}
      <section className="section-padding-sm bg-secondary" id="strategic-map-console">
        <div className="container">

          {/* Mode & Region Filters Bar */}
          <div className="network-filter-toolbar">
            
            {/* View Mode Toggle: Continental Hubs vs Sea Domains */}
            <div className="view-mode-switch-group">
              <button
                type="button"
                className={`vms-btn ${activeViewMode === 'hubs' ? 'is-active' : ''}`}
                onClick={() => {
                  setActiveViewMode('hubs');
                  setActiveSeaDomain(null);
                  if (!activeHub) setActiveHub(primaryHubs[0]);
                }}
              >
                <Building2 size={16} />
                <span>{primaryHubs.length} Continental Hubs</span>
              </button>
              <button
                type="button"
                className={`vms-btn ${activeViewMode === 'seas' ? 'is-active' : ''}`}
                onClick={() => {
                  setActiveViewMode('seas');
                  if (!activeSeaDomain) setActiveSeaDomain(maritimeSeaDomains[0]);
                }}
              >
                <Waves size={16} />
                <span>{maritimeSeaDomains.length} Strategic Seas</span>
              </button>
            </div>

            {/* Regional Filter Deck */}
            <div className="corridor-filter-deck">
              <span className="cfd-label">REGION:</span>
              <div className="cfd-buttons">
                {networkRegions.map((reg) => (
                  <button
                    key={reg.id}
                    type="button"
                    className={`cfd-btn ${activeTab === reg.id ? 'is-active' : ''}`}
                    onClick={() => setActiveTab(reg.id)}
                  >
                    {reg.flag && <span className="cfd-flag">{reg.flag}</span>}
                    <span>{reg.label}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* ─── FULL-WIDTH MAP CONSOLE (LANDSCAPE HERO) ─── */}
          <div className="map-landscape-console" id="map-landscape-console">
            
            {/* Map header bar — floated above map */}
            <div className="mlc-topbar">
              <div className="mlc-topbar-left">
                <span className="mcw-eyebrow">
                  {activeViewMode === 'seas' ? 'MARITIME SHIPPING CORRIDORS' : 'INTERMODAL FREIGHT TOPOLOGY'}
                </span>
                <h3 className="mlc-title">
                  {activeViewMode === 'seas' 
                    ? `${activeSeaDomain?.name} — Deepsea Domain View`
                    : `${activeHub?.city} — Connected Global Corridors`
                  }
                </h3>
              </div>
              <div className="mlc-topbar-right">
                <div className="mcw-live-indicator">
                  <span className="live-radar-dot"></span>
                  <span>LIVE FREIGHT NETWORK</span>
                </div>
              </div>
            </div>

            {/* Real Geographic Map — Full Landscape */}
            <Suspense fallback={<div className="geo-map-fallback" aria-hidden="true" />}>
              <RealGeographicMap
                activeHub={activeHub}
                onSelectHub={handleSelectHub}
                activeSeaDomain={activeSeaDomain}
                onSelectSeaDomain={handleSelectSea}
                viewMode={activeViewMode}
                selectedLaneFilter={laneModeFilter}
                hoveredLaneId={hoveredLaneId}
                servicePortNetwork={servicePortNetwork}
                activeServicePort={activeServicePort}
                onSelectServicePort={handleSelectServicePort}
                activeRegion={activeTab}
              />
            </Suspense>

            {/* Hub / Sea Quick-Select Ribbon — overlaid at bottom of map */}
            <div className="map-selector-ribbon">
              <div className="msr-search-wrap">
                <Search size={13} className="msr-search-icon" />
                <input 
                  type="text" 
                  placeholder={activeViewMode === 'seas' ? 'Search sea...' : 'Search hub city...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="msr-search-input"
                />
              </div>

              <div className="msr-chips-track">
                {activeViewMode === 'seas' ? (
                  filteredSeas.length > 0 ? (
                    filteredSeas.map((sea) => {
                      const isSelected = activeSeaDomain?.id === sea.id;
                      return (
                        <button
                          key={sea.id}
                          type="button"
                          className={`msr-chip sea-chip ${isSelected ? 'is-selected' : ''}`}
                          onClick={() => handleSelectSea(sea)}
                        >
                          <span>⚓</span>
                          <span>{sea.name}</span>
                        </button>
                      );
                    })
                  ) : (
                    <span className="msr-empty-note">
                      This region is served by sea domains in its neighbouring markets.
                    </span>
                  )
                ) : ribbonShowsPorts ? (
                  regionPortChips.map((port) => {
                    const isSelected = activeServicePort?.name === port.name;
                    return (
                      <button
                        key={`${port.countryId}:${port.name}`}
                        type="button"
                        className={`msr-chip port-chip ${isSelected ? 'is-selected' : ''}`}
                        onClick={() => handleSelectServicePort(port)}
                      >
                        <span className="msr-chip-flag">{port.flag}</span>
                        <span>{port.name}</span>
                        <small>{port.code}</small>
                      </button>
                    );
                  })
                ) : (
                  filteredHubs.map((hub) => {
                    const isSelected = activeHub?.id === hub.id;
                    return (
                      <button
                        key={hub.id}
                        type="button"
                        className={`msr-chip hub-chip ${isSelected ? 'is-selected' : ''}`}
                        onClick={() => handleSelectHub(hub)}
                      >
                        <span className="msr-chip-flag">{hub.flag}</span>
                        <span>{hub.city}</span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

          </div>

          {/* ─── BELOW-MAP DOSSIER PANEL (Full Width Landscape) ─── */}
          <div className="below-map-dossier-panel">
            {activeViewMode === 'seas' && activeSeaDomain ? (
              /* ─── MARITIME SEA DOMAIN DOSSIER ─── */
              <div className="sea-dossier-landscape" key={activeSeaDomain.id}>
                {/* Sea header */}
                <div className="sdl-header">
                  <div className="sdl-icon-col">
                    <div className="gdc-flag-wrap sea-flag-wrap">
                      <Waves size={26} className="sea-dossier-icon" />
                    </div>
                  </div>
                  <div className="sdl-title-col">
                    <span className="gdc-tier-tag sea-tier-tag">STRATEGIC MARITIME DOMAIN</span>
                    <h2>{activeSeaDomain.name}</h2>
                    <span className="gdc-role-subtitle">{activeSeaDomain.regionName}</span>
                  </div>
                  <div className="sdl-telemetry-col">
                    <div className="gdc-telemetry-grid">
                      <div className="gdc-tele-item">
                        <span className="gti-lbl">TRANSIT RELIABILITY</span>
                        <span className="gti-val text-gold tabular-nums">{activeSeaDomain.transitIndex}</span>
                      </div>
                      <div className="gdc-tele-item">
                        <span className="gti-lbl">AVG SEAWAY TRANSIT</span>
                        <span className="gti-val tabular-nums">{activeSeaDomain.leadTimeAvg}</span>
                      </div>
                      <div className="gdc-tele-item">
                        <span className="gti-lbl">SCOPE 3 EFFICIENCY</span>
                        <span className="gti-val text-cyan" style={{ fontSize: '0.8rem' }}>{activeSeaDomain.scope3Rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="sdl-actions-col">
                    <Link to={`/quote?origin=${encodeURIComponent(activeSeaDomain.name)}`} className="btn btn-primary btn-sm">
                      Calculate Rate <ArrowRight size={14} />
                    </Link>
                    <Link to="/contact" className="btn btn-secondary btn-sm">
                      Maritime Desk
                    </Link>
                  </div>
                </div>

                {/* Sea body */}
                <div className="sdl-body">
                  <div className="sdl-body-col">
                    <div className="gdc-address-box sea-info-box">
                      <div className="gab-row">
                        <Navigation size={15} className="gab-icon" />
                        <div>
                          <strong className="sea-field-label">STRATEGIC CHOKEPOINT:</strong>
                          <p>{activeSeaDomain.strategicChokepoint}</p>
                        </div>
                      </div>
                      <div className="gab-row">
                        <Anchor size={15} className="gab-icon" />
                        <div>
                          <strong className="sea-field-label">PRIMARY CORRIDOR:</strong>
                          <p>{activeSeaDomain.primaryCorridor}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="sdl-body-col">
                    <div className="gdc-capabilities-box">
                      <span className="gcb-lbl">PRIMARY DEEPSEA GATEWAYS & PORTS:</span>
                      <div className="sea-ports-tag-cloud">
                        {activeSeaDomain.keyGateways.map((port, i) => (
                          <span key={i} className="sea-port-pill">
                            <Check size={12} className="spp-check" />
                            <span>{port}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="sdl-body-col">
                    <div className="sea-cargo-profile-box">
                      <span className="gcb-lbl">SPECIALIZED CARGO PROFILE:</span>
                      <p>{activeSeaDomain.cargoFocus}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* ─── HUB DOSSIER — FULL WIDTH LANDSCAPE TABBED ─── */
              <div className="hub-dossier-landscape" key={activeHub.id}>
                
                {/* Hub Identity Row */}
                <div className="hdl-identity-row">
                  <div className="hdl-flag-col">
                    <span className="hdl-flag">{activeHub.flag}</span>
                  </div>
                  <div className="hdl-title-col">
                    <span className="gdc-tier-tag">{activeHub.tier}</span>
                    <h2>{activeHub.city}, {activeHub.country}</h2>
                    <span className="gdc-role-subtitle">{activeHub.role}</span>
                  </div>
                  <div className="hdl-kpi-col">
                    <div className="hdl-kpi-row">
                      <div className="hdl-kpi-item">
                        <span className="gti-lbl">WEEKLY LINEHAULS</span>
                        <span className="gti-val text-gold tabular-nums">{activeHub.stats.weeklyFlights}</span>
                      </div>
                      <div className="hdl-kpi-item">
                        <span className="gti-lbl">OCEAN THROUGHPUT</span>
                        <span className="gti-val tabular-nums">{activeHub.stats.oceanTEU}</span>
                      </div>
                      <div className="hdl-kpi-item">
                        <span className="gti-lbl">BONDED STAGING</span>
                        <span className="gti-val tabular-nums">{activeHub.stats.warehouseSqFt} sq ft</span>
                      </div>
                    </div>
                  </div>
                  <div className="hdl-cta-col">
                    <Link to={`/quote?origin=${encodeURIComponent(activeHub.city)}`} className="btn btn-primary btn-sm">
                      Book via {activeHub.city} <ArrowRight size={13} />
                    </Link>
                    <Link to="/contact" className="btn btn-secondary btn-sm">
                      Contact Desk
                    </Link>
                  </div>
                </div>

                {/* Tab Nav */}
                <div className="dossier-nav-tabs">
                  <button 
                    type="button" 
                    className={`dnt-btn ${hubDossierTab === 'corridors' ? 'is-active' : ''}`}
                    onClick={() => setHubDossierTab('corridors')}
                  >
                    <Navigation size={14} />
                    <span>Trade Corridors ({activeTradeLanes.length})</span>
                  </button>
                  <button 
                    type="button" 
                    className={`dnt-btn ${hubDossierTab === 'operations' ? 'is-active' : ''}`}
                    onClick={() => setHubDossierTab('operations')}
                  >
                    <Activity size={14} />
                    <span>Hub Operations</span>
                  </button>
                  <button 
                    type="button" 
                    className={`dnt-btn ${hubDossierTab === 'contact' ? 'is-active' : ''}`}
                    onClick={() => setHubDossierTab('contact')}
                  >
                    <Building2 size={14} />
                    <span>Desk Details</span>
                  </button>
                </div>

                {/* TAB 1: TRADE CORRIDORS — Horizontal cards grid */}
                {hubDossierTab === 'corridors' && (
                  <div className="dossier-tab-content">
                    <div className="gtls-filter-bar">
                      {[
                        { id: 'ALL', label: `All (${activeTradeLanes.length})` },
                        { id: 'AIR', label: '✈️ Air' },
                        { id: 'SEA', label: '🚢 Ocean' },
                        { id: 'RAIL', label: '🚆 Rail' },
                        { id: 'ROAD', label: '🚛 Road' }
                      ].map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          className={`gtls-filter-btn ${laneModeFilter === m.id ? 'is-active' : ''}`}
                          onClick={() => setLaneModeFilter(m.id)}
                        >
                          {m.label}
                        </button>
                      ))}
                      <span className="gtls-count-hint">{filteredTradeLanes.length} corridors</span>
                    </div>

                    {/* Horizontal scrolling lane cards */}
                    <div className="lanes-horizontal-scroll">
                      {filteredTradeLanes.length === 0 ? (
                        <div className="no-lanes-fallback">
                          <span>No routes match this filter.</span>
                          <button type="button" onClick={() => setLaneModeFilter('ALL')} className="btn btn-secondary btn-sm">
                            Show All
                          </button>
                        </div>
                      ) : (
                        filteredTradeLanes.map((lane, idx) => {
                          const destHub = primaryHubs.find(h => h.id === lane.destinationId);
                          return (
                            <div 
                              className={`lane-card-h ${hoveredLaneId === lane.destinationId ? 'is-card-hovered' : ''}`}
                              key={idx}
                              onMouseEnter={() => setHoveredLaneId(lane.destinationId)}
                              onMouseLeave={() => setHoveredLaneId(null)}
                            >
                              <div className="lch-top">
                                <span className="lch-flag">{lane.flag}</span>
                                <div className="lch-route">
                                  <span className="lch-cities">{activeHub.city} ⇄ {lane.destinationCity}</span>
                                  <span className="lch-mode">{lane.primaryMode}</span>
                                </div>
                                <span className="lch-transit">⏱️ {lane.transitTime}</span>
                              </div>
                              <div className="lch-cargo">
                                <div className="lch-cargo-half outbound">
                                  <span className="gcc-lbl">📤 OUTBOUND:</span>
                                  <p>{lane.outboundCargo}</p>
                                </div>
                                <div className="lch-cargo-half inbound">
                                  <span className="gcc-lbl">📥 INBOUND:</span>
                                  <p>{lane.inboundCargo}</p>
                                </div>
                              </div>
                              <div className="lch-pills">
                                {lane.services.slice(0, 3).map((srv, si) => (
                                  <span key={si} className="gsr-pill">{srv}</span>
                                ))}
                              </div>
                              <div className="lch-actions">
                                {destHub && (
                                  <button
                                    type="button"
                                    className="btn btn-secondary btn-sm lch-pivot"
                                    onClick={() => handleSelectHub(destHub)}
                                  >
                                    Pivot <ArrowRight size={12} />
                                  </button>
                                )}
                                <Link 
                                  to={`/quote?origin=${encodeURIComponent(activeHub.city)}&destination=${encodeURIComponent(lane.destinationCity)}`}
                                  className="btn btn-primary btn-sm"
                                >
                                  Book
                                </Link>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 2: HUB OPERATIONS */}
                {hubDossierTab === 'operations' && (
                  <div className="dossier-tab-content">
                    <div className="ops-landscape-grid">
                      <div className="gdc-capabilities-box ops-col">
                        <span className="gcb-lbl">SPECIALIZED OPERATIONAL CAPABILITIES:</span>
                        <ul className="gcb-list">
                          {activeHub.capabilities.map((cap, i) => (
                            <li key={i}>
                              <Check size={13} className="gcb-check" />
                              <span>{cap}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="hub-ops-note ops-col">
                        <ShieldCheck size={18} className="hon-icon" />
                        <p>
                          All outbound and inbound cargo through <strong>{activeHub.city}</strong> is managed under verified Bill of Lading documentation with synchronized customs dispatch and EDI tracking across all partner terminals.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: DESK DETAILS */}
                {hubDossierTab === 'contact' && (
                  <div className="dossier-tab-content">
                    <div className="contact-landscape-grid">
                      <div className="gdc-address-box contact-col">
                        <div className="gab-row">
                          <MapPin size={16} className="gab-icon" />
                          <div>
                            <strong className="gab-label">OFFICE LOCATION:</strong>
                            <p>{activeHub.address}</p>
                          </div>
                        </div>
                        <div className="gab-row">
                          <Phone size={16} className="gab-icon" />
                          <div>
                            <strong className="gab-label">DIRECT DESK LINE:</strong>
                            <a href={`tel:${activeHub.phone}`}>{activeHub.phone}</a>
                          </div>
                        </div>
                        <div className="gab-row">
                          <Mail size={16} className="gab-icon" />
                          <div>
                            <strong className="gab-label">COMMERCIAL EMAIL:</strong>
                            <a href={`mailto:${activeHub.email}`}>{activeHub.email}</a>
                          </div>
                        </div>
                      </div>
                      <div className="desk-service-hours contact-col">
                        <div className="dsh-item">
                          <span>Jurisdiction:</span>
                          <strong>{activeHub.country} & Allied Region</strong>
                        </div>
                        <div className="dsh-item">
                          <span>Commercial Support:</span>
                          <strong>24/7 Dedicated Logistics Desk</strong>
                        </div>
                        <div className="dsh-item">
                          <span>Freight Modes:</span>
                          <strong>Air · Ocean · Rail · Road · Multimodal</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>

        </div>
      </section>


      {/* ─── 03. COMPLETE 19 MARITIME SEA DOMAINS DIRECTORY ─── */}
      <section className="section-padding bg-primary" id="maritime-domains">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">MARITIME DOMAINS & CHOKEPOINTS</span>
            <h2>19 Strategic Sea Domains & Waterways</h2>
            <p>
              GACIS synchronizes container capacity, breakbulk charters, and short-sea feeders across all 19 vital maritime water basins worldwide.
            </p>
          </div>

          <div className="sea-domains-grid">
            {maritimeSeaDomains.map((sea) => (
              <div 
                key={sea.id}
                className={`sea-domain-card ${activeSeaDomain?.id === sea.id ? 'is-active-sea-card' : ''}`}
                onClick={() => handleSelectSea(sea)}
              >
                <div className="sdc-top">
                  <span className="sdc-icon-badge"><Anchor size={16} /></span>
                  <span className="sdc-region">{sea.regionName}</span>
                </div>

                <h3 className="sdc-title">{sea.name}</h3>
                <p className="sdc-summary">{sea.summary}</p>

                <div className="sdc-specs">
                  <div className="sdc-spec-row">
                    <span className="sdc-lbl">Chokepoint:</span>
                    <span className="sdc-val">{sea.strategicChokepoint}</span>
                  </div>
                  <div className="sdc-spec-row">
                    <span className="sdc-lbl">Key Ports:</span>
                    <span className="sdc-val">{sea.keyGateways.slice(0, 3).join(', ')}</span>
                  </div>
                  <div className="sdc-spec-row">
                    <span className="sdc-lbl">Reliability:</span>
                    <span className="sdc-val text-gold">{sea.transitIndex}</span>
                  </div>
                </div>

                <button 
                  type="button" 
                  className="btn btn-secondary btn-sm sdc-plot-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectSea(sea);
                  }}
                >
                  <span>Plot on Tactical Map</span>
                  <Navigation size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 04. STRATEGIC REGIONAL CONTINENTAL HUBS ─── */}
      <section className="section-padding bg-secondary">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">CONTINENTAL REACH</span>
            <h2>14 Strategic Regional Hubs & Desks</h2>
            <p>
              Direct company-operated commercial headquarters and intermodal freight stations bridging every major global economy.
            </p>
          </div>

          <div className="gateway-cards-grid">
            {primaryHubs.map((hub) => (
              <div 
                className={`gateway-station-card ${activeHub?.id === hub.id && activeViewMode === 'hubs' ? 'active-station' : ''}`}
                key={hub.id}
                onClick={() => handleSelectHub(hub)}
              >
                <div className="gsc-top">
                  <span className="gsc-flag">{hub.flag}</span>
                  <span className="gsc-tier">{hub.tier}</span>
                </div>

                <h3 className="gsc-city">{hub.city}</h3>
                <span className="gsc-country">{hub.country}</span>
                <p className="gsc-role">{hub.role}</p>

                <div className="gsc-specs">
                  <div className="gsc-spec-item">
                    <span>Flights / Trains</span>
                    <strong className="tabular-nums">{hub.stats.weeklyFlights}</strong>
                  </div>
                  <div className="gsc-spec-item">
                    <span>Bonded Warehouse</span>
                    <strong className="tabular-nums">{hub.stats.warehouseSqFt} sq ft</strong>
                  </div>
                </div>

                <button type="button" className="btn btn-secondary btn-sm gsc-inspect-btn">
                  Inspect Hub Details <ChevronRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 05. IMPORT & EXPORT SERVICE COVERAGE ─── */}
      <section className="section-padding bg-primary" data-reveal>
        <div className="container">
          <div className="section-heading section-heading-center">
            <span className="eyebrow">SERVICE COVERAGE</span>
            <h2>Import & Export Service Network</h2>
            <p>
              Comprehensive multimodal logistics solutions connecting India with global markets through strategic partnerships and dedicated corridors.
            </p>
          </div>

          <div className="service-coverage-grid">
            {/* Import Service Card */}
            <div className="service-coverage-card import-card">
              <div className="scc-header">
                <span className="scc-icon">
                  <Navigation size={20} />
                </span>
                <div className="scc-title-row">
                  <span className="scc-eyebrow">IMPORT SERVICE</span>
                  <h3>From Global Origins to India</h3>
                </div>
              </div>
              <div className="scc-content">
                <p className="scc-description">
                  From all destinations around the world — especially <strong>China (ALL PORTS)</strong>, Hong Kong, Taiwan, Singapore, Malaysia, Indonesia, South Korea, Thailand, Vietnam, Cambodia, Myanmar, Japan, U.K., Italy, Germany, France, Belgium, Bulgaria, Netherlands, Switzerland, Spain, Austria & other international ports to India.
                </p>
                <div className="scc-highlights">
                  <span className="scc-tag scc-tag-primary">International → India</span>
                  <span className="scc-tag scc-tag-primary">China — All Ports</span>
                  <span className="scc-tag">Hong Kong · Taiwan · Japan</span>
                  <span className="scc-tag">SE Asia</span>
                  <span className="scc-tag">Europe</span>
                  <span className="scc-tag">Other International Ports</span>
                </div>
              </div>
            </div>

            {/* Export Service Card */}
            <div className="service-coverage-card export-card">
              <div className="scc-header">
                <span className="scc-icon">
                  <Navigation size={20} />
                </span>
                <div className="scc-title-row">
                  <span className="scc-eyebrow">EXPORT SERVICE</span>
                  <h3>From India to Global Destinations</h3>
                </div>
              </div>
              <div className="scc-content">
                <p className="scc-description">
                  Direct / Transshipment service from Indian ports to <strong>Far East / South East Asia</strong>, Middle East countries, Indian sub-continent, CIS, Red Sea, African, European countries, Canada, USEC & USWC, Latin America and Central America.
                </p>
                <div className="scc-highlights">
                  <span className="scc-tag scc-tag-primary export-tag">India → Global</span>
                  <span className="scc-tag">Direct & Transshipment</span>
                  <span className="scc-tag">Far East & SE Asia</span>
                  <span className="scc-tag">Middle East · CIS · Red Sea</span>
                  <span className="scc-tag">Africa & Europe</span>
                  <span className="scc-tag">Canada · USEC · USWC</span>
                  <span className="scc-tag">Latin America · Central America</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 06. GLOBAL PORT-TO-PORT CONNECTIVITY (single, merged directory) ─── */}
      <section className="section-padding bg-secondary" data-reveal>
        <div className="container">
          <div className="section-heading section-heading-center">
            <span className="eyebrow">PORT CONNECTIVITY MATRIX</span>
            <h2>Country → Port → Connected Port Network</h2>
            <p>Search by country, port or UN/LOCODE. Selecting a port exposes its connected destinations on the map above and lets you pivot directly into another port.</p>
          </div>

          <div className="global-port-connectivity" aria-label="Global port connectivity network">
            <div className="gpc-header">
              <div>
                <span className="gpc-eyebrow">PORT-TO-PORT CONNECTIVITY</span>
                <h3>Global Service Ports & Connected Destinations</h3>
              </div>
              <div className="gpc-live-pill"><span className="gpc-live-dot" /> NETWORK DIRECTORY</div>
            </div>

            <div className="gpc-search-row">
              <Search size={14} />
              <input
                type="search"
                value={servicePortQuery}
                onChange={(e) => setServicePortQuery(e.target.value)}
                placeholder="Search country, port or UN/LOCODE..."
                aria-label="Search service countries and ports"
              />
              <span>{allServicePorts.length} mapped ports</span>
            </div>

            <div className="gpc-country-strip">
              {filteredServiceCountries.map(country => (
                <button
                  key={country.id}
                  type="button"
                  className={`gpc-country-btn ${serviceCountryId === country.id ? 'is-active' : ''}`}
                  onClick={() => {
                    setServiceCountryId(country.id);
                    setServicePortName(country.ports[0]?.name || '');
                  }}
                >
                  <span className="gpc-country-flag">{country.flag}</span>
                  <span>{country.country}</span>
                  <small>{country.ports.length} ports</small>
                </button>
              ))}
            </div>

            <div className="gpc-network-body">
              <div className="gpc-port-column">
                <div className="gpc-column-head">
                  <span>01</span>
                  <div><strong>{activeServiceCountry.country}</strong><small>Available service ports</small></div>
                </div>
                <div className="gpc-port-list">
                  {activeServiceCountry.ports.map(port => (
                    <button
                      key={port.name}
                      type="button"
                      className={`gpc-port-btn ${activeServicePort?.name === port.name ? 'is-active' : ''}`}
                      onClick={() => handleSelectServicePort({
                        ...port,
                        country: activeServiceCountry.country,
                        countryId: activeServiceCountry.id,
                        flag: activeServiceCountry.flag,
                        regionId: activeServiceCountry.regionId
                      })}
                    >
                      <span className="gpc-port-icon"><Anchor size={14} /></span>
                      <span className="gpc-port-copy"><strong>{port.name}</strong><small>{port.code}</small></span>
                      <span className="gpc-port-count">{port.connections.length}</span>
                      <ChevronRight size={14} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="gpc-connection-column">
                <div className="gpc-column-head">
                  <span>02</span>
                  <div><strong>{activeServicePort?.name || 'Select a port'}</strong><small>Connected / service destinations</small></div>
                </div>
                {activeServicePort ? (
                  <div className="gpc-connection-grid">
                    {activeServicePort.connections.map((connection, index) => {
                      const connected = allServicePorts.find(port => port.name === connection);
                      return (
                        <button
                          key={`${connection}-${index}`}
                          type="button"
                          className="gpc-connection-card"
                          onClick={() => {
                            if (connected) handleSelectServicePort(connected);
                          }}
                        >
                          <span className="gpc-connection-number">{String(index + 1).padStart(2, '0')}</span>
                          <span className="gpc-connection-main">
                            <strong>{connection}</strong>
                            <small>{connected ? `${connected.flag} ${connected.country} · ${connected.code}` : 'Service destination'}</small>
                          </span>
                          <ArrowRight size={14} />
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="gpc-route-summary">
              <div><span>ORIGIN PORT</span><strong>{activeServicePort?.name || '—'}</strong></div>
              <ArrowRight size={18} />
              <div><span>AVAILABLE SERVICE CONNECTIONS</span><strong>{activeServicePort?.connections.length || 0} destinations</strong></div>
              <span className="gpc-disclaimer">Coverage directory — final routing depends on carrier, sailing, transshipment and operational availability.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 07. GLOBAL AGENCY ALLIANCE BANNER ─── */}
      <section className="section-padding-sm bg-dark" data-reveal>
        <div className="container">
          <div className="global-alliance-inner">
            <Globe2 size={48} className="gai-globe-icon" />
            <div>
              <span className="eyebrow" style={{ color: 'var(--color-brand-gold)' }}>WORLDWIDE REACH</span>
              <h3 style={{ color: '#ffffff', marginBottom: '0.4rem' }}>Allied Agency Representation in 150+ Countries</h3>
              <p style={{ color: 'rgba(255,255,255,0.75)', margin: 0, maxWidth: '680px' }}>
                Beyond our direct regional headquarters in Dubai, Riyadh, Shanghai, Tokyo, Klang, Frankfurt, Rotterdam, Djibouti, Mombasa, Almaty, and Houston, GACIS coordinates vetted carrier alliances and licensed customs brokers across 150+ nations.
              </p>
            </div>
            <Link to="/contact" className="btn btn-primary" style={{ flexShrink: 0 }}>
              Enquire Global Trade Lanes <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default GlobalNetwork;
