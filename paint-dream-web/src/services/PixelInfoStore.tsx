import { create } from 'zustand';
import { FullPixelInfosDto, PixelInfoHistoryDto } from '../clients/pixel_info';
import { equals } from './api/PixelInfoClient';
import { produce } from 'immer';

interface PixelInfoState {
  pixelInfoHistories: PixelInfoHistoryDto[];
  setPixelInfoHistories: (pixelInfoHistories: PixelInfoHistoryDto[]) => void;
  updatePixelInfos: (fullPixelInfos: FullPixelInfosDto) => void;
}

const usePixelInfoStore = create<PixelInfoState>((set) => ({
  pixelInfoHistories: [],
  setPixelInfoHistories: (pixelInfoHistories) => set(() => ({ pixelInfoHistories })),
  updatePixelInfos: (fullPixelInfos) =>
    set((state) => ({
      pixelInfoHistories: produce(state.pixelInfoHistories, (draft) => {
        for (const fullPixelInfo of fullPixelInfos.pixelInfos) {
          const oldHistory = draft.find((history) => equals(fullPixelInfo.position, history.position));
          if (oldHistory)
            oldHistory.history.unshift({ creationDate: fullPixelInfo.creationDate, color: fullPixelInfo.color });
          else
            draft.push({
              position: fullPixelInfo.position,
              history: [{ creationDate: fullPixelInfo.creationDate, color: fullPixelInfo.color }],
            });
        }
      }),
    })),
}));

export default usePixelInfoStore;
