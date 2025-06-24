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
  const [maxHeight, setMaxHeight] = useState<string>();

  useEffect(() => {
    const height =
      (headerRef.current?.clientHeight ?? 0) +
      (footerRef.current?.clientHeight ?? 0);
    setMaxHeight(height ? `calc(100vh - ${height}px)` : undefined);
  }, [headerRef.current?.clientHeight, footerRef.current?.clientHeight]);

  return (
    <Box className={styles.mainLayout}>
      <SidebarProvider>
        <Header ref={headerRef} />
        <main className={styles.mainContent}>
          <Box className={styles.sidebarContainer}>
            <Sidebar />
          </Box>
          <Box className={styles.contentContainer}>
            <Outlet />
          </Box>
        </main>
      </SidebarProvider>
      <Footer ref={footerRef} />
      <Loading />
    </Box>
  );
};

export default MainLayout;
