// Generate a simple browser fingerprint for user ID
export const generateUserId = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.textBaseline = 'top';
  ctx.font = '14px Arial';
  ctx.fillText('fingerprint', 2, 2);

  const canvasData = canvas.toDataURL();
  let hash = 0;

  for (let i = 0; i < canvasData.length; i++) {
    const char = canvasData.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  return `user_${Math.abs(hash)}_${Date.now()}`;
};

// Get or create user ID
export const getUserId = () => {
  let userId = localStorage.getItem('userId');

  if (!userId) {
    userId = generateUserId();
    localStorage.setItem('userId', userId);
  }

  return userId;
};

// Storage helpers
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage error:', error);
    }
  },

  remove: (key) => {
    localStorage.removeItem(key);
  },

  clear: () => {
    localStorage.clear();
  },
};

export default { getUserId, storage };
