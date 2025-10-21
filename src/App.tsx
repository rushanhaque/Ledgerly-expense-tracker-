import { useEffect } from 'react';
import { Dashboard } from './pages/Dashboard';
import { useThemeStore } from './store/themeStore';
import './index.css';

function App() {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    // Apply theme class to body
    document.body.className = theme;
  }, [theme]);

  return <Dashboard />;
}

export default App;
