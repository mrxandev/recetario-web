import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
}

interface NotificationItemProps {
  notification: Notification;
  onClose: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClose }) => {
  const { id, type, title, message } = notification;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-green-400" size={20} />;
      case 'error':
        return <XCircle className="text-red-400" size={20} />;
      case 'warning':
        return <AlertCircle className="text-yellow-400" size={20} />;
      case 'info':
        return <Info className="text-blue-400" size={20} />;
      default:
        return <Info className="text-blue-400" size={20} />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'border-green-500/50 bg-green-500/10';
      case 'error':
        return 'border-red-500/50 bg-red-500/10';
      case 'warning':
        return 'border-yellow-500/50 bg-yellow-500/10';
      case 'info':
        return 'border-blue-500/50 bg-blue-500/10';
      default:
        return 'border-blue-500/50 bg-blue-500/10';
    }
  };

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-sm ${getStyles()} shadow-lg animate-in slide-in-from-right-full duration-300`}
    >
      <div className="flex-shrink-0 mt-0.5">
        {getIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="text-white font-semibold text-sm mb-1">
          {title}
        </h4>
        {message && (
          <p className="text-gray-300 text-sm leading-relaxed">
            {message}
          </p>
        )}
      </div>

      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 text-gray-400 hover:text-white transition-colors duration-200 p-1 hover:bg-white/10 rounded-lg"
      >
        <X size={16} />
      </button>
    </div>
  );
};

interface NotificationContainerProps {
  notifications: Notification[];
  onClose: (id: string) => void;
}

export const NotificationContainer: React.FC<NotificationContainerProps> = ({
  notifications,
  onClose,
}) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-50 flex flex-col gap-3">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={onClose}
        />
      ))}
    </div>
  );
};

export default NotificationContainer;
