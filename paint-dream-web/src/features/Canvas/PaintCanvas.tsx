import { CanvasHTMLAttributes, useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { CreatePixelInfoDto, CreatePixelInfosDto, PositionDto } from '../../clients/pixel_info';
import useColorStore from '../ColorPalette/ColorStore';
import usePixelInspectionStore from '../PixelInspection/PixelInspectionStore';
import usePixelInfoStore from '../../services/PixelInfoStore';
import { equals, pixelInfoClient } from '../../services/api/PixelInfoClient';
import { colorValue1To255 } from '../../services/ColorService';
import useMouseUp from '../../hooks/MouseUp';
import { pixelLine } from '../../services/AlgorithmService';

type CanvasProps = CanvasHTMLAttributes<HTMLCanvasElement>;

function PaintCanvas({ className, style, children, ...htmlProps }: CanvasProps) {
  const [setPixelInfoHistories, updatePixelInfos] = usePixelInfoStore((state) => [
    state.setPixelInfoHistories,
    state.updatePixelInfos,
  ]);
  const [currentColor] = useColorStore((state) => [state.currentColor]);
  const [setCurrentPosition, setHoveringPosition] = usePixelInspectionStore((state) => [
    state.setCurrentPosition,
    state.setHoveringPosition,
  ]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | undefined>();

  const [mouseDown, setMouseDown] = useState(false);
  const [lastPosition, setLastPosition] = useState<PositionDto | undefined>();

  //#region pixelInfoClient

  const getPixelInfoHistories = async (abortSignal: AbortSignal) => {
    try {
      const { response } = await pixelInfoClient.getPixelInfoHistories({}, { abort: abortSignal });
      const pixelInfoHistories = response.histories;

      setPixelInfoHistories(pixelInfoHistories);
      drawPixels(
        pixelInfoHistories.map((pih) => ({ position: pih.position, color: pih.history[pih.history.length - 1].color })),
      );
    } catch (error) {}
  };

  const createPixelInfos = async (pixelInfos: CreatePixelInfosDto) => {
    try {
      await pixelInfoClient.createPixelInfos(pixelInfos);
    } catch {}
  };

  const subscribePixelInfoUpdates = async (abortSignal: AbortSignal) => {
    try {
      const call = pixelInfoClient.subscribePixelInfosUpdates({}, { abort: abortSignal });

      for await (const fullPixelInfos of call.responses) {
        updatePixelInfos(fullPixelInfos);
        drawPixels(fullPixelInfos.pixelInfos.map((pi) => ({ position: pi.position, color: pi.color })));
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
    const mousePosition = getPositionFromCursor(event);
    if (equals(mousePosition, lastPosition)) return;

    if (currentColor) {
      const pixelInfos: CreatePixelInfosDto = {
        pixelInfos: (lastPosition ? pixelLine(lastPosition, mousePosition) : [mousePosition]).map((p) => ({
          position: p,
          color: currentColor,
        })),
      };
      createPixelInfos(pixelInfos);
      drawPixels(pixelInfos.pixelInfos);
    }

    setLastPosition(mousePosition);
    setCurrentPosition(mousePosition);
  };

  useMouseUp(() => {
    setMouseDown(false);
    setLastPosition(undefined);
  });

  //#endregion

  //#region draw

  const drawPixels = (pixelInfos: CreatePixelInfoDto[]) => {
    if (!ctx) return;

    const xList = pixelInfos.map((pi) => pi.position!.x);
    const yList = pixelInfos.map((pi) => pi.position!.y);
    const x = Math.min(...xList);
    const y = Math.min(...yList);
    const width = Math.max(...xList) - x + 1;
    const height = Math.max(...yList) - y + 1;
    const pixelImageData = ctx.getImageData(x, y, width, height);

    pixelInfos.forEach((pixelInfo) => {
      const index = 4 * (pixelInfo.position!.x - x + (pixelInfo.position!.y - y) * width);
      pixelImageData.data[index] = colorValue1To255(pixelInfo.color!.r);
      pixelImageData.data[index + 1] = colorValue1To255(pixelInfo.color!.g);
      pixelImageData.data[index + 2] = colorValue1To255(pixelInfo.color!.b);
      pixelImageData.data[index + 3] = colorValue1To255(1);
    });
    ctx.putImageData(pixelImageData, x, y);
  };

  //#endregion

  useEffect(() => {
    const abortController = new AbortController();

    if (!canvasRef.current) return;
    setCtx(canvasRef.current.getContext('2d')!);

    getPixelInfoHistories(abortController.signal);
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
        setMouseDown(true);
        onMouseDrag(e);
      }}
      onMouseMove={(e) => {
        if (mouseDown) onMouseDrag(e);
        setHoveringPosition(getPositionFromCursor(e));
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
