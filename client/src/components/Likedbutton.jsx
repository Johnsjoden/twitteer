import jwtDecode from 'jwt-decode'
import React from 'react'
import { useContext } from 'react'
import { useState, useEffect } from 'react'
import { apiContext } from '../App'
export default function Likedbutton(props) {
    const [hasLiked, setHasLiked] = useState(false)
    const {
      client,
      getApi
    } = useContext(apiContext)
    console.log(props.userLikeData)
    const userLikeData = props.userLikeData
    const token = localStorage.getItem("key")
      console.log(props.postId)
      const user = jwtDecode(token)
      const userId = user.userId
    const handleOnClick = (e) => {
        if(hasLiked){
            setHasLiked(false)
            const like = {
              like: false,
              userId,
              postId: props.postId
            }
            client.current.emit("like", like)
            getApi()
        }
        else {
            setHasLiked(true)
            const like = {
              like: true,
              userId,
              postId: props.postId
            }
            client.current.emit("like", like)
            getApi()
        }
      }
      useEffect(() => {
        userLikeData.forEach(user => {
          if(user === userId){ 
            setHasLiked(true)
          }
        })
      }, [])
  return (
    <button onClick={handleOnClick}>{hasLiked ? "unlike" : "Like"}</button>
  )
}
