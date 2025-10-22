import React, { Component, type ReactNode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Lỗi đã được catch bởi ErrorBoundary:", error, errorInfo);
  }

  // render() {
  //   if (this.state.hasError) {
  //     return (
  //       <div
  //         style={{
  //           backgroundColor: "red",
  //           color: "white",
  //           height: "100vh",
  //           display: "flex",
  //           justifyContent: "center",
  //           alignItems: "center",
  //           fontSize: "24px",
  //         }}
  //       >
  //         Đã xảy ra lỗi!
  //       </div>
  //     );
  //   }

  //   return this.props.children;
  // }
}

function RootWrapper() {
  const [isBackendOnline, setIsBackendOnline] = React.useState(true);

  async function checkBackendConnection() {
    try {
      const resBackend = await fetch("http://localhost:3000");
      const resFrontend = await fetch("http://localhost:5173");
      if (!resBackend.ok || !resFrontend.ok) throw new Error();
      setIsBackendOnline(true);
    } catch {
      setIsBackendOnline(false);
    }
  }

  React.useEffect(() => {
    checkBackendConnection();
    const interval = setInterval(checkBackendConnection, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!isBackendOnline) {
    throw new Error("Backend offline");
  }

  return (
    <React.Suspense fallback={<span>Đang tải ứng dụng...</span>}>
      <App />
    </React.Suspense>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <ErrorBoundary>
    <RootWrapper />
  </ErrorBoundary>
);
