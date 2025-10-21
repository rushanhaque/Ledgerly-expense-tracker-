import { create } from 'zustand';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, Info, X, Bell } from 'lucide-react';

export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationStore {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        {
          ...notification,
          id: `notif-${Date.now()}-${Math.random()}`,
          timestamp: new Date(),
          read: false,
        },
        ...state.notifications,
      ],
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
  clearAll: () => set({ notifications: [] }),
}));

export function NotificationToast() {
  const notifications = useNotificationStore((state) => state.notifications);
  const removeNotification = useNotificationStore((state) => state.removeNotification);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'from-green-500/20 to-emerald-500/20 border-green-500/30';
      case 'warning':
        return 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30';
      case 'error':
        return 'from-red-500/20 to-pink-500/20 border-red-500/30';
      default:
        return 'from-blue-500/20 to-cyan-500/20 border-blue-500/30';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2 max-w-md">
      <AnimatePresence>
        {notifications.slice(0, 3).map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            className={`glass-dark rounded-xl p-4 border bg-gradient-to-br ${getColor(
              notification.type
            )} shadow-2xl`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">{getIcon(notification.type)}</div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-semibold text-sm">{notification.title}</h4>
                <p className="text-white/80 text-xs mt-1">{notification.message}</p>
              </div>

              <button
                onClick={() => removeNotification(notification.id)}
                className="flex-shrink-0 p-1 hover:bg-white/10 rounded transition-colors"
              >
                <X className="w-4 h-4 text-white/60" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function NotificationCenter() {
  const notifications = useNotificationStore((state) => state.notifications);
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const removeNotification = useNotificationStore((state) => state.removeNotification);
  const clearAll = useNotificationStore((state) => state.clearAll);
  const [isOpen, setIsOpen] = React.useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-white/10 rounded-lg transition-colors"
      >
        <Bell className="w-6 h-6 text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="absolute right-0 mt-2 w-96 glass-dark rounded-xl shadow-2xl z-50 max-h-[500px] overflow-hidden"
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-white font-semibold">Notifications</h3>
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="overflow-y-auto max-h-[400px]">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-white/60">
                  <Bell className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p>No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {notifications.map((notification) => {
                    const getIcon = (type: string) => {
                      switch (type) {
                        case 'success':
                          return <CheckCircle className="w-5 h-5 text-green-400" />;
                        case 'warning':
                          return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
                        case 'error':
                          return <AlertTriangle className="w-5 h-5 text-red-400" />;
                        default:
                          return <Info className="w-5 h-5 text-blue-400" />;
                      }
                    };

                    return (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-white/5 transition-colors cursor-pointer ${
                          !notification.read ? 'bg-white/5' : ''
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start gap-3">
                          {getIcon(notification.type)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="text-white font-medium text-sm">
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                              )}
                            </div>
                            <p className="text-white/70 text-xs">{notification.message}</p>
                            <p className="text-white/40 text-xs mt-1">
                              {new Date(notification.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notification.id);
                            }}
                            className="flex-shrink-0 p-1 hover:bg-white/10 rounded transition-colors"
                          >
                            <X className="w-4 h-4 text-white/60" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}

// Add React import
import React from 'react';
