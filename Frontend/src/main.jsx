import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import "react-toastify/dist/ReactToastify.css"
import store from './components/store.js'
import { ToastContainer } from 'react-toastify'
import { Provider } from 'react-redux'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <Provider store={store}> 
    <ToastContainer theme='dark' position='top-right' autoClose={3000} closeOnClick pauseOnHover={false}/>
    <App />
    </Provider>
    </BrowserRouter>
  </React.StrictMode>
)
