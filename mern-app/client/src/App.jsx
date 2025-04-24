import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Signup from './Signup'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './Login'
import Dashboard from './Dashboard'
import Myticket from './Myticket'
import Sellticket from './Sellticket'
import Checkout from './Checkout'
import Tickets from './Tickets'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes> 
          <Route path = '/' element = {<Login/>}></Route>  
          <Route path = '/login' element = {<Login/>}></Route>
          <Route path = '/signup' element = {<Signup/>}></Route>
          <Route path = '/register' element = {<Signup/>}></Route>
          <Route path = '/dashboard' element = {<Dashboard/>}></Route>
          <Route path = '/myticket' element = {<Myticket/>}></Route>
          <Route path = '/sellticket' element = {<Sellticket/>}></Route>
          <Route path = '/checkout' element = {<Checkout/>}></Route>
          <Route path = '/checkout/:ticketId' element = {<Checkout/>}></Route>
          <Route path = '/tickets' element = {<Tickets/>}></Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App