import { useState, useEffect } from 'react';

export const useCurrentMember = () => {
  const [currentMember, setCurrentMember] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('currentMember');
    if (stored) {
      try {
        setCurrentMember(JSON.parse(stored));
      } catch {
        setCurrentMember(null);
      }
    }
  }, []);

  return currentMember;
};
