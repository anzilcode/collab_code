import { toast } from "react-hot-toast";

// Industry-relevant toast messages
export const TOAST_MESSAGES = {
  // Authentication & Security
  LOGIN_SUCCESS: "Authentication successful - Welcome back!",
  LOGIN_FAILED: "Authentication failed - Please check credentials",
  SESSION_EXPIRED: "Session timeout - Please login again",
  UNAUTHORIZED: "Access denied - Insufficient permissions",
  LOGOUT_SUCCESS: "Logged out successfully",
  PASSWORD_UPDATED: "Password updated successfully",
  MFA_ENABLED: "Two-factor authentication enabled",
  
  // Data Operations
  DATA_SAVED: "Data synchronized successfully",
  DATA_LOAD_ERROR: "Failed to load data - Connection timeout",
  BACKUP_COMPLETE: "Backup completed successfully",
  SYNC_IN_PROGRESS: "Synchronizing data...",
  VALIDATION_ERROR: "Please check required fields",
  
  // File Operations
  FILE_UPLOAD_SUCCESS: "File uploaded and processed",
  FILE_UPLOAD_ERROR: "Upload failed - File size exceeds limit",
  EXPORT_READY: "Export ready for download",
  INVALID_FILE_TYPE: "File type not supported",
  
  // System Status
  SERVER_ERROR: "Server temporarily unavailable",
  MAINTENANCE_MODE: "System maintenance in progress",
  CONNECTION_RESTORED: "Connection restored successfully",
  NETWORK_ERROR: "Network connection lost - Retrying...",
  
  // Business Operations
  ORDER_PROCESSED: "Order processed and confirmed",
  PAYMENT_SUCCESS: "Payment processed successfully",
  INVENTORY_UPDATED: "Inventory levels synchronized",
  REPORT_GENERATED: "Analytics report generated",
  
  // User Actions
  PROFILE_UPDATED: "Profile updated successfully",
  SETTINGS_SAVED: "Settings saved successfully",
  CHANGES_DISCARDED: "Changes discarded",
  OPERATION_CANCELLED: "Operation cancelled by user"
};

export const showToast = (message, type = "success", showProgress = true) => {
  const toastId = toast(
    (t) => (
      <div className="relative overflow-hidden">
        {/* Main content */}
        <div className="flex items-start gap-3 relative z-10">
          <div className="flex-shrink-0 mt-0.5">
            {type === "success" && (
              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            {type === "error" && (
              <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shadow-sm">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            {type === "info" && (
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center shadow-sm">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            {type === "warning" && (
              <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center shadow-sm">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            {type === "loading" && (
              <div className="w-6 h-6 flex items-center justify-center">
                <svg className="animate-spin w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="m12 2a10 10 0 0 1 10 10h-2a8 8 0 0 0-8-8v-2z"></path>
                </svg>
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0 py-0.5">
            <p className="text-sm font-medium text-gray-900 leading-relaxed" role="status" aria-live="polite">
              {message}
            </p>
          </div>
          
          {/* Close button */}
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex-shrink-0 p-1 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors duration-200"
            aria-label="Close notification"
          >
            <svg className="w-4 h-4 text-gray-500 hover:text-gray-700" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        {/* Progress bar */}
        {showProgress && (
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gray-200 overflow-hidden">
            <div 
              className={`h-full transition-all duration-100 ease-linear ${
                type === "success" ? "bg-emerald-500" :
                type === "error" ? "bg-red-500" :
                type === "warning" ? "bg-amber-500" :
                type === "info" ? "bg-blue-500" :
                "bg-gray-500"
              }`}
              style={{
                animation: `toast-progress ${4000}ms linear forwards`
              }}
              role="progressbar"
              aria-label="Toast auto-dismiss progress"
            />
          </div>
        )}
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />
      </div>
    ),
    {
      position: "top-right",
      duration: 4000,
      className: `
        !bg-white
        !border-gray-200
        !text-gray-900
        !rounded-lg 
        !shadow-lg 
        !p-4
        !max-w-sm
        !border
        !min-h-[64px]
        backdrop-blur-sm
        ${type === "success" ? "!border-l-4 !border-l-emerald-500" : ""}
        ${type === "error" ? "!border-l-4 !border-l-red-500" : ""}
        ${type === "warning" ? "!border-l-4 !border-l-amber-500" : ""}
        ${type === "info" ? "!border-l-4 !border-l-blue-500" : ""}
      `,
      style: {
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        borderColor: "#e5e7eb"
      },
      // Add unique ID for screen readers
      id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }
  );

  // Add CSS animation for progress bar (only once)
  if (showProgress && !document.getElementById('toast-progress-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-progress-styles';
    style.textContent = `
      @keyframes toast-progress {
        0% { width: 100%; }
        100% { width: 0%; }
      }
    `;
    document.head.appendChild(style);
  }

  return toastId;
};

// Convenience methods for different toast types
export const showSuccessToast = (message, showProgress = true) => 
  showToast(message, "success", showProgress);

export const showErrorToast = (message, showProgress = true) => 
  showToast(message, "error", showProgress);

export const showInfoToast = (message, showProgress = true) => 
  showToast(message, "info", showProgress);

export const showWarningToast = (message, showProgress = true) => 
  showToast(message, "warning", showProgress);

export const showLoadingToast = (message, showProgress = false) => 
  showToast(message, "loading", showProgress);

// Advanced toast methods for complex scenarios
export const showPersistentToast = (message, type = "info") => {
  return toast(
    (t) => (
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">{message}</p>
        </div>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="px-3 py-1 text-xs font-medium text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Dismiss
        </button>
      </div>
    ),
    {
      duration: Infinity,
      position: "top-right",
      className: `!bg-white !border-gray-200 !rounded-lg !shadow-lg !p-4 !max-w-sm`,
    }
  );
};

export const showActionToast = (message, actionText, onAction, type = "info") => {
  return toast(
    (t) => (
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">{message}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              onAction();
              toast.dismiss(t.id);
            }}
            className="px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 border border-blue-300 rounded-md hover:bg-blue-50 transition-colors"
          >
            {actionText}
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 text-xs font-medium text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    ),
    {
      duration: 8000,
      position: "top-right",
      className: `!bg-white !border-gray-200 !rounded-lg !shadow-lg !p-4 !max-w-md`,
    }
  );
};

// Usage examples:
/*
import { 
  showSuccessToast, 
  showErrorToast, 
  showInfoToast, 
  showActionToast,
  showPersistentToast,
  TOAST_MESSAGES 
} from './toast';

// Using predefined messages
showSuccessToast(TOAST_MESSAGES.LOGIN_SUCCESS);
showErrorToast(TOAST_MESSAGES.SERVER_ERROR);

// Using custom messages
showInfoToast("Processing your request...");
showWarningToast("Low inventory alert", true);

// Action toast
showActionToast(
  "Connection lost. Retry?", 
  "Retry", 
  () => window.location.reload(),
  "warning"
);

// Persistent toast for critical info
showPersistentToast("System maintenance scheduled for 2 AM", "warning");
*/