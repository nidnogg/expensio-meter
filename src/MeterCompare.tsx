import React from 'react'
import { MeterCompareProps } from "./interfaces"
import './Meter.css'


const MeterCompare: React.FC<MeterCompareProps> = ({ baseSlotValuesToCompare, homeCurrencyCode, homeCurrencyRate, currencyCodeToCompare, currencyRateToCompare }) => {
  const labelNames: string[] = ['Super Cheap', 'Cheap', 'Moderate', 'Expensive', 'Very Expensive']

  const convert = (value: number) => {
    const homeCurrencyRateBaseUSD = 1.0/homeCurrencyRate
    const currencyRateToCompareBaseUSD = 1.0/currencyRateToCompare
    return (value * homeCurrencyRateBaseUSD) / currencyRateToCompareBaseUSD
  }

  return (
    <div className="meter">
      {baseSlotValuesToCompare.map((value, index) => {
        console.log(value, index);
        const convertedValue = convert(value)
        return (
          <div key={`meter_compare_label_${value}_${index}`}>
            <label>{labelNames[index]}</label>
            <input
              type="number"
              value={convertedValue}
              readOnly
              // onChange={(e) => handleSlotChange(index, parseInt(e.target.value))}
            />
          </div>
        )
      })}
    </div>
  )
}

export default MeterCompare
