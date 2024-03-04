import React, { useState } from 'react'
import { MeterProps } from "./interfaces"
import './Meter.css'

const Meter: React.FC<MeterProps> = ({ baseSlotValues, handleSlotChange }) => {
  const labelNames: string[] = ['Super Cheap', 'Cheap', 'Moderate', 'Expensive', 'Very Expensive']

  const [inputValues, setInputValues] = useState<number[]>(baseSlotValues);

  const debounce = (func: any, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  // Handle input change with debounce
  const handleInputChange = (index: number, value: number) => {
    const newValues = [...inputValues];
    newValues[index] = value;
    setInputValues(newValues);
    handleSlotChange(index, value);
  };
  return (
    <div className="meter">
      {baseSlotValues.map((value, index) => (
        <div key={`meter_label_${value}_${index}`}>
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
