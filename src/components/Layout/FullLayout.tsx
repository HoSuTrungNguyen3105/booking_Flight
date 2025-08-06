import { Box, Stack } from "@mui/material";
import { Outlet } from "react-router-dom";
import { Header } from "../../common/Header/Header";
import { Footer } from "../../common/Footer/Footer";
import { memo } from "react";

const FullLayout = () => {
  return (
    <Stack direction="column" sx={{ height: "100vh" }}>
      {/* <Header /> */}
      <Box component="main" flexGrow={1} bgcolor="var(--bg-green-md)">
        <Outlet />
      </Box>
      {/* <Footer /> */}
    </Stack>
  );
};

export default memo(FullLayout);
// import { Box } from "@mui/material";
// import { useEffect, useRef, useState } from "react";
// import { Outlet } from "react-router-dom";
// import { Header } from "../../common/Header/Header";
// import styles from "./index.module.scss";
// import { Footer } from "../../common/Footer/Footer";
// import { Loading } from "../../common/Loading/Loading";

// const FullLayout = () => {
//   const headerRef = useRef<HTMLElement>(null);
//   const footerRef = useRef<HTMLElement>(null);
//   const [maxHeight, setMaxHeight] = useState<string>();
//   useEffect(() => {
//     const handleResize = () => {
//       const height =
//         (headerRef.current?.clientHeight ?? 0) +
//         (footerRef.current?.clientHeight ?? 0);
//       setMaxHeight(`calc(100vh - ${height}px)`);
//     };

//     handleResize(); // Gọi khi component vừa mount
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

// useEffect(() => {
//   const height =
//     (headerRef.current?.clientHeight ?? 0) +
//     (footerRef.current?.clientHeight ?? 0);
//   setMaxHeight(height ? `calc(100vh - ${height}px)` : undefined);
// }, [headerRef.current?.clientHeight, footerRef.current?.clientHeight]);
//   return (
//     <>
//       <Box className={styles.mainLayout}>
//         <Header ref={headerRef} />
//         <main className={styles.mainContent} style={{ maxHeight }}>
//           <Box className={styles.contentContainer}>
//             <Outlet />
//           </Box>
//         </main>
//         <Footer ref={footerRef} />
//         <Loading />
//       </Box>
//     </>
//   );
// };

// export default FullLayout;
