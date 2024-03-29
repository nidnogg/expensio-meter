import { useEffect, useState, Fragment } from 'react'
// import mockCurrencyData from './temp/mock_currency_data.json' 
import { CurrencyJson, CurrencyData, CachePayload } from './interfaces'
import { countryCurrencyCodes, countryCodesCountryNames, API_URL } from './consts'
import toast, { Toaster } from 'react-hot-toast';
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { Dialog, Transition, Menu, Switch } from '@headlessui/react';
import { InformationCircleIcon } from '@heroicons/react/20/solid';
import Header from './Header'
import Meter from './Meter'
import MeterCompare from './MeterCompare'
import './App.css'
import CompareCountrySelector from './CompareSelector';
import Footer from './Footer';
import CountrySelector from './CountrySelector';

function App() {
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedCountriesToCompare, setSelectedCountriesToCompare] = useState<string[]>([])
  const [baseSlotValues, setBaseSlotValues] = useState([0, 0, 0, 0, 0])
  const [currencyJson, setCurrencyJson] = useState<CurrencyJson>({} as CurrencyJson)
  const [currencyData, setCurrencyData] = useState<CurrencyData>({} as CurrencyData)
  const [exactValues, setExactValues] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  // Actually uses `active` prop
  // const [isMenuEnabled, setMenuEnabled] = useState<boolean>(false)
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
          <button className="inline-flex justify-center rounded-md border border-transparent bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 transition ease-in-out"
            onClick={() => {
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
    <div className="min-h-screen pt-32">
      <div ref={parent}>
        <Header />
        <p className="mt-5 subtitle">
          {getSubtitleText()}
        </p>
        {selectedCountry && (
          <div>
            <button className="mt-5 btn-base" onClick={() => resetAppState()}>Select another home country</button>
            <div className="pt-5 flex flex-row gap-2 justify-center">
              <p className="text-gray-500 text-sm font-light py-1">Show Exact Conversion Values</p>
              <Switch
                checked={exactValues}
                onChange={setExactValues}
                className={`${exactValues ? 'bg-zinc-900' : 'bg-zinc-700'}
          relative inline-flex h-[28px] w-[60px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white/75`}
              >
                <span className="sr-only">Use setting</span>
                <span
                  aria-hidden="true"
                  className={`${exactValues ? 'translate-x-9' : 'translate-x-0'}
            pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                />
              </Switch>
              {/* <p className="text-gray-400 text-sm font-light py-2">On</p> */}
            </div>
          </div>
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
                      exactValues={exactValues}
                      homeCurrencyCode={currencyData[countryCurrencyCodes[selectedCountry]].code}
                      homeCurrencyRate={currencyData[countryCurrencyCodes[selectedCountry]].value}
                      currencyCodeToCompare={currencyData[countryCurrencyCodes[country]].code}
                      currencyRateToCompare={currencyData[countryCurrencyCodes[country]].value}
                    />
                    <br />
                    <button className="base-btn" onClick={() => handleCountryRemoval(country)}>Remove Country</button>
                  </div>
                )
              })
            }

            <br />

            {/* Add Another Country Combobox - TO-DO move this into component */}
            <CompareCountrySelector selectedCountriesToCompare={selectedCountriesToCompare} setSelectedCountriesToCompare={setSelectedCountriesToCompare} />
          </div>

        )}
        {!selectedCountry && (
          <div>
            <p className="mt-5">Start by selecting your <b>home country</b></p>
            <CountrySelector selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} />

          </div>
        )}
      </div>

      {/* About Modal code */}
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
                    How to use this
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
                    <h3 className="text-gray-600">Ok, but why?</h3>
                    <p className="text-sm text-gray-600">
                      This is useful so you have approximate values you can use as a reference when you find prices out in the wild. Many times we end up converting the same old
                      values time and time again and don't really let that sink into memory.
                    </p>
                    <p className="text-sm text-gray-600">
                      If you found this app useful, feel free to check out ⭐ <a target="_blank" rel="noopener noreferrer" href="https://github.com/Nidnogg/">some other stuff I made</a>.
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

      {/* Mobile menu */}
      <div className="visible lg:invisible absolute flex flex-col gap-5">
        <div className="fixed top-16 w-56 right-8 text-right">
          <Menu as="div" className="relative inline-block text-left">
            <div>
              {/* Hamburger Menu */}
              <Menu.Button className="inline-flex w-full justify-center rounded-md bg-[#1a1a1a]/20 hover:bg-[#1a1a1a] px-4 py-4 text-sm font-medium text-white  focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
                {({ open }) => (
                  <nav className="flex flex-col justify-center sm:py-12">
                    <button
                      className="text-white w-6 h-6 relative focus:outline-none bg-whit"
                    >
                      <div className="block w-5 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <span
                          aria-hidden="true"
                          className={`block absolute top-[6px] h-0.5 w-5 bg-current transform transition duration-500 ease-in-out ${open ? 'rotate-45 -translate-y-1.5' : ''
                            }`}
                        ></span>
                        <span
                          aria-hidden="true"
                          className={`block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out ${open ? 'opacity-0' : ''
                            }`}
                        ></span>
                        <span
                          aria-hidden="true"
                          className={`block absolute bottom-[4px] h-0.5 w-5 bg-current transform transition duration-500 ease-in-out ${open ? '-rotate-45 translate-y-1.5' : ''
                            }`}
                        ></span>
                      </div>
                    </button>
                  </nav>
                )
                }
              </Menu.Button>
            </div>
            <Transition

              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-zinc-800 rounded-md bg-[#1a1a1a] shadow-lg ring-1 ring-black/5 focus:outline-none transition ease-in-out">
                <div className="px-1 py-1 flex flex-col gap-2">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${active ? 'bg-zinc-800 text-white' : 'text-white'
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm transition ease-in-out`}
                        onClick={openModal}

                      >
                        <InformationCircleIcon className="w-5 h-5 self-center" aria-hidden="true" />
                        How to use this
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${active ? 'bg-zinc-800 text-white' : 'text-white'
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm transition ease-in-out`}
                        onClick={() => { hasCache ? clearCacheData() : saveDataForNextVisit() }}
                      >
                        {cacheText}
                      </button>
                    )}
                  </Menu.Item>
                </div>
                {/* If needing an extra section, use this */}
                {/* 
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${active ? 'bg-violet-500 text-white' : 'text-white'
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        Archive
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${active ? 'bg-violet-500 text-white' : 'text-white'
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        Move
                      </button>
                    )}
                  </Menu.Item>
                </div>
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${active ? 'bg-violet-500 text-white' : 'text-white'
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        Delete
                      </button>
                    )}
                  </Menu.Item>
                </div>
                */}

              </Menu.Items>
            </Transition>
          </Menu>
        </div>

      </div>
      {/* Desktop Menu */}
      <div className="invisible lg:visible fixed flex flex-col gap-5 bottom-16 left-16">
        <button
          onClick={openModal}
          className="flex justify-center btn-base"
        >
          <span className="flex flex-row gap-2 text-center">
            <InformationCircleIcon className="w-5 h-5 self-center" aria-hidden="true" />
            How to use this
          </span>
        </button>
        <button className="btn-base" onClick={() => { hasCache ? clearCacheData() : saveDataForNextVisit() }}>{cacheText}</button>
      </div>
      <Toaster />
      <Footer />
    </div>
  )
}

export default App
