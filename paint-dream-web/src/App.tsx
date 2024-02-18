import { twMerge } from 'tailwind-merge';
import PaintCanvas from './features/Canvas/PaintCanvas';
import ColorPalette from './features/ColorPalette/ColorPalette';
import PixelInspection from './features/PixelInspection/PixelInspection';
import useWindowDimensions from './hooks/WindowDimensions';

function App() {
  console.log(import.meta.env.VITE_ENVOY_URL);

  const windowDimensions = useWindowDimensions();
  const highFormat = windowDimensions.width <= windowDimensions.height;
  const canvasLength = highFormat ? windowDimensions.width : windowDimensions.height;

  return (
    <div className="h-screen bg-zinc-950 fill-white text-white">
      <div className={twMerge('flex', highFormat ? 'flex-col' : 'flex-row')}>
        <PaintCanvas
          style={{ width: `${canvasLength}px`, height: `${canvasLength}px` }}
          width={100}
          height={100}
        ></PaintCanvas>
        <div className="flex w-auto min-w-[20rem] flex-grow flex-col">
          <ColorPalette />
          <PixelInspection highFormat={highFormat} className="flex-grow" />
        </div>
      </div>
    </div>
  );
}

export default App;
