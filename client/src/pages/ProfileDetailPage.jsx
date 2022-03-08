import axios from 'axios'
import React from 'react'
import { useParams } from 'react-router-dom'
export default function ProfileDetailPage() {
    const params = useParams()
    const name = params.id
    fetch(`/profile/${name}`, {

    })
    .then(res => res.json())
    .then(data => console.log(data))
  return (
    <div>profile page
        
    </div>
    
  )
}
