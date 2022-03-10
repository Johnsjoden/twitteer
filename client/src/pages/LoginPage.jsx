import React, {useState} from 'react'
import Input from '../components/Input'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
export default function LoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const handleOnSubmit = (e) => {
    e.preventDefault()
    axios.post("/token",
    {
        username,
        password
    })
    .then(res => res.data )
    .then(data => {
     const token = data.token
     localStorage.setItem("key", token)
     navigate("/")
    })
  }
  return (
    <div>
      <h1>Login</h1>
      <p>You dont have a account? What, man this is the site to be at. Sign up right <Link to="/signup">HERE</Link></p>
      <form onSubmit={handleOnSubmit}>
          <Input type="text" label="username" value={username} setValue={setUsername}/>
          <Input type="password" label="password" value={password} setValue={setPassword}/>
          <button submit="submit">submit</button>
        </form>
    </div>
  )
}
