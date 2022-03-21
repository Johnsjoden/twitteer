import React from 'react'

export default function Message({userId}) {
    const token = localStorage.getItem("key")
    const handleOnClick = () => {
        console.log(userId)
    }
  return (
    <div>
        <textarea></textarea>
        <button onClick={handleOnClick}>Send</button>
    </div>
    
  )
}
