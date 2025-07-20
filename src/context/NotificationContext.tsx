import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { NotificationContainer } from '../components/ui/NotificationContainer';
import type { Notification, NotificationType } from '../components/ui/NotificationContainer';

interface NotificationContextType {
  showNotification: (
    type: NotificationType,
    title: string,
    message?: string,
    duration?: number
  ) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback(
    (type: NotificationType, title: string, message?: string, duration: number = 5000) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newNotification: Notification = {
        id,
        type,
        title,
        message,
        duration,
      };

      setNotifications((prev) => [...prev, newNotification]);

      // Auto remove after duration
      if (duration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, duration);
      }
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const value = {
    showNotification,
    removeNotification,
    clearAll,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer
        notifications={notifications}
        onClose={removeNotification}
      />
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
