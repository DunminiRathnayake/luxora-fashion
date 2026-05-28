import React from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an uncaught exception:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex-grow flex flex-col items-center justify-center min-h-[400px] px-6 py-12 text-center bg-[#faf9f6] text-black border border-neutral-100 rounded-sm m-4 space-y-6">
          <div className="bg-red-50 p-4 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          
          <div className="space-y-2 max-w-md">
            <span className="text-[9px] tracking-[4px] uppercase text-neutral-400 font-semibold block">
              Application Notice
            </span>
            <h2 className="text-xl font-light uppercase tracking-widest text-neutral-900">
              Exquisite Piece Encounters Loading Issue
            </h2>
            <p className="text-xs text-neutral-500 font-light leading-relaxed">
              We encountered an issue rendering this section of the gallery. This is often temporary and can be resolved by refreshing.
            </p>
            {this.state.error && (
              <pre className="text-[10px] font-mono text-left bg-neutral-55 border border-neutral-100 p-3 overflow-x-auto text-neutral-600 rounded">
                {this.state.error.message || String(this.state.error)}
              </pre>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={this.handleReload}
              className="flex items-center justify-center gap-2 px-6 py-3 border border-neutral-900 bg-black hover:bg-neutral-900 text-white text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer rounded-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reload Page
            </button>
            <a
              href="/"
              className="flex items-center justify-center gap-2 px-6 py-3 border border-neutral-300 hover:border-neutral-900 text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer rounded-sm"
            >
              <Home className="w-3.5 h-3.5" />
              Return Home
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
