import { useState, Fragment } from 'react'
import { Combobox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { countryNamesCountryCodes } from './consts'
import { CompareCountrySelectorProps } from './interfaces';




const CompareCountrySelector: React.FC<CompareCountrySelectorProps> = ({selectedCountriesToCompare, setSelectedCountriesToCompare}) => {
  const [query, setQuery] = useState('')

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
  

      
  return (
    <Combobox value={""} onChange={(value) => {
      setSelectedCountriesToCompare([...selectedCountriesToCompare, value as string]);
    }}>
      <div className="relative mt-1">
        <div className="relative w-full cursor-default overflow-hidden rounded-lg text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
          <Combobox.Input
            className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 focus:ring-0"
            placeholder="Add another Country to Compare"
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
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-gray-700 text-white' : 'text-white-900'}`
                  }
                  value={country.id}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}
                      >
                        {country.name}
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-teal-600'}`}
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

  )
}

export default CompareCountrySelector