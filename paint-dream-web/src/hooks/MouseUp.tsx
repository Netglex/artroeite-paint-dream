import { useEffect } from 'react';

function useMouseUp(action: () => void) {
  useEffect(() => {
    window.addEventListener('mouseup', action);
    return () => window.removeEventListener('mouseup', action);
  }, []);
}

export default useMouseUp;
