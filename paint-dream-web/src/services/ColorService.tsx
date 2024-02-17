import { ColorDto } from '../clients/pixel_info';
import { clamp } from './MathService';

export const colorValue1To255 = (colorValue: number): number => {
  return clamp(Math.round(colorValue * 255), 0, 255);
};

export const colorToHex = (color: ColorDto): string => {
  return `#${colorValueToHex(color.r)}${colorValueToHex(color.g)}${colorValueToHex(color.b)}`;
};

const colorValueToHex = (colorValue: number): string => {
  const hex = colorValue1To255(colorValue).toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
};
