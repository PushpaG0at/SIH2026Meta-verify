import React from 'react';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';
import Button from '../ui/Button';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] Caught exception in component tree:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-2xl border border-rose-200 shadow-sm p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                Regulatory Dossier Render Notice
              </h3>
              <p className="text-xs text-slate-600">
                An unexpected condition occurred while formatting this application record.
              </p>
              {this.state.error?.message && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 font-mono text-[11px] text-left break-words">
                  {this.state.error.message}
                </div>
              )}
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                leftIcon={ArrowLeft}
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.history.back();
                }}
              >
                Go Back
              </Button>
              <Button
                variant="primary"
                size="sm"
                leftIcon={RefreshCw}
                onClick={this.handleReset}
              >
                Reload Dossier
              </Button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
