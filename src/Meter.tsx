import React from 'react'
import { MeterProps } from "./interfaces"
import './Meter.css'

const Meter: React.FC<MeterProps> = ({ baseSlotValues, handleSlotChange }) => {
  const labelNames: string[] = ['Super Cheap', 'Cheap', 'Moderate', 'Expensive', 'Very Expensive']
  
  return (
    <div className="meter">
      {baseSlotValues.map((value, index) => (
        <div key={`meter_label_${value}_${index}`}>
          <label>{labelNames[index]}</label>
          <input
            autoFocus
            type="number"
            min="0"
            max="100000000000"
            value={baseSlotValues[index]}
            onKeyDown={(event) => {
              if (/[A-Za-z]/.test(event.key) 
                && !event.ctrlKey 
                && !event.altKey 
                && !event.metaKey
                && !event.shiftKey 
                && event.key !== ' ' 
                && event.key !== 'Tab' 
                && event.key !== 'Backspace') { 
                event.preventDefault();
              }
            }}
            onChange={(event) => {
              if (!isNaN(parseInt(event.target.value))) {
                handleSlotChange(index, parseInt(event.target.value))
              }
            }}
          />
          
        </div>
      ))}
    </div>
  )
}

export default Meter
