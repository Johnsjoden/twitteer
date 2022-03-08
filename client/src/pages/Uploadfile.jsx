
import React from 'react'
import { useState } from 'react'

export default function Uploadfile() {
    const [postData, setPostData] = useState("")
    const [file, setFile] = useState({preview: "", data: ""})

    const handleOnSubmit = (e) => {
        e.preventDefault()
        const url = file.preview
        console.log(url)
        let formData = new FormData()
        formData.append("uploaded-file", file.data)
        formData.append("post", postData)
        formData.append("url", url)
        fetch("/uploads", {
            method: "POST",
            body: formData
        })
    }
    const handleFileChange = (e) => {
        e.preventDefault()
        const img = {
            preview: URL.createObjectURL(e.target.files[0]),
            data: e.target.files[0]
        }
        setFile(img)
    }
  return (
    <div>
        <form onSubmit={handleOnSubmit} >
            <input type="text" onChange={e => setPostData(e.target.value)} />
            <input type="file" onChange={handleFileChange} />
            <button type="submit">Submit</button>
        </form>
    </div>
  )
}
