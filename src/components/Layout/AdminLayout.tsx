// import { Box, Typography } from "@mui/material";
// import SidebarAdmin from "./SidebarAdmin";
// import { Outlet } from "react-router-dom";
// import { Loading } from "../../common/Loading/Loading";
// import { useAuth } from "../../context/AuthContext";

// const AdminLayout: React.FC = () => {
//   const { isAuthenticated } = useAuth();
//   if (!isAuthenticated) {
//     return (
//       <Typography>
//         Xin chào, bạn chưa đăng nhập nên không có quyền truy cập trang này.
//       </Typography>
//     );
//   }

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         width: "100vw",
//         height: "100vh",
//         overflow: "hidden",
//       }}
//     >
//       <Box sx={{ width: 240, flexShrink: 0 }}>
//         <SidebarAdmin />
//       </Box>
//       <Box
//         component="main"
//         sx={{
//           flexGrow: 1,
//           overflow: "auto",
//           padding: 0,
//           maxWidth: "100%",
//           height: "100vh",
//           boxSizing: "border-box",
//         }}
//       >
//         <Outlet />
//       </Box>
//       <Loading />
//     </Box>
//   );
// };

// export default AdminLayout;
