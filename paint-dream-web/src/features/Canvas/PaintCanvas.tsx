import { CanvasHTMLAttributes, useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { CreatePixelInfoDto, PositionDto } from '../../clients/pixel_info';
import useColorStore from '../ColorPalette/ColorStore';
import usePixelInspectionStore from '../PixelInspection/PixelInspectionStore';
import usePixelInfoStore from '../../services/PixelInfoStore';
import { equals, pixelInfoClient } from '../../services/api/PixelInfoClient';
import { colorValue1To255 } from '../../services/ColorService';

type CanvasProps = CanvasHTMLAttributes<HTMLCanvasElement>;

function PaintCanvas({ className, style, children, ...htmlProps }: CanvasProps) {
  const [setPixelInfoHistories, updatePixelInfo] = usePixelInfoStore((state) => [
    state.setPixelInfoHistories,
    state.updatePixelInfo,
  ]);
  const [currentColor] = useColorStore((state) => [state.currentColor]);
  const [setCurrentPosition, setHoveringPosition] = usePixelInspectionStore((state) => [
    state.setCurrentPosition,
    state.setHoveringPosition,
  ]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | undefined>();

  const [mouseDownCount, setMouseDownCount] = useState<number>(0);
  const [lastPosition, setLastPosition] = useState<PositionDto | undefined>();

  const mouseDown = mouseDownCount > 0;

  //#region pixelInfoClient

  const initializePixelInfo = async () => {
    const { response: pixelInfoHistories } = await pixelInfoClient.getPixelInfoHistories({});
    setPixelInfoHistories(pixelInfoHistories.histories);

    for (const pixelInfoHistory of pixelInfoHistories.histories) {
      drawPixel({
        position: pixelInfoHistory.position,
        color: pixelInfoHistory.history[pixelInfoHistory.history.length - 1].color,
      });
    }
  };

  const subscribePixelInfoUpdates = async (abortSignal: AbortSignal) => {
    try {
      const call = pixelInfoClient.subscribePixelInfoUpdates({}, { abort: abortSignal });

      for await (const fullPixelInfo of call.responses) {
        updatePixelInfo(fullPixelInfo);
        drawPixel({
          position: fullPixelInfo.position,
          color: fullPixelInfo.color,
        });
      }
    } catch (error) {
      if (abortSignal.aborted) return;
      subscribePixelInfoUpdates(abortSignal);
    }
  };

  //#endregion

  //#region controls

  const getPositionFromCursor = (event: React.MouseEvent): PositionDto => {
    if (canvasRef.current === null) return { x: 0, y: 0 };
    const canvasRect = canvasRef.current.getBoundingClientRect();
    return {
      x: Math.floor(((event.clientX - canvasRect.left) / canvasRect.width) * canvasRef.current.width),
      y: Math.floor(((event.clientY - canvasRect.top) / canvasRect.height) * canvasRef.current.height),
    };
  };

  const onMouseDrag = async (event: React.MouseEvent) => {
    const position = getPositionFromCursor(event);
    if (equals(position, lastPosition)) return;

    setLastPosition(position);
    setCurrentPosition(position);

    if (currentColor !== undefined) {
      const createPixelInfo: CreatePixelInfoDto = {
        position: position,
        color: currentColor,
      };
      await pixelInfoClient.createPixelInfo(createPixelInfo);
      drawPixel(createPixelInfo);
    }
  };

  //#endregion

  //#region draw

  const drawPixel = (createPixelInfo: CreatePixelInfoDto) => {
    if (!ctx) return;
    const pixelImageData = ctx.createImageData(1, 1);
    pixelImageData.data[0] = colorValue1To255(createPixelInfo.color!.r);
    pixelImageData.data[1] = colorValue1To255(createPixelInfo.color!.g);
    pixelImageData.data[2] = colorValue1To255(createPixelInfo.color!.b);
    pixelImageData.data[3] = colorValue1To255(1);
    ctx.putImageData(pixelImageData, createPixelInfo.position!.x, createPixelInfo.position!.y);
  };

  //#endregion

  useEffect(() => {
    const abortController = new AbortController();

    if (canvasRef.current === null) return;
    setCtx(canvasRef.current.getContext('2d')!);

    initializePixelInfo();
    subscribePixelInfoUpdates(abortController.signal);

    return () => {
      abortController.abort();
    };
  }, [canvasRef.current]);

  return (
    <canvas
      ref={canvasRef}
      className={twMerge('touch-none bg-black', className)}
      style={{ imageRendering: 'pixelated', ...style }}
      onMouseDown={(e) => {
        setMouseDownCount((v) => v + 1);
        onMouseDrag(e);
      }}
      onMouseMove={(e) => {
        if (mouseDown) onMouseDrag(e);
        setHoveringPosition(getPositionFromCursor(e));
      }}
      onMouseUp={() => {
        setMouseDownCount((v) => v - 1);
      }}
      onMouseLeave={() => {
        setHoveringPosition(undefined);
      }}
      {...htmlProps}
    >
      {children}
    </canvas>
  );
}

export default PaintCanvas;
