import React from 'react'

export default function Input({type, setValue, value, label}) {
    const renderInput = (type, setValue, value, label) => {
        return <label htmlFor={label}>{label}<input
        type={type}
        label={value}
        onChange={e => setValue(e.target.value)}
        value={value}
        id={label}
        /></label>
    }
  return (
    <div>
        {renderInput(type, setValue, value, label)}
    </div>
  )
}
