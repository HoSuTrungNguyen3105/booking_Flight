import React from "react";
import "./index.scss";
import App from "./App.tsx";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
import { ClerkProvider } from "@clerk/clerk-react";
import "bootstrap/dist/css/bootstrap.min.css";
import ReactDOM from "react-dom/client";
ModuleRegistry.registerModules([AllCommunityModule]);
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

root.render(
  <React.Suspense fallback={<span>Loading...</span>}>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <App />
    </ClerkProvider>
  </React.Suspense>
);
