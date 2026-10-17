import { useEffect } from 'react';
import useDocumentTitle from '../../hooks/useDocumentTitle';

/**
 * Enterprise SEO & Structured Data (JSON-LD) Component
 */
export const SEO = ({
  title,
  description,
  canonical,
  schemaType = 'Organization',
  schemaData = null
}) => {
  useDocumentTitle(title, description, canonical);

  useEffect(() => {
    // Generate JSON-LD Schema
    const baseOrganizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'LogisticsService',
      name: 'GACIS Cargo Services',
      alternateName: 'GACIS Global Freight',
      url: 'https://gaciscargoservices.com',
      logo: 'https://gaciscargoservices.com/images/logo.png',
      description: 'Global freight forwarding and multimodal supply chain intelligence bridging the Gulf, Central Asia (CIS), South Asia, and Europe.',
      areaServed: ['United Arab Emirates', 'Kazakhstan', 'Uzbekistan', 'India', 'Malaysia', 'Sri Lanka', 'Germany', 'United Kingdom'],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Freight & Supply Chain Services',
        itemListElement: [
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Air Freight Intelligence' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Ocean Freight & Seaways' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Cross-Border Road Transport' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Intermodal Rail Corridors' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Customs Brokerage & Trade Compliance' } }
        ]
      },
      telephone: '+91 44 4978 9158',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '1st Floor, No. 55, Adhithanar Salai (Formerly Harris Road), Akshaya Plaza, Pudupet',
        addressLocality: 'Chennai',
        addressRegion: 'Tamil Nadu',
        postalCode: '600002',
        addressCountry: 'IN'
      }
    };

    const finalSchema = schemaData || baseOrganizationSchema;

    let script = document.querySelector('#gacis-structured-data');
    if (!script) {
      script = document.createElement('script');
      script.id = 'gacis-structured-data';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(finalSchema);

    return () => {
      // Keep script active or clean up if needed
    };
  }, [schemaData, schemaType]);

  return null;
};

export default SEO;
