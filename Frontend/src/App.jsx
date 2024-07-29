import React from 'react'
import Navbar from './components/Navbar/Navbar'
import './index.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import About from './pages/About/About'
import Graph from './pages/Graph/Graph'
import { ToastContainer} from "react-toastify";

const App = () => {
  return (
    <div className='app'>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/graph' element={<Graph/>} />
        <Route path='/about' element={<About/>}/>
      </Routes>
      <ToastContainer />
    </div>
  )
}

export default App