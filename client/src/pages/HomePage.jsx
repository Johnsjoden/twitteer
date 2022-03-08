import React, { useContext } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { apiContext } from '../App'
import PrivateRoute from '../components/PrivateRoute'
const axios = require("axios")
export default function HomePage() {
    const {
      getData,
      getApi
    } = useContext(apiContext)
    const [contentData, setContentData] = useState("")
    const token = localStorage.getItem("key")
    const handleOnSubmit = (e) => {
        const payload = {
          contentData
        }
        e.preventDefault()
        fetch("/posts", {
          method: "POST",
          headers: {
            "Content-type": "Application/json",
            'Authorization': `Bearer ` + token
          },
            body: JSON.stringify(payload)
        })
        getApi()
    }
    const handleOnDelete = (id, e) => {
      e.preventDefault()
      axios.delete(`/delete/${id}`, {
        post: contentData
      })
      getApi()
    }
    console.log(getData)
  return (
    <div>
        <form onSubmit={handleOnSubmit}>
            <textarea type="text" value={contentData} onChange={e => setContentData(e.target.value)}></textarea>
            <button submit="submit">Submit</button>
        </form>
      <Link to="/login">Logga in</Link><br/>
      <Link to="/signup">Create Account</Link>
        {getData.map((item, index) => {
          console.log(item.userId.imageURL)
            return <div key={index}>
                <img src={item.userId.imageURL} />
                <p>{item.content}</p>
                <Link to={`/profile/${item.userId}`}>Länk till detailVy</Link> <br/>
                <p>{item.date}</p>
                <button onClick={e => handleOnDelete(item._id, e)}>DELETE</button>
            </div>  
        })}

    </div>
  )
}
