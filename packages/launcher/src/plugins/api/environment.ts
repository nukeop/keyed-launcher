export const getEnvironment = () => {
  return {
    theme: 'default', // TODO: get from theme system
    platform: navigator.platform,
    debug: process.env.NODE_ENV === 'development',
  };
};

export const useEnvironment = () => {
  return getEnvironment();
};
