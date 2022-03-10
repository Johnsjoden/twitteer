import React, {useState} from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PrivateRoute from '../components/PrivateRoute'
import Input from '../components/Input'
import { useEffect } from 'react'
import axios from 'axios'

export default function ProfilePageBug() {
    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [image, setImage] = useState("")
    const [imageURL, setImageURL] = useState("")
    const [profileData, setProfileData] = useState({})
    const [username, setUsername] = useState("")
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [checkPassword, setCheckPassword] = useState("")
    const [postData, setPostData] = useState([])

    const params = useParams()
    const id = params.id
    const navigate = useNavigate()

    const handleLogOut = () => {
        localStorage.clear()
        navigate("/login")
    }

    
    const fetchData = () => {
      fetch(`/profile/${id}`)
      .then(res => res.json())
      .then(data => {
      setEmail(data.email)
      setUsername(data.username)
      setName(data.name)
      setProfileData(data)
    })
      fetch(`/post/${id}`)
      .then(res => res.json())
      .then(data => setPostData(data))
    }

    useEffect(() => {
      fetchData()
    }, [])

    const token = localStorage.getItem("key")
    const handleOnSubmit = (e) => {
        e.preventDefault()
        let formData = new FormData()
        formData.append("uploaded-file", image)
        formData.append("name", name)
        formData.append("email", email)
        formData.append("imageURL", imageURL)
        formData.append("username", username)
  
        fetch("/user", {
          method:"PATCH",
          headers: {'Authorization': `Bearer ` + token },
          body: formData
        })
        fetchData()
      }
      const handleFileUpload = (e) => {
        e.preventDefault()
        setImage(e.target.files[0])
        setImageURL(Date.now() + e.target.files[0].name)
      }

      const handlePassword = () => {
        const payload = {
          oldPassword,
          newPassword,
          checkPassword
        }
        fetch("/password", {
          method: "POST",
          headers: {"Auhorization": `Bearer ` + token},
          body: JSON.stringify(payload)
        })
      }
      const handleOnDelete = (id, e) => {
        e.preventDefault()
        axios.delete(`/delete/${id}`, {
          headers: {"Auhorization": `Bearer ` + token},
          post: postData
        })
        fetchData()
      }
  return (
    <PrivateRoute>
        <div>ProfilePageBug
        <div className='container'>
        <nav className="navbar-nav-scroll fixed-top navbar-light bg-light">
            <div className="container-fluid">
            <span className="navbar-brand">Username: {profileData.username}</span>
            <span className="navbar-brand">Name: {profileData.name}</span>
            <span className="navbar-brand">Email: {profileData.email}</span>
            </div>
        </nav>
        <br/>
        {
          postData.map((item, index) => {
            return <div key={index} >
              <p>{item.content}</p>
              <p>{item.date}</p>
              <img className='img-fluid img-thumbnail' style={{width: "10%"}} src={item.userId.imageURL} alt="profile" /> <br/>
              <button className="btn-primary"onClick={e => handleOnDelete(item._id, e)}>DELETE</button>
            </div>
            
          }) 
        }
        <form onSubmit={handleOnSubmit}>
          <Input type="text" label="name" value={name} setValue={setName} />
          <Input type="text" label="email" value={email} setValue={setEmail}/>
          <Input type="text" label="username" value={username} setValue={setUsername} />
          <input type="file" label='file' onChange={handleFileUpload} />
          <button type="submit">Submit</button>
        </form>
        <br></br>
        <form onSubmit={handlePassword}>
          <Input type="text" label="Current" value={oldPassword} setValue={setOldPassword} />
          <Input type="text" label="new" value={newPassword} setValue={setNewPassword} />
          <Input type="text" label="Retype new" value={checkPassword} setValue={setCheckPassword} />
          <button type="submit">Submit</button>
        </form>
        <button onClick={handleLogOut}>log out</button>
        </div>
        </div>

        
    </PrivateRoute>
    
  )
}