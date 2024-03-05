import { useEffect, useState } from 'react'
// import mockCurrencyData from './temp/mock_currency_data.json' 
import { CurrencyJson, CurrencyData, CachePayload } from './interfaces'
import { countryCurrencyCodes, countryNamesCountryCodes, countryCodesCountryNames, API_URL } from './consts'
import toast, { Toaster } from 'react-hot-toast';
import { useAutoAnimate } from '@formkit/auto-animate/react'

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
  const [hintToastShown, setHintToastShown] = useState<boolean>(false)
  const [hasCache, setHasCache] = useState<boolean>(false)
  const [cacheText, setCacheText] = useState<string>("💾 Save Data for Next Visit")

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
    checkForEqualOrCrescentValues()
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

  const checkForEqualOrCrescentValues = async () => {
    if (localStorage.getItem('expensio_ignore_hint') !== 'true' && checkSorted(baseSlotValues) && !hintToastShown ) {
      setHintToastShown(true)
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
        'id': 'hint',
        'position': 'bottom-right', 
        'duration': 5000,
      })
    }
  }

  const checkCachedData = () => {
    const cacheString = localStorage.getItem('expensio_meter_cache')
    if (cacheString !== null) {
      setHasCache(true)
      const cache = JSON.parse(cacheString)
      const {country, values} = cache as CachePayload
      let toastMessage = "Successfully loaded "
      if (country.length > 0) {
        setSelectedCountry(country)
        toastMessage = toastMessage.concat("country ")
      } else {
        toastMessage = "No previous data found"
        return 0
      }
      if (values.length > 0) {
        setBaseSlotValues(values)
        toastMessage = toastMessage.concat("and currency ")
      }
      toastMessage = toastMessage.concat("data from cache.")
      console.log(toastMessage)
      toast.success(toastMessage,
        {
          style: {
            // borderRadius: '10px',
            // background: '#333',
            // color: '#fff',
          },
        }
      )    
    }
  }
  const saveDataForNextVisit = () => {
    const cachePayload: CachePayload = {"country": "", "values": []}
    if (selectedCountry) {
      cachePayload.country = selectedCountry
    }

    if (baseSlotValues) {
      cachePayload.values = baseSlotValues
    }
    console.log("storingCache", cachePayload)
    if (cachePayload.country === "") {
      toast.error('Please try selecting a country and adding data before',
        {
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }
      )
      return 0
    }
    localStorage.setItem('expensio_meter_cache', JSON.stringify(cachePayload))
    toast.success('Saved to cache successfully',
      {
        style: {
          // borderRadius: '10px',
          // background: '#333',
          // color: '#fff',
        },
      }
    )
  }

  const clearCacheData = () => {
    try {
      localStorage.removeItem('expensio_meter_cache')
      setHasCache(false)
      hasCache ? setCacheText("♻️ Clear Saved Data") : setCacheText("💾 Save Data for Next Visit")
      toast.success("Sucessfully cleared data cache",
        {
          style: {
            // borderRadius: '10px',
            // background: '#333',
            // color: '#fff',
          },
        }
      )    
    } catch (err) {
      toast.error(`Failed to delete cached data. Check console for details`)
      console.log(err)
    }
  }
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
    console.log("Checking cached data...")
    checkCachedData()
  }, [])

  useEffect(() => {
    hasCache ? setCacheText("♻️ Clear Saved Data") : setCacheText("💾 Save Data for Next Visit")
  }, [hasCache]);


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
        { (selectedCountry && currencyData) && (
          <p ref={parent}>
            Country: {countryCodesCountryNames[selectedCountry]}  | Currency Code: {currencyData[countryCurrencyCodes[selectedCountry]].code}
          </p>
        )}
        {(selectedCountry && currencyData) && (
          <div ref={parent}>
            <Meter key={`meter-component`} baseSlotValues={baseSlotValues} handleSlotChange={handleSlotChange} />
            {
              selectedCountriesToCompare && selectedCountriesToCompare.map(country => {
                return (
                  <div key={`meter_compare_${country}`}>
                    <p>
                      Country: {countryCodesCountryNames[country]} | Currency: {currencyData[countryCurrencyCodes[country]]?.code}
                    </p>
                    <MeterCompare
                      key={`meter_compare_component_${country}`}
                      baseSlotValuesToCompare={baseSlotValues}
                      homeCurrencyCode={currencyData[countryCurrencyCodes[selectedCountry]].code}
                      homeCurrencyRate={currencyData[countryCurrencyCodes[selectedCountry]].value}
                      currencyCodeToCompare={currencyData[countryCurrencyCodes[country]].code}
                      currencyRateToCompare={currencyData[countryCurrencyCodes[country]].value}
                    />
                    <br />
                    <button onClick={() => handleCountryRemoval(country)}>Remove</button>
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
      <button className="save-data-btn" onClick={() => {hasCache ? clearCacheData() : saveDataForNextVisit()}}>{cacheText}</button>
      <Toaster />
    </>
  )
}

export default App
