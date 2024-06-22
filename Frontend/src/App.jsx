import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import Login from './components/pages/Login'
import Signup from './components/pages/Signup'
import Home from './components/pages/Home'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import UploadedImages from './components/pages/UploadedImages'
import Thumbnails from './components/pages/Thumbnails'
import ProtectedRoute from './components/routes/ProtectRoute'
import Error from './components/Error/Error'

const App = () => {
  return (
    <>
    <Header/>
      <Routes>
        <Route path='/' element = {<Login/>}/>
        <Route path='/login' element = {<Login/>}/>
        <Route path='/signup' element = {<Signup/>}/>
        <Route path='/home' element = {<ProtectedRoute><Home/></ProtectedRoute>}/>
        <Route path='/getimages' element = {<ProtectedRoute><UploadedImages/></ProtectedRoute>}/>
        <Route path= '/getthumbnails' element ={<Thumbnails/>}/>
        <Route path ="*" element ={<Error/>}/>
      </Routes>
    <Footer/>  
    </>
  )
}

export default App