import { useEffect, useState } from 'react'
import mockCurrencyData from './temp/mock_currency_data.json'
import { CurrencyData } from './interfaces'
import { countryCurrencyCodes, countryNamesCountryCodes } from './consts'
import Header from './Header'
import Meter from './Meter'
import MeterCompare from './MeterCompare'
import './App.css'


function App() {
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedCountriesToCompare, setSelectedCountriesToCompare] = useState<string[]>([])

  const [baseSlotValues, setBaseSlotValues] = useState([0, 0, 0, 0, 0])

  const currencyData: CurrencyData = mockCurrencyData.data

  const getSubtitleText = () => {
    if (selectedCountry && selectedCountriesToCompare.length === 0) 
      return "Now add a different country to compare its currency."
    return "Compare currencies based on values you find expensive or cheap."  
  }
  const handleSlotChange = (index: number, value: number) => {
    const newSlotValues = [...baseSlotValues]
    newSlotValues[index] = value
    setBaseSlotValues(newSlotValues)
  }

  useEffect(() => {
  })
  return (
    <>
      <div>
        <Header />
        <p className="subtitle">
          {getSubtitleText()}
        </p>
        {selectedCountry && (
          <button onClick={() => setSelectedCountry('')}>Select another home country</button>
        )}
        {selectedCountry && (
          <p>
            Country {selectedCountry} | Currency Code: {currencyData[countryCurrencyCodes[selectedCountry]].code}
          </p>
        )}
        {selectedCountry && (
          <>
            <Meter baseSlotValues={baseSlotValues} handleSlotChange={handleSlotChange}/>
            {
              selectedCountriesToCompare && selectedCountriesToCompare.map(country => {
                return (
                  <div key={`meter_compare_${country}`}>
                    <p>
                      Country: {country} | Currency: {currencyData[countryCurrencyCodes[country]].code}
                    </p>
                    <MeterCompare baseSlotValuesToCompare={baseSlotValues} countryToCompare={country}/>
                  </div>
                )
              })
            }

            {/* Maybe componentify this too? */}
            <br />
            <select
                value={""}
                onChange={(e) => {
                  console.log("before", selectedCountriesToCompare)
                  setSelectedCountriesToCompare([...selectedCountriesToCompare, e.target.value]);
                  console.log("after", selectedCountriesToCompare)

                }}
              >
                <option value="">+ Add Country to Compare</option>
                {Object.entries(countryNamesCountryCodes).map(([countryAndCurrencyName, countryCode]) => (
                  <option key={`country_${countryAndCurrencyName}_${countryCode}`} value={countryCode}>
                    {countryAndCurrencyName}
                  </option>
                ))}
            </select>
          </>

        )}
        {!selectedCountry && (
          <div>
            <p>Start by selecting your home country</p>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              <option value="">Select Country</option>
              {Object.entries(countryNamesCountryCodes).map(([countryAndCurrencyName, countryCode]) => (
                <option key={countryAndCurrencyName} value={countryCode}>
                  {countryAndCurrencyName}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </>
  )
}

export default App
