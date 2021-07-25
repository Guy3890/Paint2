//this component for controling the size of the brush
import React from 'react'

export default function RangePicker({LabelText,pickerValue, onInput,minValue ,maxValue}) {
    return (
        <React.Fragment>
              <label>{LabelText} </label>
              <input type="range" value={pickerValue} min={minValue} max={maxValue} onChange ={onInput} />
        </React.Fragment>
             )
  }
