export interface RatioResult {
  widthRatio: number;
  heightRatio: number;
  decimal: number;
  gcdValue: number;
  text: string;
}

export interface PresetRatio {
  label: string;
  width: number;
  height: number;
  description?: string;
}

export enum CalculationMode {
  ResToRatio = 'RES_TO_RATIO', // Resolution -> Ratio
  RatioToRes = 'RATIO_TO_RES', // Ratio + Dim -> Other Dim
}