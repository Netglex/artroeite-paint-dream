import { HTMLAttributes } from 'react';
import ColorButton from './ColorButton';
import { twMerge } from 'tailwind-merge';
import InspectButton from './InspectButton';
import { ColorDto } from '../../clients/pixel_info';

type ColorPaletteProps = HTMLAttributes<HTMLDivElement>;

function ColorPalette({ className, ...htmlProps }: ColorPaletteProps) {
  const colors: ColorDto[] = [
    { r: 1, g: 1, b: 1 },
    { r: 0.5, g: 0.5, b: 0.5 },
    { r: 0, g: 0, b: 0 },
    { r: 1, g: 0, b: 0 },
    { r: 1, g: 0.5, b: 0 },
    { r: 1, g: 1, b: 0 },
    { r: 0.5, g: 1, b: 0 },
    { r: 0, g: 0.75, b: 0 },
    { r: 0, g: 0.75, b: 1 },
    { r: 0, g: 0, b: 1 },
    { r: 0.5, g: 0, b: 1 },
    { r: 1, g: 0.25, b: 1 },
    { r: 0.75, g: 0.5, b: 0.25 },
    { r: 0.5, g: 0.25, b: 0.25 },
  ];

  return (
    <div className={twMerge('flex w-full flex-wrap gap-2 bg-zinc-800 p-6', className)} {...htmlProps}>
      {colors.map((color, index) => (
        <ColorButton key={`cb${index}`} buttonColor={color} />
      ))}
      <InspectButton key={'ib'} />
    </div>
  );
}

export default ColorPalette;
