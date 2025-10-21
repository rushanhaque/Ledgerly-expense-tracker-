import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from './NotificationSystem';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const login = useAuthStore((state) => state.login);
  const signup = useAuthStore((state) => state.signup);
  const addNotification = useNotificationStore((state) => state.addNotification);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const success = await login(email, password);
        if (success) {
          addNotification({
            type: 'success',
            title: 'Login Successful',
            message: `Welcome back!`,
          });
          onClose();
          resetForm();
        } else {
          addNotification({
            type: 'error',
            title: 'Login Failed',
            message: 'Invalid email or password',
          });
        }
      } else {
        if (!name.trim()) {
          addNotification({
            type: 'error',
            title: 'Validation Error',
            message: 'Please enter your name',
          });
          setIsLoading(false);
          return;
        }

        const success = await signup(email, password, name);
        if (success) {
          addNotification({
            type: 'success',
            title: 'Account Created',
            message: `Welcome to Ledgerly, ${name}!`,
          });
          onClose();
          resetForm();
        } else {
          addNotification({
            type: 'error',
            title: 'Signup Failed',
            message: 'Email already exists',
          });
        }
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Something went wrong. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setShowPassword(false);
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    resetForm();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="glass-dark rounded-2xl p-8 max-w-md w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-white/80 mb-2 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input"
                      placeholder="John Doe"
                      required={mode === 'signup'}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-white/80 mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white/80 mb-2 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input pr-12"
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {mode === 'signup' && (
                    <p className="text-white/60 text-xs mt-1">
                      Minimum 6 characters
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading
                    ? mode === 'login'
                      ? 'Logging in...'
                      : 'Creating account...'
                    : mode === 'login'
                    ? 'Login'
                    : 'Sign Up'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-white/60 text-sm">
                  {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
                  <button
                    onClick={switchMode}
                    className="ml-2 text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                  >
                    {mode === 'login' ? 'Sign Up' : 'Login'}
                  </button>
                </p>
              </div>

              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-blue-300 text-xs">
                  <strong>Demo Mode:</strong> Your data is stored locally in your browser.
                  No real authentication backend is used.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
