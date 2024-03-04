import React from 'react'
import { MeterCompareProps } from "./interfaces"
import './Meter.css'

const MeterCompare: React.FC<MeterCompareProps> = ({ baseSlotValuesToCompare, countryToCompare }) => {
  const labelNames: string[] = ['Super Cheap', 'Cheap', 'Moderate', 'Expensive', 'Very Expensive']
  return (
    <div className="meter">
      {baseSlotValuesToCompare.map((value, index) => (
        <div key={`meter_compare_label_${value}_${index}`}>
          <label>{labelNames[index]}</label>
          <input
            type="number"
            value={value}
            readOnly
            // onChange={(e) => handleSlotChange(index, parseInt(e.target.value))}
          />
        </div>
      ))}
    </div>
  )
}

export default MeterCompare
