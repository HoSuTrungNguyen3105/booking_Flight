import { Outlet } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";
import { Box } from "@mui/material";
import { SidebarProvider } from "../../context/SidebarContext";
import { Header } from "../../common/Header/Header";
import { Sidebar } from "../../common/Sidebar/Sidebar";
import { Loading } from "../../common/Loading/Loading";
import { Footer } from "../../common/Footer/Footer";

const MainLayout = () => {
  const headerRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState<number>(0);
  const [footerHeight, setFooterHeight] = useState<number>(0);

  useEffect(() => {
    const updateHeights = () => {
      const h = headerRef.current?.clientHeight ?? 0;
      const f = footerRef.current?.clientHeight ?? 0;
      setHeaderHeight(h);
      setFooterHeight(f);
    };

    updateHeights();
    window.addEventListener("resize", updateHeights);
    return () => window.removeEventListener("resize", updateHeights);
  }, []);

  return (
    <Box className={styles.mainLayout}>
      <SidebarProvider>
        {/* Fixed Header */}
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

        {/* Main Content, push down by header height */}
        <main
          className={styles.mainContent}
          style={{ paddingTop: headerHeight }}
        >
          <Box className={styles.sidebarContainer}>
            <Sidebar />
          </Box>
          <Box
            className={styles.contentContainer}
            style={{
              maxHeight: `calc(100vh - ${headerHeight + footerHeight}px)`,
            }}
          >
            <Outlet />
          </Box>
        </main>
      </SidebarProvider>

      {/* Footer */}
      <Footer ref={footerRef} />
      <Loading />
    </Box>
  );
};

export default MainLayout;
