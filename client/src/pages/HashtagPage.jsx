import React, {useState} from 'react'
import { useParams } from 'react-router-dom'

export default function HashtagPage() {
    const params = useParams()
    const id = params.id 
    const [data, setData] = useState([])
    const token = localStorage.getItem("key")
    const fetchData = () => {
        fetch(`/hashtag/${id}`, {
            headers:{
                "Authorization": `Bearer + ${token}`
            }
        })
    .then(res => res.json())
    .then(data => setData(data))
    }
    fetchData()
  return (
    <div>HashtagPage

        {data.map((item, index) => {
            return <div key={index}>
                <p>{item.content}</p>
            </div>
        })}
    </div>
  )
}
