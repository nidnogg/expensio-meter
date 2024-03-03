import React from 'react'
import { MeterCompareProps } from "./interfaces"
import './Meter.css'

const Meter: React.FC<MeterCompareProps> = ({ baseSlotValuesToCompare, countryToCompare }) => {
  const labelNames: string[] = ['Super Cheap', 'Cheap', 'Moderate', 'Expensive', 'Very Expensive']
  return (
    <div className="meter">
      {baseSlotValuesToCompare.map((value, index) => (
        <div key={`label_name_${value}`}>
          <label>{labelNames[index]}</label>
          <input
            type="number"
            value={value}
            // onChange={(e) => handleSlotChange(index, parseInt(e.target.value))}
          />
        </div>
      ))}
    </div>
  )
}

export default Meter
