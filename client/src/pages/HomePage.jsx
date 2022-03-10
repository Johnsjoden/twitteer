import React, { useContext } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { apiContext } from '../App'
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
    /* const renderLink = (content) => {
      let array = []
      content = content.replace(/(^|\s)(#[a-z\d-]+)/ig, function(match) {
        array.push(match)
                      if(letter[0] == "#"){
                        const hashtagLink = `<a href=hashtag/${letter.substring(1)}>${letter}</a>`
                        const yo = <Link to={`/hashtag/${letter.substring(2)}`}>{letter}</Link>
                        console.log(yo)
                        return yo
                      }else {
                        const hashtagLink = `<a href=hashtag/${letter.substring(2)}>${letter}</a>`
                        const linkf = <Link to={`/hashtag/${letter.substring(2)}`}>{letter}</Link>
                        console.log(linkf)
                        return linkf
                      }
      })
      array.forEach(item => {
        if(item[0] == "#"){
          return <div>{content}
            <Link to={`/hashtag/${item.substring(1)}`}>{item}</Link>
          </div>
        }else {
          return <div>{content}
            <Link to={`/hashtag/${item.substring(2)}`}>{item}</Link>
          </div>
        }
      })
      return <Link to={`/hashtag/${array}`}>{array}</Link>
    } */
    /* const handleHashtag = (content) => {
      content = content.replace(/(^|\s)(#[a-z\d-]+)/ig, function(match) {
      let letter = match
      if(letter[0] == "#"){
        const hashtagLink = `<a href=hashtag/${letter.substring(1)}>${letter}</a>`
        return hashtagLink
      }else {
        const hashtagLink = `<a href=hashtag/${letter.substring(2)}>${letter}</a>`
        return hashtagLink
      }
    })
      return content
    }
    const rightWay = (content) => {
      const hashTag = content.match(/(^|\s)(#[a-z\d-]+)/ig)
      let hashtagname = ""
      if(hashTag === null){
        return null
      }else {
        hashTag.forEach(item => {
              if(item[0] == "#"){
                hashtagname = item.substring(1)
              }else {
                hashtagname = item.substring(2)
              }
          })
          
      }
      return hashtagname
      
    }
    const handleHashTagName = (content) => {
      const hashTag = content.match(/(^|\s)(#[a-z\d-]+)/ig)
      if(hashTag === null){
        return null
      }else {
        hashTag.forEach(item => {
                return item
            })
          return hashTag
      }
      
    }
    const handlehashTagContent = (content) => {
      content = content.replace(/(^|\s)(#[a-z\d-]+)/ig, "")
      return content
    } */
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
    <div className="container">
      <div className="row ">
        <div className="col-2">
        <Link to="/login">Logga in</Link><br/>
      <Link to="/signup">Create Account</Link>
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
              
            </div>  
        })}
        </div>
      </div>
    </div>
  )
}
