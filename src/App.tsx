import "./App.scss";
import { RouterProvider } from "react-router-dom";
import { ApiProvider } from "./context/ApiContext";
import router from "./routers/Route";
import { AuthProvider } from "./context/AuthContext";
// import { FlightSearchProvider } from "./context/SearchContext";
import { I18nextProvider } from "react-i18next";
import "./i18n";
import i18n from "./i18n";
import { ToastProvider } from "./context/ToastContext";
function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <ToastProvider>
        <ApiProvider>
          <AuthProvider>
            {/* <FlightSearchProvider> */}
            <RouterProvider router={router} />
            {/* </FlightSearchProvider> */}
          </AuthProvider>
        </ApiProvider>
      </ToastProvider>
    </I18nextProvider>
  );
}

export default App;
