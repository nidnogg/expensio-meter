import { useEffect, useState, useRef } from 'react'
// import mockCurrencyData from './temp/mock_currency_data.json' 
import { CurrencyJson, CurrencyData } from './interfaces'
import { countryCurrencyCodes, countryNamesCountryCodes, countryCodesCountryNames, API_URL } from './consts'
import toast, { Toaster } from 'react-hot-toast';
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { debounce } from 'lodash';

import Header from './Header'
import Meter from './Meter'
import MeterCompare from './MeterCompare'
import './App.css'


function App() {
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedCountriesToCompare, setSelectedCountriesToCompare] = useState<string[]>([])
  const [baseSlotValues, setBaseSlotValues] = useState([0, 0, 0, 0, 0])
  const [currencyJson, setCurrencyJson] = useState<CurrencyJson>({} as CurrencyJson)
  const [currencyData, setCurrencyData] = useState<CurrencyData>({} as CurrencyData)
  const [parent] = useAutoAnimate({
    // Animation duration in milliseconds (default: 250)
    duration: 188,
    // Easing for motion (default: 'ease-in-out')
    easing: 'ease-in-out',
    // When true, this will enable animations even if the user has indicated
    // they don’t want them via prefers-reduced-motion.
    disrespectUserMotionPreference: false
  })

  // Mocked currency Data, used in testing. To be deprecated in a future release.
  // const currencyJson: CurrencyJson = mockCurrencyData
  // const currencyData: CurrencyData = currencyJson.data

  const getSubtitleText = () => {
    if (selectedCountry && selectedCountriesToCompare.length === 0)
      return "Now add a different country to compare its currency."
    return "Compare currencies based on values you find expensive or cheap."
  }

  const handleSlotChange = (index: number, value: number) => {
    const newSlotValues = [...baseSlotValues]
    newSlotValues[index] = value
    setBaseSlotValues(newSlotValues)
    checkForEqualOrCrescentValuesDebounced()
  }

  const resetAppState = () => {
    setSelectedCountry('')
    setSelectedCountriesToCompare([])
    setBaseSlotValues([0, 0, 0, 0, 0])
  }

  const handleCountryRemoval = (countryCode: string) => {
    const countryName = countryCodesCountryNames[countryCode]
    setSelectedCountriesToCompare(selectedCountriesToCompare.filter(country => country !== countryCode))
    toast(`Removed ${countryName}`, {
      duration: 1700,
      position: 'top-center',
      // Styling
      style: {},
      className: '',
      icon: '♻️',
    })
  }

  

  function checkSorted(arr: number[]) { 
    return arr.every((value, index, array) => index === 0 || value >= array[index - 1])
  } 
  const checkForEqualOrCrescentValues = () => {
    if (localStorage.getItem('expensio_ignore_hint') !== 'true' && checkSorted(baseSlotValues)) {
      toast((t) => (
        <span>
          🔍 <b>Hint:</b> try setting increasing values from left to right. <br /> <br />
          <button onClick={() => {
            localStorage.setItem('expensio_ignore_hint', 'true')
            return toast.dismiss(t.id)
          }}>
            Don't show me again
          </button>
        </span>
      ), {
        'position': 'bottom-right', 
      })
    }
  }

  const checkForEqualOrCrescentValuesDebounced = useRef(debounce(() => {
    checkForEqualOrCrescentValues()
  }, 400)).current

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(API_URL)
        const responseBody = await new Response(response.body).text();
        const data = JSON.parse(responseBody)
        setCurrencyJson(data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    setCurrencyData(currencyJson?.data)
  }, [currencyJson])

  useEffect(() => {

  })
  return (
    <>
      <div ref={parent}>
        <Header />
        <p className="subtitle">
          {getSubtitleText()}
        </p>
        {selectedCountry && (
          <button onClick={() => resetAppState()}>Select another home country</button>
        )}
        {selectedCountry && (
          <p ref={parent}>
            Country: {countryCodesCountryNames[selectedCountry]}  | Currency Code: {currencyData[countryCurrencyCodes[selectedCountry]].code}
          </p>
        )}
        {selectedCountry && (
          <div ref={parent}>
            <Meter key={`meter-component`} baseSlotValues={baseSlotValues} handleSlotChange={handleSlotChange} />
            {
              selectedCountriesToCompare && selectedCountriesToCompare.map(country => {
                return (
                  <div key={`meter_compare_${country}`}>
                    <p>
                      Country: {countryCodesCountryNames[country]} | Currency: {currencyData[countryCurrencyCodes[country]]?.code}
                    </p>
                    <button onClick={() => handleCountryRemoval(country)}>Remove</button>
                    <MeterCompare
                      key={`meter_compare_component_${country}`}
                      baseSlotValuesToCompare={baseSlotValues}
                      homeCurrencyCode={currencyData[countryCurrencyCodes[selectedCountry]].code}
                      homeCurrencyRate={currencyData[countryCurrencyCodes[selectedCountry]].value}
                      currencyCodeToCompare={currencyData[countryCurrencyCodes[country]].code}
                      currencyRateToCompare={currencyData[countryCurrencyCodes[country]].value}
                    />
                  </div>
                )
              })
            }

            <br />
            {/* Maybe componentify this too? */}
            <select
              value={""}
              onChange={(e) => {
                setSelectedCountriesToCompare([...selectedCountriesToCompare, e.target.value])
              }}
            >
              <option value="">+ Add Country to Compare</option>
              {Object.entries(countryNamesCountryCodes).map(([countryAndCurrencyName, countryCode]) => (
                <option key={`country_${countryAndCurrencyName}_${countryCode}`} value={countryCode}>
                  {countryAndCurrencyName}
                </option>
              ))}
            </select>
          </div>

        )}
        {!selectedCountry && (
          <div ref={parent}>
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
      <Toaster />
    </>
  )
}

export default App
