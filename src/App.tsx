import { RouterProvider } from "react-router-dom";
import { ApiProvider } from "./context/ApiContext";
import router from "./routers/Route";
import { AuthProvider } from "./context/AuthContext";
import { I18nextProvider } from "react-i18next";
import { ToastProvider } from "./context/ToastContext";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import theme from "./scss/theme";
import i18n from "./i18n";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <I18nextProvider i18n={i18n}>
        <ToastProvider>
          <ApiProvider>
            <AuthProvider>
              <CssBaseline />
              <RouterProvider router={router} />
            </AuthProvider>
          </ApiProvider>
        </ToastProvider>
      </I18nextProvider>
    </ThemeProvider>
  );
}

export default App;
