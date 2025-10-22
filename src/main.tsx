import React, { Component, useEffect, useState, type ReactNode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

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
      throw this.state.error;
    }
    return this.props.children;
  }
}

function RootWrapper() {
  // const [isBackendOnline, setIsBackendOnline] = React.useState(true);
  // async function checkBackendConnection() {
  //   try {
  //     const resBackend = await fetch("http://localhost:3000");
  //     const resFrontend = await fetch("http://localhost:5173");
  //     if (!resBackend.ok || !resFrontend.ok) throw new Error("Server offline");
  //     setIsBackendOnline(true);
  //   } catch {
  //     setIsBackendOnline(false);
  //   }
  // }

  // useEffect(() => {
  //   checkBackendConnection();
  //   const interval = setInterval(checkBackendConnection, 5000);
  //   return () => clearInterval(interval);
  // }, []);

  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        const resBackend = await fetch("http://localhost:3000");
        const resFrontend = await fetch("http://localhost:5173");

        if (!resBackend.ok || !resFrontend.ok) {
          throw new Error("Backend hoặc Frontend offline");
        }
      } catch (err) {
        if (err instanceof Error) setError(err);
        else setError(new Error("Unknown error"));
      }
    };

    checkBackendConnection();
    const interval = setInterval(checkBackendConnection, 5000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    // Throw trong render → React hiển thị red screen
    throw error;
  }

  // if (!isBackendOnline) {
  //   throw new Error("Backend or Frontend offline");
  // }

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
