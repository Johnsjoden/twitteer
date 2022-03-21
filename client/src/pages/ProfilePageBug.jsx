import React, {useState, useContext} from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import reactStringReplace from 'react-string-replace'
import Input from '../components/Input'
import { useEffect } from 'react'
import axios from 'axios'
import jwt_decode from "jwt-decode";
import { apiContext } from '../App'
import Message from "../components/Message"

export default function ProfilePageBug() {
    const {
      getData,
      getApi
    } = useContext(apiContext)
    const [contentData, setContentData] = useState("")
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
        .then(res => {
          fetchData()
          setImage("")
        })
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
          headers: {"Authorization": `Bearer ` + token},
          body: JSON.stringify(payload)
        })
      }
      const handleOnDelete = (id, e) => {
        e.preventDefault()
        axios.delete(`/delete/${id}`, {
          headers: {"Authorization": `Bearer ` + token},
          post: postData
        })
        fetchData()
        getApi()
      }
      const renderForm = () => {
        if(token == null){
          return ""
        }else {
          const decode = jwt_decode(token)
          const userId = decode.userId
          if(userId === id){
            return <div>
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
          }
        }
      } 
      const renderDeleteButton = (item) => {
        if(token == null){
          return ""
        }else {
          const decode = jwt_decode(token)
          const userId = decode.userId
          if(userId === id)
           return <button className="btn-primary"onClick={e => handleOnDelete(item._id, e)}>DELETE</button>
        }
       
        
      }
      const renderLink = (content) => {
        content = reactStringReplace(content, /#(\S+)/g, (match, i) => (
          <Link key={match + i} to={`/hashtag/${match}`}>#{match}</Link>
        ));
        return content
      }
  return (
        <div>
        <div className='container'>
          <div className="row">
            <div className='col-3'>
              <img className='img-thumbnail' src={profileData.imageURL} />
              <p>Username: {profileData.username}</p>
              <p>Name: {profileData.name}</p> 
              <p>Email: {profileData.email}</p>
              < Message userId={id} />
              
        {
          renderForm(token)
        }
            </div>
            <div className='col-9'>
            {postData.map((item, index) => {
            return <div key={index}>
              <div className="card" style={{width: "18rem;"}}>
                <Link to={`/profile/${item.userId._id}`}><img className='img-fluid img-thumbnail' style={{width: "10%"}} src={item.userId.imageURL} alt="Jävlar" /></Link>
                {/* <div>{handlehashTagContent(item.content)}<Link to={`/hashtag/${rightWay(item.content)}`}>{handleHashTagName(item.content)}</Link></div> */}
                <div>{renderLink(item.content)}</div>
                {/* <div dangerouslySetInnerHTML={{ __html: handleHashtag(item.content)}}></div> */}
                
                <Link to={`/profile/${item.userId._id}`}>{item.userId.username}</Link> <br/>
                <p>{item.date}</p> </div>
                {renderDeleteButton(item)}
              
            </div>  
        })}
            </div>
        <br/>
        
        </div>
        </div>
        </div>
  )
}
