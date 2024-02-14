import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import mockCurrencyData from './temp/mock_currency_data.json'
import viteLogo from '/vite.svg'
import './App.css'


function App() {
  const [count, setCount] = useState(0)
  const currencyData = mockCurrencyData.data
  useEffect(() => {
    console.log(currencyData)
  })
  return (
    <>
      <div>
        <p className="subtitle">
          Compare currencies based on values you find expensive or cheap.
        </p>
        <p>Start by selecting your home country</p>
      </div>
    </>
  )
}

export default App
