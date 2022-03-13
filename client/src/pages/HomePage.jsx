import React, { useContext } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { apiContext } from '../App'
import socketIOClient, { io } from "socket.io-client";
import ProfileLink from '../components/ProfileLink'
import Likedbutton from '../components/Likedbutton'
const reactStringReplace = require('react-string-replace')
const axios = require("axios")
export default function HomePage() {
    const {
      getData,
      getApi
    } = useContext(apiContext)
    const [contentData, setContentData] = useState("")
    const token = localStorage.getItem("key")

    const renderLink = (content) => {
      content = reactStringReplace(content, /#(\w+)/g, (match, i) => (
        <Link key={match + i} to={`/hashtag/${match}`}>#{match}</Link>
      ));
      return content
    }
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
    console.log(getData)
  return (
    <div className="container">
      <div className="row ">
      <div className="col-2">
      <ProfileLink />
        </div>
        <div className="col-10">
          {
            token ? <form onSubmit={handleOnSubmit}>
              <label htmlFor="textArea" className="form-label">Tweet</label>
              <textarea type="text" className="form-control" id="textArea" rows="3" value={contentData} onChange={e => setContentData(e.target.value)}></textarea> <br/>
              <button submit="submit" className="btn-primary">Submit</button>
                </form> 
                : ""
          }
        
        {getData.map((item, index) => {
            return <div key={index}>
              <div className="card" style={{width: "18rem;"}}>
                <Link to={`/profile/${item.userId._id}`}><img className='img-fluid img-thumbnail' style={{width: "10%"}} src={item.userId.imageURL} alt="Jävlar" /></Link>
                {/* <div>{handlehashTagContent(item.content)}<Link to={`/hashtag/${rightWay(item.content)}`}>{handleHashTagName(item.content)}</Link></div> */}
                <div>{renderLink(item.content)}</div>
                {/* <div dangerouslySetInnerHTML={{ __html: handleHashtag(item.content)}}></div> */}
                
                <Link to={`/profile/${item.userId._id}`}>{item.userId.username}</Link> <br/>
                <p>{item.date}</p> </div>
                <Likedbutton />
              
            </div>  
        })}
        </div>
      </div>
    </div>
  )
}
