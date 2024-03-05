import React, {useEffect} from 'react'
import { CurrencyData, MeterCompareProps } from "./interfaces"
import mockCurrencyData from './temp/mock_currency_data.json'
import './Meter.css'


const MeterCompare: React.FC<MeterCompareProps> = ({ baseSlotValuesToCompare, homeCurrencyCode, homeCurrencyRate, currencyCodeToCompare, currencyRateToCompare }) => {
  const labelNames: string[] = ['Super Cheap', 'Cheap', 'Moderate', 'Expensive', 'Very Expensive']

  const convert = (value: number) => {
    console.log('homecountry vs countryToCompare', homeCurrencyCode, currencyCodeToCompare)    
    console.log('homecountryRate vs countryToCompareRate', homeCurrencyRate, currencyRateToCompare)
    const homeCurrencyRateBaseUSD = 1.0/homeCurrencyRate
    const currencyRateToCompareBaseUSD = 1.0/currencyRateToCompare
    console.log("baseHome vs compareHoem", homeCurrencyRateBaseUSD, currencyRateToCompareBaseUSD);
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
