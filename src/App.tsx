import { useEffect, useState } from 'react'
import mockCurrencyData from './temp/mock_currency_data.json'
import './App.css'


function App() {
  const [selectedCountry, setSelectedCountry] = useState('')
  const [baseSlotValues, setBaseSlotValues] = useState([0, 0, 0, 0, 0])

  const currencyData = mockCurrencyData.data

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
        <p className="subtitle">
          Compare currencies based on values you find expensive or cheap.
        </p>
        {selectedCountry && (
          <p>
            Currency Code: {currencyData[selectedCountry].currency_code}
          </p>
        )}
        {selectedCountry && (
          <div className="ruler">
            <input
              type="number"
              value={baseSlotValues[0]}
              onChange={(e) => handleSlotChange(0, parseInt(e.target.value))}
            />
            <input
              type="number"
              value={baseSlotValues[1]}
              onChange={(e) => handleSlotChange(1, parseInt(e.target.value))}
            />
            <input
              type="number"
              value={baseSlotValues[2]}
              onChange={(e) => handleSlotChange(2, parseInt(e.target.value))}
            />
            <input
              type="number"
              value={baseSlotValues[3]}
              onChange={(e) => handleSlotChange(3, parseInt(e.target.value))}
            />
            <input
              type="number"
              value={baseSlotValues[4]}
              onChange={(e) => handleSlotChange(4, parseInt(e.target.value))}
            />
          </div>
        )}
        {!selectedCountry && (
          <div>
            <p>Start by selecting your home country</p>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              <option value="">Select Country</option>
              {Object.keys(currencyData).map((country) => (
                <option key={country} value={country}>
                  {currencyData[country].country}
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
