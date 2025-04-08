import  { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, Music, Sliders, FileText, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import NotificationContainer from './ui/NotificationContainer';
import AudioPlayer from './player/AudioPlayer';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, currentTrack } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setMounted(true);
  }, [user, navigate]);

  const tabs = [
    { path: '/home', label: 'Home', icon: Home },
    { path: '/create', label: 'Create', icon: Music },
    { path: '/customize', label: 'Customize', icon: Sliders },
    { path: '/lyrics', label: 'Lyrics', icon: FileText },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  if (!mounted || !isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <NotificationContainer />
      
      <main className={`flex-1 ${currentTrack ? 'pb-32' : 'pb-16'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      
      {currentTrack && <AudioPlayer />}
      
      <motion.nav 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed bottom-0 inset-x-0 bg-gray-800 border-t border-gray-700 h-16 z-10"
      >
        <div className="flex h-full">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            const Icon = tab.icon;
            
            return (
              <button
                key={tab.path}
                className={`bottom-tab flex-1 relative ${isActive ? 'active' : ''}`}
                onClick={() => navigate(tab.path)}
              >
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute -top-0.5 inset-x-0 h-0.5 bg-indigo-500"
                  />
                )}
                <Icon size={20} />
                <span className="mt-1">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </motion.nav>
    </div>
  );
};

export default Layout;
 