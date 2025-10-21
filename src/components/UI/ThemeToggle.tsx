import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className="relative w-16 h-8 bg-white/10 rounded-full p-1 transition-colors hover:bg-white/20"
      aria-label="Toggle theme"
    >
      <motion.div
        className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
        animate={{
          x: theme === 'dark' ? 0 : 32,
        }}
        transition={{
          type: 'spring',
          stiffness: 700,
          damping: 30,
        }}
      >
        {theme === 'dark' ? (
          <Moon className="w-4 h-4 text-white" />
        ) : (
          <Sun className="w-4 h-4 text-white" />
        )}
      </motion.div>
    </motion.button>
  );
}
