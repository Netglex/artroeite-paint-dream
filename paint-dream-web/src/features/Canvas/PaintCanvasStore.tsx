import { create } from 'zustand';
import { CreatePixelInfoDto } from '../../clients/pixel_info';
import { colorValue1To255 } from '../../services/ColorService';

interface PaintCanvasState {
  ctx: CanvasRenderingContext2D | null;
  setCtx: (ctx: CanvasRenderingContext2D | null) => void;
  drawPixel: (createPixelInfo: CreatePixelInfoDto) => void;
}

const usePaintCanvasStore = create<PaintCanvasState>((set, get) => ({
  ctx: null,
  setCtx: (ctx) => set(() => ({ ctx })),
  drawPixel: (createPixelInfo) => {
    const ctx = get().ctx;
    if (ctx === null) return;
    const pixelImageData = ctx.createImageData(1, 1);
    pixelImageData.data[0] = colorValue1To255(createPixelInfo.color!.r);
    pixelImageData.data[1] = colorValue1To255(createPixelInfo.color!.g);
    pixelImageData.data[2] = colorValue1To255(createPixelInfo.color!.b);
    pixelImageData.data[3] = colorValue1To255(1);
    ctx.putImageData(pixelImageData, createPixelInfo.position!.x, createPixelInfo.position!.y);
  },
}));

export default usePaintCanvasStore;
