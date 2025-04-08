import  { useStore } from '../../store/useStore';
import Notification from './Notification';

const NotificationContainer = () => {
  const notifications = useStore(state => state.notifications);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-md">
      {notifications.map(notification => (
        <Notification key={notification.id} notification={notification} />
      ))}
    </div>
  );
};

export default NotificationContainer;
 