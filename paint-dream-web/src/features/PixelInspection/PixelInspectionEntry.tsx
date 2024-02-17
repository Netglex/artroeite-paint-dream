import { HTMLAttributes } from 'react';
import { colorToHex } from '../../services/ColorService';
import { twMerge } from 'tailwind-merge';
import { PixelInfoDto } from '../../clients/pixel_info';
import { Timestamp } from '../../clients/google/protobuf/timestamp';

type PixelHistoryProps = { pixelInfo: PixelInfoDto } & HTMLAttributes<HTMLDivElement>;

function PixelInspectionEntry({ pixelInfo, className, ...htmlProps }: PixelHistoryProps) {
  const date = Timestamp.toDate(pixelInfo.creationDate!);
  return (
    <div className={twMerge('flex w-full flex-row items-center gap-6', className)} {...htmlProps}>
      <div className="h-7 w-7 rounded" style={{ backgroundColor: colorToHex(pixelInfo.color!) }} />
      <div className="flex flex-grow flex-row items-baseline">
        <div className="w-20 text-sm">{date.toLocaleTimeString()}</div>
        <div className="text-xs text-zinc-300">{date.toLocaleDateString()}</div>
      </div>
    </div>
  );
}

export default PixelInspectionEntry;
