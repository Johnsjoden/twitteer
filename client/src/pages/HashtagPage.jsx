import React, {useState} from 'react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import reactStringReplace from 'react-string-replace'
export default function HashtagPage() {
    const params = useParams()
    const id = params.id 
    const [data, setData] = useState([])
    const token = localStorage.getItem("key")
    const fetchData = () => {
        fetch(`/hashtag/${id}`, {
            headers: {'Authorization': `Bearer ` + token }
        })
    .then(res => res.json())
    .then(data => setData(data))
    }
    useEffect(() => {
        fetchData()
    }, [])
    const renderLink = (content) => {
        content = reactStringReplace(content, /#(\w+)/g, (match, i) => (
          <Link key={match + i} to={`/hashtag/${match}`}>#{match}</Link>
        ));
        return content
      }
  return (
    <div>HashtagPage
        <div>

        </div>
                {data.map((item, index) => {
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
  )
}
