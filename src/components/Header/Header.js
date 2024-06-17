import React, { useState } from 'react';
import './Header.css';
import { NavLink } from 'react-router-dom';
import Cart from '../Cart/Cart'


const Header = ({ cartCount }) => {
   console.log(cartCount, 'cartCount on head')
   const [token, setToken] = useState(localStorage.getItem("token"));
   const [admin, setAdmin] = useState(localStorage.getItem("username"));
   return (
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark ps-2 pe-2">
         <NavLink className={({ isActive }) => (isActive ? "navbar-brand text-warning active" : "navbar-brand ")} to="/">Maisto užsakymo aplikacija</NavLink>
         <div className="navbar-collapse d-flex justify-content-end">
            {token ?
               <ul className="navbar-nav align-items-center">
                  {admin === 'admin' ?
                     <><li className="nav-item"><NavLink className={({ isActive }) => (isActive ? "nav-link text-warning active" : "nav-link ")} to="/restaurants">Restoranai</NavLink></li>
                        <li className=" "><NavLink className={({ isActive }) => (isActive ? "nav-link text-warning active" : "nav-link ")} to="/menus">Menu</NavLink></li>
                        <li className=" "><NavLink className={({ isActive }) => (isActive ? "nav-link text-warning active" : "nav-link ")} to="/dishes">Patiekalai</NavLink></li></> : <><li className="nav-item"><NavLink className={({ isActive }) => (isActive ? "nav-link text-warning active" : "nav-link ")} to="/restaurants">Restoranai</NavLink></li><li className="nav-item"><NavLink className={({ isActive }) => (isActive ? "nav-link text-warning active" : "nav-link ")} to="/search">Ieškoti</NavLink></li><Cart count={cartCount}></Cart></>
                  }
               </ul>
               :
               <ul className="navbar-nav"><li className="nav-item"><NavLink className={({ isActive }) => (isActive ? "nav-link text-warning active" : "nav-link ")} to="/login">Prisijungti</NavLink></li>   <li className="nav-item"><NavLink className={({ isActive }) => (isActive ? "nav-link text-warning active" : "nav-link ")} to="/register">Registruotis</NavLink></li></ul>
            }
         </div>
         <div>
            {token ? <button className='btn btn-danger m-1 ' onClick={(e) => { setToken(localStorage.removeItem('token')); window.location.href = '/login' }} >Atsijungti</button> : ""}
         </div>
      </nav>
   )
}

export default Header;

