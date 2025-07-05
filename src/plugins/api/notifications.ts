export const show = (
  message: string,
  type: 'info' | 'success' | 'error' = 'info',
) => {
  // TODO: Implement proper notification system
  console.log(`[${type.toUpperCase()}] ${message}`);
};

export const useNotifications = () => {
  return {
    show,
  };
};
