import { Outlet } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";
import { Box } from "@mui/material";
import { Header } from "../../common/Header/Header";
import { Loading } from "../../common/Loading/Loading";
import { Footer } from "../../common/Footer/Footer";

const MainLayout = () => {
  const headerRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState<number>(0);
  const [footerHeight, setFooterHeight] = useState<number>(0);

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
    <Box
      className={styles.mainLayout}
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {/* Header cố định */}
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

      {/* Nội dung chính */}
      <Box
        component="main"
        sx={{
          flex: 1,
          paddingTop: `${headerHeight}px`,
          paddingBottom: `${footerHeight}px`,
          width: "100%",
          background:
            "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)", // giống style hero
        }}
      >
        <Outlet />
      </Box>

      {/* Footer */}
      <Footer />

      <Loading />
    </Box>
  );
};

export default MainLayout;
