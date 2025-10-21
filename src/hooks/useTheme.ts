import { useThemeStore } from '../store/themeStore';

export function useTheme() {
  const theme = useThemeStore((state) => state.theme);
  
  // Chart colors based on theme - Beige & Black
  const getChartTooltipStyle = () => ({
    backgroundColor: theme === 'light' ? 'rgba(250, 250, 250, 0.98)' : 'rgba(26, 26, 26, 0.95)',
    border: theme === 'light' ? '1px solid rgba(212, 197, 160, 0.4)' : '1px solid rgba(212, 197, 160, 0.3)',
    borderRadius: '8px',
    color: theme === 'light' ? '#000000' : '#F5F5DC',
    padding: '8px 12px',
    boxShadow: theme === 'light' 
      ? '0 4px 12px rgba(0, 0, 0, 0.1)' 
      : '0 4px 12px rgba(0, 0, 0, 0.5)',
  });

  const getChartAxisColor = () => theme === 'light' ? '#000000' : '#F5F5DC';
  
  const getChartGridColor = () => theme === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(245, 245, 220, 0.1)';

  return {
    theme,
    isLight: theme === 'light',
    isDark: theme === 'dark',
    getChartTooltipStyle,
    getChartAxisColor,
    getChartGridColor,
  };
}
