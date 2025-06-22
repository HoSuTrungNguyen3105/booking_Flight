import "./App.scss";
import { RouterProvider } from "react-router-dom";
import { ApiProvider } from "./context/ApiContext";
import router from "./routers/Route";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext";
import { FlightSearchProvider } from "./context/SearchContext";
function App() {
  return (
    <ApiProvider>
      <AuthProvider>
        <FlightSearchProvider>
          <ToastContainer />
          <RouterProvider router={router} />
        </FlightSearchProvider>
      </AuthProvider>
    </ApiProvider>
  );
}

export default App;
