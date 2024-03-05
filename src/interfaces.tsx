export interface CurrencyDataNode {
  code: string;
  value: number;
  last_updated_at: string;
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
  homeCurrencyCode: string;
  homeCurrencyRate: number;
  currencyCodeToCompare: string;
  currencyRateToCompare: number;
}

export interface ToasterProps {
  message: string;
}