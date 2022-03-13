import React, { createContext, useEffect, useState } from "react";
import {Routes, Route} from "react-router-dom"
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage"
import 'bootstrap/dist/css/bootstrap.css';
import SignUpPage from "./pages/SignUpPage";
import Uploadfile from "./pages/Uploadfile";
import ProfilePageBug from "./pages/ProfilePageBug";
import HashtagPage from "./pages/HashtagPage";
import { Link } from "react-router-dom";
import ProfileLink from "./components/ProfileLink";
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
    // bilder uppdateras ej automatiskt
    // profile uppdateras ej när jag lägger in en bild. eprevent????
  return (
    <div className="App">
      <div className="container">
        <div className="row">
          <div className="col-2">
          <Link to="/login">Logga in</Link><br/>
          <Link to="/signup">Create Account</Link><br/>
          </div>
        </div>
      </div>
      <apiContext.Provider value={{getData, getApi}}>
        <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/profile/:id" element={<ProfilePageBug />} />
        <Route path="/upload" element={<Uploadfile />} />
        <Route path="/hashtag/:id" element={<HashtagPage />} />
      </Routes>
      </apiContext.Provider>
    </div>
  );
}
export {apiContext}
export default App;
