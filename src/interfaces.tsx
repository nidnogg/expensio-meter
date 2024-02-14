export interface CurrencyDataNode {
  code: string;
  value: number;
}

export interface CurrencyData {
  [key: string]: CurrencyDataNode;
}