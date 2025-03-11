import React, { useState } from 'react';

import { Box } from '@razorpay/blade/components';
import { Outlet } from 'react-router-dom';
import Footer from 'src/components/Dashboard/Footer/Footer';
import Header from 'src/components/Dashboard/Header/Header';
import SideNavBar from 'src/components/Dashboard/Sidebar/Sidebar';
import LoadingOverlay from 'src/components/Generic/LoadingOverlay/LoadingOverlay';
import { useLanguageContext } from 'src/context/languagesContext';
import { useMobile } from 'src/hooks/useMobile';

const DashboardLayout = () => {
  const { loading } = useLanguageContext();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleMobileNav = () => setIsMobileOpen(!isMobileOpen);

  const isMobile = useMobile();

  return (
    <>
      <Box
        backgroundColor="surface.background.gray.subtle"
        height="100vh"
        display="flex"
        flexDirection="column"
        overflowX="auto"
      >
        <Header toggleMobileNav={toggleMobileNav} />
        <Box display="flex" flex="1">
          <SideNavBar
            toggleMobileNav={toggleMobileNav}
            isMobileOpen={isMobileOpen}
          />
          <Box
            marginLeft={isMobile ? 'spacing.0' : '264px'}
            width="100%"
            display="flex"
            flexDirection="column"
          >
            <Box padding="spacing.7" flex="1" position="relative">
              <Outlet />
            </Box>
            <Footer />
          </Box>
        </Box>
      </Box>
      {loading ? <LoadingOverlay /> : null}
    </>
  );
};

export default DashboardLayout;
