import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from "../components/Input"
export default function SignUpPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const handleOnSubmit = (e) => {
    e.preventDefault()
      axios.post("/user", {
      username: username,
      password: password
      })
      navigate("/login")
  }
  return (
    <div>
      <h1>Sign up</h1>
        <form onSubmit={handleOnSubmit}>
          <Input type="text" label="username" value={username} setValue={setUsername}/>
          <Input type="password" label="password" value={password} setValue={setPassword}/>
          <button submit="submit">submit</button>
        </form>
    </div>
  )
}
