import React from 'react'
import { Navigate } from 'react-router-dom'
export default function PrivateRoute(props) {
    const token = localStorage.getItem("key")
  return (
    <div>
      {token ? props.children : <Navigate to="/login"/> }
      </div>
  )
}
