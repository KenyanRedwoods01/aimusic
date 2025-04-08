import  { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import Splash from './components/Splash';

// Lazy load components for better performance
const Auth = lazy(() => import('./components/Auth'));
const Layout = lazy(() => import('./components/Layout'));
const Home = lazy(() => import('./pages/Home'));
const Create = lazy(() => import('./pages/Create'));
const Customize = lazy(() => import('./pages/Customize'));
const Lyrics = lazy(() => import('./pages/Lyrics'));
const Profile = lazy(() => import('./pages/Profile'));

function App() {
  const { setUser, setLoading } = useStore();
  
  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, [setUser, setLoading]);
  
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="flex w-full h-screen items-center justify-center bg-gray-900"><div className="animate-pulse text-indigo-400">Loading...</div></div>}>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/create" element={<Create />} />
            <Route path="/customize" element={<Customize />} />
            <Route path="/lyrics" element={<Lyrics />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
 