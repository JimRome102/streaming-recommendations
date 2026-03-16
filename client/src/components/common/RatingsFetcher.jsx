import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ratingApi } from '../../services/api';
import useUserStore from '../../store/userStore';

const RatingsFetcher = () => {
  const userId = useUserStore((state) => state.userId);

  // Fetch user ratings on app load
  useQuery({
    queryKey: ['ratings', userId],
    queryFn: async () => {
      if (!userId) return [];
      const response = await ratingApi.getUserRatings(userId);
      useUserStore.setState({ ratings: response.data });
      return response.data;
    },
    enabled: !!userId,
  });

  return null; // This component doesn't render anything
};

export default RatingsFetcher;
