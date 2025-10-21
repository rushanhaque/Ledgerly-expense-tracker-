import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { User, LogOut, Settings, UserCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from './NotificationSystem';

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const addNotification = useNotificationStore((state) => state.addNotification);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    addNotification({
      type: 'info',
      title: 'Logged Out',
      message: 'You have been successfully logged out',
    });
  };

  if (!user) return null;

  return (
    <div className="relative z-[9999]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors relative z-[9999]"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
        <span className="text-white font-medium hidden md:block">{user.name}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-[9998]"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-64 glass-dark rounded-xl shadow-2xl z-[9999] overflow-hidden"
            >
              {/* User Info */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold truncate">{user.name}</p>
                    <p className="text-white/60 text-sm truncate">{user.email}</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    // Add profile functionality later
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-left"
                >
                  <UserCircle className="w-5 h-5 text-white/70" />
                  <span className="text-white">Profile</span>
                </button>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    // Add settings functionality later
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-left"
                >
                  <Settings className="w-5 h-5 text-white/70" />
                  <span className="text-white">Settings</span>
                </button>

                <div className="h-px bg-white/10 my-2" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 transition-colors text-left"
                >
                  <LogOut className="w-5 h-5 text-red-400" />
                  <span className="text-red-400">Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
