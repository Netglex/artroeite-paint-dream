import { create } from 'zustand';
import { FullPixelInfoDto, PixelInfoHistoryDto } from '../clients/pixel_info';
import { equals } from './api/PixelInfoClient';

interface PixelInfoState {
  pixelInfoHistories: PixelInfoHistoryDto[];
  setPixelInfoHistories: (pixelInfoHistories: PixelInfoHistoryDto[]) => void;
  updatePixelInfo: (fullPixelInfo: FullPixelInfoDto) => void;
}

const usePixelInfoStore = create<PixelInfoState>((set) => ({
  pixelInfoHistories: [],
  setPixelInfoHistories: (pixelInfoHistories) => set(() => ({ pixelInfoHistories })),
  updatePixelInfo: (fullPixelInfo) =>
    set((state) => {
      const oldHistories = state.pixelInfoHistories;
      const oldHistory = oldHistories.find((history) => equals(fullPixelInfo.position, history.position)) ?? undefined;
      var newHistories: PixelInfoHistoryDto[];
      if (oldHistory) {
        newHistories = oldHistories.map(
          (history): PixelInfoHistoryDto =>
            equals(fullPixelInfo.position, history.position)
              ? {
                  position: fullPixelInfo.position,
                  history: [
                    { creationDate: fullPixelInfo.creationDate, color: fullPixelInfo.color },
                    ...history.history,
                  ],
                }
              : history,
        );
      } else {
        newHistories = [
          ...oldHistories,
          {
            position: fullPixelInfo.position,
            history: [{ creationDate: fullPixelInfo.creationDate, color: fullPixelInfo.color }],
          },
        ];
      }

      return { pixelInfoHistories: newHistories };
    }),
}));

export default usePixelInfoStore;
