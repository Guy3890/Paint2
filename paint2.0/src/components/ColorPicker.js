//this component is for controling the color picking
import React from 'react';

export default function ColorPicker({LabelText,pickerValue, onInput}) {
    return (
      <React.Fragment>
          
            <label>{LabelText} </label><input type="color" value={pickerValue} onChange ={onInput} />
      </React.Fragment>
           )
}
