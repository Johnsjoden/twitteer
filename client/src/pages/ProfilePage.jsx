
import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import PrivateRoute from '../components/PrivateRoute'
import Input from '../components/Input'

export default function ProfilePage() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [image, setImage] = useState("")
    const [imageURL, setImageURL] = useState("")
    const handleLogOut = () => {
        localStorage.clear()
        navigate("/login")
    }
    const token = localStorage.getItem("key")
    const handleOnSubmit = (e) => {
      e.preventDefault()
      console.log(imageURL)
      let formData = new FormData()
      formData.append("uploaded-file", image)
      formData.append("name", name)
      formData.append("email", email)
      formData.append("imageURL", imageURL)
      fetch("/user", {
        method:"PATCH",
        headers: {'Authorization': `Bearer ` + token },
        body: formData
      })
    }
    const handleFileUpload = (e) => {
      e.preventDefault()
      setImage(e.target.files[0])
      setImageURL(Date.now() + e.target.files[0].name)
    }
  return (
    <PrivateRoute>
    <div>
        <h1>Inloggad</h1>
        ProfilePage
        <form onSubmit={handleOnSubmit}>
          <Input type="text" placeholder="name" value={name} setValue={setName} />
          <Input type="text" placeholder="email" value={email} setValue={setEmail}/>
          <input type="file" placeholder='file' onChange={handleFileUpload} />
          <button type="submit">Submit</button>
        </form>
        
        {/* <Input type="file" value={email} setValue={} */}
        <button onClick={handleLogOut}>Log ut</button>
    </div>
    </PrivateRoute>
  )
}
