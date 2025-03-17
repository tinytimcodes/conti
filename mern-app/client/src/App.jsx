import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Signup from './Signup'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './Login'
import Dashboard from './Dashboard'


function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes> 
          <Route path = '/' element = {<Login/>}></Route>  
          <Route path = '/login' element = {<Login/>}></Route>
          <Route path = '/signup' element = {<Signup/>}></Route>
          <Route path = '/register' element = {<Signup/>}></Route>
          <Route path = '/dashboard' element = {<Dashboard/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App