import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Signup from './Signup'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './Login'
import Dashboard from './Dashboard'
import Myticket from './Myticket'
import Sellticket from './Sellticket';


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
          <Route path = '/myticket' element = {<Myticket/>}></Route>
          <Route path = '/sellticket' element = {<Sellticket/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App