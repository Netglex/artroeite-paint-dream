import { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import PixelInspectionEntry from './PixelInspectionEntry';
import { PixelInfoDto } from '../../clients/pixel_info';
import usePixelInspectionStore from './PixelInspectionStore';
import usePixelInfoStore from '../../services/PixelInfoStore';
import { equals } from '../../services/api/PixelInfoClient';

type PixelHistoriesProps = { highFormat: boolean } & HTMLAttributes<HTMLDivElement>;

function PixelInspection({ highFormat, className, ...htmlProps }: PixelHistoriesProps) {
  const [pixelInfoHistories] = usePixelInfoStore((state) => [state.pixelInfoHistories]);
  const [currentPosition, hoveringPosition] = usePixelInspectionStore((state) => [
    state.currentPosition,
    state.hoveringPosition,
  ]);

  const relevantPosition = hoveringPosition ?? currentPosition;

  const pixelInfos: PixelInfoDto[] =
    pixelInfoHistories.find((history) => equals(history.position, relevantPosition))?.history ?? [];

  return (
    <div className={twMerge('relative w-full bg-zinc-950', className)} {...htmlProps}>
      <div className={twMerge('flex flex-col gap-3', highFormat ? 'p-6' : 'absolute inset-6 overflow-scroll')}>
        {relevantPosition !== undefined && (
          <>
            <div className="flex flex-row gap-3">
              <div>Position</div>
              <div className="flex w-10 flex-row items-baseline gap-1.5">
                <div className="text-sm text-zinc-300">x</div>
                <div>{relevantPosition?.x}</div>
              </div>
              <div className="flex w-10 flex-row items-baseline gap-1.5">
                <div className="text-sm text-zinc-300">y</div>
                <div>{relevantPosition?.y}</div>
              </div>
            </div>
            {pixelInfos.map((pixelInfo, index) => (
              <PixelInspectionEntry key={`pie${index}`} pixelInfo={pixelInfo} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default PixelInspection;
