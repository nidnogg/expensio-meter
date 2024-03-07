import React from 'react'
import { MeterCompareProps } from "./interfaces"
import './Meter.css'

const MeterCompare: React.FC<MeterCompareProps> = ({ baseSlotValuesToCompare, exactValues, homeCurrencyRate, currencyRateToCompare }) => {
  const labelNames: string[] = ['Super Cheap', 'Cheap', 'Moderate', 'Expensive', 'Very Expensive']

  const convert = (value: number): number => {
    const homeCurrencyRateBaseUSD = 1.0/homeCurrencyRate
    const currencyRateToCompareBaseUSD = 1.0/currencyRateToCompare
    return ((value * homeCurrencyRateBaseUSD) / currencyRateToCompareBaseUSD)
  }

  return (
    <div className="meter">
      {baseSlotValuesToCompare.map((value, index) => {
        const convertedValue = convert(value)
        return (
          <div key={`meter_compare_label_${value}_${index}`}>
            <label>{labelNames[index]}</label>
            <input
              type="number"
              value={exactValues ? convertedValue.toFixed(4) : Math.round(convertedValue) }
              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              readOnly
            />
          </div>
        )
      })}
    </div>
  )
}

export default MeterCompare
