// export interface CurrencyDataNode {
//   code: string;
//   value: number;
//   last_updated_at: string;
// }

// export interface CurrencyData {
//   [key: string]: CurrencyDataNode;
// }

export interface CurrencyMeta {
  last_updated_at: string;
}

export interface CurrencyDataNode {
  code: string;
  value: number;
}

export interface CurrencyData {
  [currency: string]: CurrencyDataNode;
}

export interface CurrencyJson {
  meta: CurrencyMeta;
  data: CurrencyData;
}

export interface CachePayload {
  country: string;
  values: number[];
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

export interface CountrySelectorProps {
  selectedCountry: string;
  setSelectedCountry: (value: string) => void;
}
export interface CompareCountrySelectorProps {
  selectedCountriesToCompare: string[];
  setSelectedCountriesToCompare: (value: string[]) => void;
}

export interface ToasterProps {
  message: string;
}