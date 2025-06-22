import React from "react";
import "./index.scss";
import App from "./App.tsx";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ReactDOM from "react-dom/client";
ModuleRegistry.registerModules([AllCommunityModule]);
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.Suspense fallback={<span>Loading...</span>}>
    <App />
  </React.Suspense>
);
