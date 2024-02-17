import { ButtonHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import { colorToHex } from '../../services/ColorService';
import useColorStore from './ColorStore';
import ToggleButton from '../../components/Button';
import { ColorDto } from '../../clients/pixel_info';

type ColorButton = { buttonColor: ColorDto } & ButtonHTMLAttributes<HTMLButtonElement>;

function ColorButton({ buttonColor, className, onClick, ...htmlProps }: ColorButton) {
  var [currentColor, setCurrentColor] = useColorStore((state) => [state.currentColor, state.setCurrentColor]);

  var highlighted =
    currentColor?.r === buttonColor.r && currentColor?.g === buttonColor.g && currentColor?.b === buttonColor.b;

  return (
    <ToggleButton
      highlighted={highlighted}
      className={twMerge('h-7 w-7', className)}
      style={{ backgroundColor: colorToHex(buttonColor) }}
      onClick={() => setCurrentColor(buttonColor)}
      {...htmlProps}
    />
  );
}

export default ColorButton;
