import { Box } from "@mui/material";
import clsx from "clsx";
import { Outlet } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { SidebarProvider } from "../../context/SidebarContext";
import { Header } from "../../common/Header/Header";
import { Sidebar } from "../../common/Sidebar/Sidebar";
const HeaderPage = () => {
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
    <>
      <Box>
        <SidebarProvider>
          <Header />
          <main
            className={clsx("flex gap-10 flex-1 overflow-auto")}
            style={{ maxHeight: maxHeight }}
          >
            <Box
              className={clsx(
                "max-w-[400px] w-[300px] overflow-auto static side-bar-menu"
              )}
              sx={{
                position: "relative",
                top: 0,
                maxHeight: maxHeight,
              }}
            >
              <Sidebar />
            </Box>
            <Box className="flex-1 ml-[200px] p-4 header-sidebar">
              <Outlet />
            </Box>
          </main>
        </SidebarProvider>
      </Box>
    </>
  );
};

export default HeaderPage;
