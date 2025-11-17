import { Outlet } from "react-router-dom";
import { memo, useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import { Header } from "../../common/Header/Header";
import { Loading } from "../../common/Loading/Loading";
import { Footer } from "../../common/Footer/Footer";
import ScrollToTop from "../../context/use[custom]/useScrollToTop";

const MainLayout = () => {
  const headerRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);

  useEffect(() => {
    const updateHeights = () => {
      setHeaderHeight(headerRef.current?.clientHeight ?? 0);
      setFooterHeight(footerRef.current?.clientHeight ?? 0);
    };

    updateHeights();
    window.addEventListener("resize", updateHeights);
    return () => window.removeEventListener("resize", updateHeights);
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Box
        ref={headerRef}
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: "#fff",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <Header />
      </Box>

      {/* Scroll To Top */}
      <ScrollToTop />

      <Box
        component="main"
        sx={{
          flex: 1,
          pt: `${headerHeight}px`,
          pb: `${footerHeight}px`,
          width: "100%",
        }}
      >
        <Outlet />
      </Box>

      <Box ref={footerRef}>
        <Footer />
      </Box>

      <Loading />
    </Box>
  );
};

export default memo(MainLayout);
