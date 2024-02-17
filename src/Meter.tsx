import React from 'react'
import { MeterProps } from "./interfaces"
import './Meter.css'

const Meter: React.FC<MeterProps> = ({ baseSlotValues, handleSlotChange }) => {
  const labelNames: string[] = ['Super Cheap', 'Cheap', 'Moderate', 'Expensive', 'Very Expensive']
  return (
    <div className="meter">
      {baseSlotValues.map((value, index) => (
        <div key={index}>
          <label>{labelNames[index]}</label>
          <input
            type="number"
            value={value}
            onChange={(e) => handleSlotChange(index, parseInt(e.target.value))}
          />
        </div>
      ))}
    </div>
  )
}

export default Meter
