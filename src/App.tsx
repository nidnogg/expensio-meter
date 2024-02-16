import { useEffect, useState } from 'react'
import mockCurrencyData from './temp/mock_currency_data.json'
import { CurrencyData } from './interfaces'
import { countryCurrencyCodes, countryNamesCountryCodes } from './consts'
import Header from './Header'
import Meter from './Meter'
import './App.css'


function App() {
  const [selectedCountry, setSelectedCountry] = useState('')
  const [baseSlotValues, setBaseSlotValues] = useState([0, 0, 0, 0, 0])

  const currencyData: CurrencyData = mockCurrencyData.data

  const handleSlotChange = (index: number, value: number) => {
    const newSlotValues = [...baseSlotValues]
    newSlotValues[index] = value
    setBaseSlotValues(newSlotValues)
  }

  useEffect(() => {
    console.log(currencyData)
  })
  return (
    <>
      <div>
        <Header />
        <p className="subtitle">
          Compare currencies based on values you find expensive or cheap.
        </p>
        {selectedCountry && (
          <button onClick={() => setSelectedCountry('')}>Select another country</button>
        )}
        {selectedCountry && (
          <p>
            Currency Code: {currencyData[countryCurrencyCodes[selectedCountry]].code}
          </p>
        )}
        {selectedCountry && (
          <Meter baseSlotValues={baseSlotValues} handleSlotChange={handleSlotChange}/>
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
