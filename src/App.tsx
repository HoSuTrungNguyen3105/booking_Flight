// import "./App.scss";
import { RouterProvider } from "react-router-dom";
import { ApiProvider } from "./context/ApiContext";
import router from "./routers/Route";
import { AuthProvider } from "./context/AuthContext";
// import { FlightSearchProvider } from "./context/SearchContext";
import { I18nextProvider } from "react-i18next";
import "./i18n";
import i18n from "./i18n";
import { ToastProvider } from "./context/ToastContext";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import theme from "./scss/theme";

// const theme = createTheme({
//   palette: {
//     text: {
//       primary: "#145A32", // màu chữ
//     },
//   },
//   components: {
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           backgroundColor: "#D4EFDF", // ✅ nền cho button
//           color: "#145A32",
//           "&:hover": {
//             backgroundColor: "#A9DFBF", // hover màu khác chút
//           },
//         },
//       },
//     },
//     MuiInputBase: {
//       styleOverrides: {
//         root: {
//           backgroundColor: "#E8F8F5", // ✅ nền cho input (TextField, Input)
//         },
//       },
//     },
//   },
// });
function App() {
  return (
    <ThemeProvider theme={theme}>
      <I18nextProvider i18n={i18n}>
        <ToastProvider>
          <ApiProvider>
            <AuthProvider>
              <CssBaseline />
              {/* <FlightSearchProvider> */}
              <RouterProvider router={router} />
              {/* </FlightSearchProvider> */}
            </AuthProvider>
          </ApiProvider>
        </ToastProvider>
      </I18nextProvider>
    </ThemeProvider>
  );
}

export default App;
