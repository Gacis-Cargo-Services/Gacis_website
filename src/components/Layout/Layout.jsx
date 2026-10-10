import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import BackToTop from '../Common/BackToTop';
import RouteFallback from '../Common/RouteFallback';
import { useGlobalReveal } from '../../hooks/useGlobalReveal';
import './Layout.css';

const Layout = () => {
  const { pathname } = useLocation();

  // Activates every .reveal / .fade-up element in the current page —
  // one shared observer for the whole app, re-scanned per route.
  useGlobalReveal();

  return (
    <div className="layout-root">
      <Header />
      <div className="main-viewport">
        <main id="main-content" className="main-content">
          {/* Keyed on pathname so the fade-in replays on every navigation */}
          <div className="route-fade-wrap" key={pathname}>
            <Suspense fallback={<RouteFallback />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
        <Footer />
      </div>
      <BackToTop />
    </div>
  );
};

export default Layout;
