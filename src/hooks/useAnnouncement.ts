import { useState, useCallback } from 'react';

export const useAnnouncement = () => {
  const [announcement, setAnnouncement] = useState('');

  const announce = useCallback((message: string, politeness: 'polite' | 'assertive' = 'polite') => {
    setAnnouncement(''); // Clear first to ensure the message is announced
    setTimeout(() => {
      setAnnouncement(message);
    }, 100);
  }, []);

  const clearAnnouncement = useCallback(() => {
    setAnnouncement('');
  }, []);

  return {
    announcement,
    announce,
    clearAnnouncement
  };
};