import { create } from 'zustand';
import { PositionDto } from '../../clients/pixel_info';

interface PixelInspectionState {
  currentPosition: PositionDto | undefined;
  setCurrentPosition: (position: PositionDto | undefined) => void;
  hoveringPosition: PositionDto | undefined;
  setHoveringPosition: (position: PositionDto | undefined) => void;
}

const usePixelInspectionStore = create<PixelInspectionState>((set) => ({
  currentPosition: undefined,
  setCurrentPosition: (position) => set(() => ({ currentPosition: position })),
  hoveringPosition: undefined,
  setHoveringPosition: (position) => set(() => ({ hoveringPosition: position })),
}));

export default usePixelInspectionStore;
