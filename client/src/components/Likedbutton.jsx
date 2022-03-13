import React from 'react'
import { useRef } from 'react'
import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
export default function Likedbutton() {
    const [hasLiked, setHasLiked] = useState(false)
    const client = useRef()
    const handleOnClick = (e) => {
        if(hasLiked){
            setHasLiked(false)
            client.current.emit("message", "true")
        }
        else {
            setHasLiked(true)
            client.current.emit("message", "false")
        }
      }
      useEffect(() => {
        const socket = io("http://localhost:3001")
        client.current = socket;
      }, [])
  return (
    <button onClick={handleOnClick}>{hasLiked ? "unlike" : "Like"}</button>
  )
}
