const usePixelTracker = (eventType = "UnnamedEvent") => {
  const tracker = (payload) => {
    if (window.fbq) {
      window.fbq("track", eventType, payload);
    }
    return null;
  };

  return {
    tracker,
  };
};

export default usePixelTracker;
