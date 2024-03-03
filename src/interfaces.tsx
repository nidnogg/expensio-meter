export interface CurrencyDataNode {
  code: string;
  value: number;
}

export interface CurrencyData {
  [key: string]: CurrencyDataNode;
}

export interface MeterProps {
  baseSlotValues: number[];
  handleSlotChange: (index: number, value: number) => void;
}

export interface MeterCompareProps {
  baseSlotValuesToCompare: number[];
  countryToCompare: string;
}