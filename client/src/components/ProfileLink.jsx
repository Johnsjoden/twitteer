import React from 'react'
import jwtDecode from 'jwt-decode'
import { Link } from 'react-router-dom'
export default function ProfileLink() {
    const token = localStorage.getItem("key")
    const handleProfileLink = (token) => {
        if(token){
          const user = jwtDecode(token)
          const userId = user.userId
          return <Link to={`/profile/${userId}`}>Profile</Link>
        }
        return ""
      }
  return (
    handleProfileLink(token)
  )
}
