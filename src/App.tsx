import { useEffect, useState, Fragment, } from 'react'
// import mockCurrencyData from './temp/mock_currency_data.json' 
import { CurrencyJson, CurrencyData, CachePayload } from './interfaces'
import { countryCurrencyCodes, countryNamesCountryCodes, countryCodesCountryNames, API_URL } from './consts'
import toast, { Toaster } from 'react-hot-toast';
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { Combobox, Dialog, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon, InformationCircleIcon } from '@heroicons/react/20/solid';

import Header from './Header'
import Meter from './Meter'
import MeterCompare from './MeterCompare'
import './App.css'
import CompareCountrySelector from './CompareSelector';
import Footer from './Footer';


function App() {
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedCountriesToCompare, setSelectedCountriesToCompare] = useState<string[]>([])
  const [baseSlotValues, setBaseSlotValues] = useState([0, 0, 0, 0, 0])
  const [currencyJson, setCurrencyJson] = useState<CurrencyJson>({} as CurrencyJson)
  const [currencyData, setCurrencyData] = useState<CurrencyData>({} as CurrencyData)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [query, setQuery] = useState('')
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

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const openModal = () => {
    setIsModalOpen(true)
  }

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
    if (localStorage.getItem('expensio_ignore_hint') !== 'true' && checkSorted(baseSlotValues) && !hintToastShown) {
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
      const { country, values } = cache as CachePayload
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
    const cachePayload: CachePayload = { "country": "", "values": [] }
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

  const countryOptions = Object.entries(countryNamesCountryCodes).map(([countryAndCurrencyName, countryCode]) => ({
    id: countryCode,
    name: countryAndCurrencyName
  }));

  const filteredCountries =
    query === ''
      ? countryOptions
      : countryOptions.filter((country) =>
        country.name
          .toLowerCase()
          .replace(/\s+/g, '')
          .includes(query.toLowerCase().replace(/\s+/g, ''))
      );


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
    <div className="min-h-screen pt-24">
      <div ref={parent}>
        <Header />
        <p className="mt-5 subtitle">
          {getSubtitleText()}
        </p>
        {selectedCountry && (
          <button className="mt-5" onClick={() => resetAppState()}>Select another home country</button>
        )}
        {(selectedCountry && currencyData) && (
          <p ref={parent} className="mt-5">
            <b>Country:</b> {countryCodesCountryNames[selectedCountry]}  | <b>Currency Code:</b> {currencyData[countryCurrencyCodes[selectedCountry]].code}
          </p>
        )}
        {(selectedCountry && currencyData) && (
          <div ref={parent}>
            <Meter key={`meter-component`} baseSlotValues={baseSlotValues} handleSlotChange={handleSlotChange} />
            {
              selectedCountriesToCompare && selectedCountriesToCompare.map(country => {
                return (
                  <div key={`meter_compare_${country}`}>
                    <p className="mt-5">
                      <b>Country:</b> {countryCodesCountryNames[country]} | <b>Currency:</b> {currencyData[countryCurrencyCodes[country]]?.code}
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

            {/* Add Another Country Combobox - TO-DO move this into component */}
            <CompareCountrySelector selectedCountriesToCompare={selectedCountriesToCompare} setSelectedCountriesToCompare={setSelectedCountriesToCompare}/>
          </div>

        )}
        {!selectedCountry && (
          <div>
            <p className="mt-5">Start by selecting your <b>home country</b></p>
            {/* TO-DO remove this */}
            {/* 
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
            */}
            <Combobox value={selectedCountry} onChange={(value) => setSelectedCountry(value)}>
              <div className="relative mt-1">
                <div className="relative w-full cursor-default overflow-hidden rounded-lgtext-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                  <Combobox.Input
                    className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 focus:ring-0"
                    placeholder="Here be nations"
                    onChange={(event) => setQuery(event.target.value)}
                  />
                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </Combobox.Button>
                </div>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                  afterLeave={() => setQuery('')}
                >
                  <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-900 text-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                    {filteredCountries.length === 0 && query !== '' ? (
                      <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                        Nothing found.
                      </div>
                    ) : (
                      filteredCountries.map((country) => (
                        <Combobox.Option
                          key={country.id}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-gray-700 text-white' : 'text-white-900'
                            }`
                          }
                          value={country.id}
                        >
                          {({ selected, active }) => (
                            <>
                              <span
                                className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                  }`}
                              >
                                {country.name}
                              </span>
                              {selected ? (
                                <span
                                  className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-teal-600'
                                    }`}
                                >
                                  <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Combobox.Option>
                      ))
                    )}
                  </Combobox.Options>
                </Transition>
              </div>
            </Combobox>
          </div>
        )}
      </div>

      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    How to use this?
                  </Dialog.Title>
                  <div className="mt-2 flex flex-col gap-3">
                    <p className="text-sm text-gray-600">
                      This app was built after booking a trip to Argentina and struggling a lot to know if something is incredibly expensive or not.
                    </p>
                    <p className="text-sm text-gray-600">
                      The idea is that you select your home country, add increasing values of things that you find cheap, moderately cheap and so forth.
                    </p>
                    <p className="text-sm text-gray-600">
                      Then, add a country to compare and you can get a better idea of how values scale. You can then save that value to your browser's <code>localStorage</code> for later use.
                    </p>
                    <p className="text-sm text-gray-600">
                      If you found this app useful, feel free to check out <a target="_blank" rel="noopener noreferrer" href="https://github.com/Nidnogg/">some other stuff I made</a> or ⭐ <a target="_blank" rel="noopener noreferrer" href="https://github.com/nidnogg/expensio-meter">star it on GitHub</a>. 
                    </p>
                  </div>


                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Got it
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <div className="fixed flex flex-col gap-5 bottom-16 left-16">
        <button
          onClick={openModal}
          className="flex justify-center"
        >
          <span className="flex flex-row gap-2 text-center">
            <InformationCircleIcon className="w-5 h-5 self-center" aria-hidden="true" />
            How to use this?
          </span>
        </button>
        <button className="" onClick={() => { hasCache ? clearCacheData() : saveDataForNextVisit() }}>{cacheText}</button>
      </div>
      <Toaster />
      <Footer />                  
    </div>
  )
}

export default App
