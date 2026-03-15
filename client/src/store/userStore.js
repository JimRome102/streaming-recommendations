import { create } from 'zustand';
import { getUserId } from '../utils/storage';

const useUserStore = create((set) => ({
  // User identification
  userId: getUserId(),

  // User preferences
  preferences: {
    preferredGenres: [],
    preferredPlatforms: ['netflix', 'hulu', 'prime', 'hbo', 'disney', 'paramount', 'showtime', 'peacock'],
    minRating: 6.0,
    excludeGenres: [],
  },

  // User ratings
  ratings: [],

  // Actions
  setPreferences: (preferences) => set({ preferences }),

  addRating: (rating) => set((state) => ({
    ratings: [rating, ...state.ratings],
  })),

  updateRating: (id, updatedRating) => set((state) => ({
    ratings: state.ratings.map((r) => (r.id === id ? { ...r, ...updatedRating } : r)),
  })),

  removeRating: (id) => set((state) => ({
    ratings: state.ratings.filter((r) => r.id !== id),
  })),

  setRatings: (ratings) => set({ ratings }),

  getRatingsCount: () => {
    return useUserStore.getState().ratings.length;
  },
}));

export default useUserStore;
