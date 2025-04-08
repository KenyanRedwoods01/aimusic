import  { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, LogOut, Music, Clock, Settings, ChevronRight, Bell, HelpCircle, ShieldOff } from 'lucide-react';
import { useStore } from '../store/useStore';

const Profile = () => {
  const { user, logout, tracks } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <img 
          src="https://images.unsplash.com/photo-1558811916-51c8d56d29c6?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMHN0dWRpbyUyMHByb2Zlc3Npb25hbCUyMG1vZGVybnxlbnwwfHx8fDE3NDQxMTIxNzh8MA&ixlib=rb-4.0.3" 
          alt="Profile cover"
          className="w-full h-32 object-cover rounded-lg mb-4 opacity-70"
        />
        <div className="relative -mt-16 mb-4">
          <div className="bg-indigo-600 size-24 rounded-full flex items-center justify-center mx-auto border-4 border-gray-900">
            <User size={40} className="text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold">{user?.name}</h1>
        <p className="text-gray-400">{user?.email}</p>
        <div className="flex justify-center mt-2">
          <span className="text-sm text-gray-500">Member since {user?.createdAt ? formatDate(user.createdAt) : 'recently'}</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="bg-gray-800 rounded-lg mb-4 overflow-hidden"
      >
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Music size={20} className="text-indigo-400 mr-3" />
              <span className="text-gray-200">Created Tracks</span>
            </div>
            <span className="font-medium">{tracks.length}</span>
          </div>
        </div>
        
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bell size={20} className="text-indigo-400 mr-3" />
              <span className="text-gray-200">Notifications</span>
            </div>
            <button className="text-gray-400 hover:text-white transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Settings size={20} className="text-indigo-400 mr-3" />
              <span className="text-gray-200">App Settings</span>
            </div>
            <button className="text-gray-400 hover:text-white transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ShieldOff size={20} className="text-indigo-400 mr-3" />
              <span className="text-gray-200">Privacy</span>
            </div>
            <button className="text-gray-400 hover:text-white transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <HelpCircle size={20} className="text-indigo-400 mr-3" />
              <span className="text-gray-200">Help & Support</span>
            </div>
            <button className="text-gray-400 hover:text-white transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-6"
      >
        <button
          onClick={handleLogout}
          className="btn-secondary flex items-center justify-center"
        >
          <LogOut size={18} className="mr-2" />
          Sign Out
        </button>
      </motion.div>
    </div>
  );
};

export default Profile;
 