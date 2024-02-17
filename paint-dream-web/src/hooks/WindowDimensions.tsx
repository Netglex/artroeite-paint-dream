import { useEffect, useState } from 'react';

export type RectDimension = {
  width: number;
  height: number;
};

function useWindowDimensions() {
  const getWindowDimensions = (): RectDimension => {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  };

  const [windowDimension, setWindowDimension] = useState<RectDimension>(getWindowDimensions());

  useEffect(() => {
    const handleResize = () => {
      setWindowDimension(getWindowDimensions());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimension;
}

export default useWindowDimensions;
