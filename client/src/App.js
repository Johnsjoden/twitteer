import React, { createContext, useEffect, useState } from "react";
import {Routes, Route} from "react-router-dom"
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage"
import ProfilePage from "./pages/ProfilePage";
import ProfileDetailPage from "./pages/ProfileDetailPage";
import SignUpPage from "./pages/SignUpPage";
import Uploadfile from "./pages/Uploadfile";
const axios = require("axios")
const apiContext = createContext("")
function App() {
  const [getData, setData] = useState([])
  const getApi = async () => {
    let response = await axios.get("/post").then(res => res.data)
    setData(response)
  }
    useEffect(( ) => {
      getApi()
    }, [])
  return (
    <div className="App">
      <apiContext.Provider value={{getData, getApi}}>
        <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/profile/:id" element={<ProfileDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/upload" element={<Uploadfile />} />
      </Routes>
      </apiContext.Provider>
    </div>
  );
}
export {apiContext}
export default App;
