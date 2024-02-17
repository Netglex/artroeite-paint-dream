import { create } from 'zustand';
import { ColorDto } from '../../clients/pixel_info';

interface ColorState {
  currentColor: ColorDto | undefined;
  setCurrentColor: (color: ColorDto | undefined) => void;
}

const useColorStore = create<ColorState>((set) => ({
  currentColor: undefined,
  setCurrentColor: (color) => set(() => ({ currentColor: color })),
}));

export default useColorStore;
