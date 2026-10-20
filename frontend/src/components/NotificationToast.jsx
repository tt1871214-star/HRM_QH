import { useEffect } from "react";
import { X, AlertCircle, CheckCircle, Info, AlertTriangle, ExternalLink } from "lucide-react";

const TYPE_CONFIG = {
  Success: {
    icon: <CheckCircle className="text-green-500" size={22} />,
    colors: "bg-green-50 border-green-200 text-green-900",
    bar: "bg-green-500"
  },
  Alert: {
    icon: <AlertCircle className="text-red-500" size={22} />,
    colors: "bg-red-50 border-red-200 text-red-900",
    bar: "bg-red-500"
  },
  Warning: {
    icon: <AlertTriangle className="text-yellow-600" size={22} />,
    colors: "bg-yellow-50 border-yellow-200 text-yellow-900",
    bar: "bg-yellow-600"
  },
  Info: {
    icon: <Info className="text-blue-500" size={22} />,
    colors: "bg-blue-50 border-blue-200 text-blue-900",
    bar: "bg-blue-500"
  }
};

export default function NotificationToast({ notification, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const config = TYPE_CONFIG[notification.type] || TYPE_CONFIG.Info;

  return (
    <div
      role="alert"
      className={`fixed bottom-6 right-6 z-50 max-w-md w-full p-4 rounded-xl border shadow-2xl flex gap-3 animate-slide-in-up overflow-hidden ${config.colors}`}
    >
      <div className="shrink-0">{config.icon}</div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm leading-tight mb-1">{notification.message}</p>
        
        <div className="flex items-center gap-2">
          {notification.source_module && (
            <span className="text-[10px] font-bold uppercase tracking-wider bg-black/5 px-1.5 py-0.5 rounded">
              {notification.source_module}
            </span>
          )}
          
          {notification.action_url && (
            <a 
              href={notification.action_url}
              className="text-xs font-medium underline flex items-center gap-1 hover:opacity-70"
            >
              Xem ngay <ExternalLink size={10} />
            </a>
          )}
        </div>
      </div>

      <button
        onClick={onClose}
        className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X size={18} />
      </button>

      {/* Progress bar đồng bộ với 4s timeout */}
      <div 
        className={`absolute bottom-0 left-0 h-1 opacity-30 animate-shrink-width ${config.bar}`}
        style={{ animationDuration: '4000ms' }}
      />
    </div>
  );
}