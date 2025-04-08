import  { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Music } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

const Splash = () => {
  const [redirect, setRedirect] = useState(false);
  const { isAuthenticated } = useStore();

  useEffect(() => {
    const timer = setTimeout(() => setRedirect(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (redirect) {
    return <Navigate to={isAuthenticated ? '/home' : '/auth'} />;
  }

  const waveVariants = {
    start: { pathLength: 0, pathOffset: 0 },
    end: { pathLength: 1, pathOffset: 0, transition: { duration: 1.5, ease: "easeInOut" } }
  };

  return (
    <div className="splash-bg h-screen w-full flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative"
      >
        <div className="bg-indigo-600 p-5 rounded-full shadow-xl mb-8 relative overflow-hidden">
          <Music size={60} className="text-white relative z-10" />
          
          <motion.div 
            className="absolute inset-0 bg-indigo-500 opacity-30"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ 
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut"
            }}
          />
          
          <svg className="absolute -bottom-3 left-0 w-full" viewBox="0 0 100 20">
            <motion.path
              d="M0,10 Q25,20 50,10 T100,10"
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="2"
              variants={waveVariants}
              initial="start"
              animate="end"
            />
          </svg>
        </div>
      </motion.div>
      
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="text-4xl font-bold text-white mb-3 text-center"
      >
        AI Music Creator
      </motion.h1>
      
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="text-lg text-gray-300 text-center max-w-md mb-8"
      >
        Generate unique music with AI-powered audio and lyrics
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="flex space-x-3"
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            animate={{ 
              height: ["30%", "100%", "30%"]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              delay: i * 0.2,
              ease: "easeInOut"
            }}
            className="w-2 bg-indigo-500 rounded-full h-8"
          />
        ))}
      </motion.div>
    </div>
  );
};

export default Splash;
 