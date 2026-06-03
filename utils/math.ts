import { RatioResult } from '../types';

export const gcd = (a: number, b: number): number => {
  const absA = Math.abs(Math.round(a));
  const absB = Math.abs(Math.round(b));

  if (!absB) {
    return absA;
  }

  return gcd(absB, absA % absB);
};

export const calculateRatio = (width: number, height: number): RatioResult => {
  const roundedWidth = Math.round(width);
  const roundedHeight = Math.round(height);

  if (roundedWidth <= 0 || roundedHeight <= 0) {
    return {
      widthRatio: 0,
      heightRatio: 0,
      decimal: 0,
      gcdValue: 0,
      text: '0:0'
    };
  }

  const divisor = gcd(roundedWidth, roundedHeight);
  const wRatio = roundedWidth / divisor;
  const hRatio = roundedHeight / divisor;
  const decimal = roundedWidth / roundedHeight;

  return {
    widthRatio: wRatio,
    heightRatio: hRatio,
    decimal: decimal,
    gcdValue: divisor,
    text: `${wRatio}:${hRatio}`
  };
};

export const formatDecimal = (num: number): string => {
  return num.toFixed(3).replace(/\.?0+$/, '');
};
