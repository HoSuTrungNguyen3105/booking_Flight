import React, { Component, type ReactNode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import theme from "./scss/theme";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Lỗi đã được catch bởi ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Đã xảy ra lỗi!</h1>
          <pre>{this.state.error?.stack}</pre>
        </div>
      );
    }

    return this.props.children;
  }
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

  // React.useEffect(() => {
  //   checkBackendConnection();
  //   const interval = setInterval(checkBackendConnection, 5000);
  //   return () => clearInterval(interval);
  // }, []);

  if (!isBackendOnline) {
    throw new Error("Server or client is offline");
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
