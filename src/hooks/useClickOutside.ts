import { useEffect } from 'react';

const useClickOutside = (
  ref: React.RefObject<HTMLElement>,
  handler: () => void,
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('[role="dialog"]')
      ) {
        handler();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, handler]);
};

export default useClickOutside;
