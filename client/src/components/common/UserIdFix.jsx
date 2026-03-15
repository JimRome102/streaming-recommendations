import { useEffect } from 'react';
import useUserStore from '../../store/userStore';

const UserIdFix = () => {
  useEffect(() => {
    // Check if we need to sync userId with the backend
    const storedUserId = localStorage.getItem('userId');
    const expectedUserId = 'user_1460734589_1773612068977'; // From database

    if (!storedUserId || storedUserId !== expectedUserId) {
      console.log('🔧 Syncing userId with database...');
      localStorage.setItem('userId', expectedUserId);
      useUserStore.setState({ userId: expectedUserId });
      // Reload to fetch correct data
      window.location.reload();
    }
  }, []);

  return null; // This component doesn't render anything
};

export default UserIdFix;
