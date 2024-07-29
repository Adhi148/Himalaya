const CONFIG = {
  development: {
    backendUrl: 'http://localhost:4000',
  },
  production: {
    backendUrl: 'http://54.172.168.74:4000',
  },
  // Add other environments if needed
};

const env = process.env.NODE_ENV || 'development'; // Default to 'development' if NODE_ENV is not set

export default CONFIG[env];
