import  { useEffect, useState } from 'react';
import { X, Check, Info, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppNotification } from '../../types';
import { useStore } from '../../store/useStore';

const Notification = ({ notification }: { notification: AppNotification }) => {
  const removeNotification = useStore(state => state.removeNotification);
  const [visible, setVisible] = useState(true);
  
  const { id, type, message } = notification;
  
  useEffect(() => {
    if (notification.duration) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, notification.duration - 300); // Start exit animation before removal
      
      return () => clearTimeout(timer);
    }
  }, [notification.duration]);
  
  const handleClose = () => {
    setVisible(false);
    setTimeout(() => removeNotification(id), 300);
  };
  
  const icons = {
    success: <Check className="h-5 w-5" />,
    error: <AlertCircle className="h-5 w-5" />,
    info: <Info className="h-5 w-5" />
  };
  
  const colors = {
    success: 'bg-green-700 border-green-500',
    error: 'bg-red-700 border-red-500',
    info: 'bg-indigo-700 border-indigo-500'
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={`${colors[type]} border-l-4 p-4 flex items-center justify-between rounded-r-lg shadow-lg max-w-md`}
        >
          <div className="flex items-center">
            <div className="text-white mr-3">
              {icons[type]}
            </div>
            <p className="text-white">{message}</p>
          </div>
          <button 
            onClick={handleClose} 
            className="text-white hover:text-gray-200 transition-colors focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;
 