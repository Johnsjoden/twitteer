import React from 'react'

export default function Input({type, setValue, value, placeholder}) {
    const renderInput = (type, setValue, value, placeholder) => {
        return <label htmlFor={placeholder}>{placeholder}<input
        type={type}
        placeholder={value}
        onChange={e => setValue(e.target.value)}
        value={value}
        id={placeholder}
        /></label>
    }
  return (
    <div>
        {renderInput(type, setValue, value, placeholder)}
    </div>
  )
}
