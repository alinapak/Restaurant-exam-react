import React, { useState } from 'react';
import './App.css';
import Header from './components/Header/Header';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Restaurant from './components/Restaurant/Restaurant';
import Home from './components/Home/Home';
import Menu from './components/Menu/Menu';
import Dish from './components/Dish/Dish';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import SearchRestaurant from './components/Restaurant/SearchRestaurant';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  // Function to increment cart count
  const addToCart = (dish) => {
    const newCartItems = [...cartItems, dish]; // Add dish to cart
    setCartItems(newCartItems);
    setCartCount(newCartItems.length); // Update cart count
    console.log(cartCount, 'cartCount')
  }

  return (
    <BrowserRouter >
      <Header cartCount={cartCount} />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/search" element={<SearchRestaurant addToCart={addToCart} />} />
        <Route path='/restaurants' element={<Restaurant />} />
        <Route path='/menus' element={<Menu />} />
        <Route path='/dishes' element={<Dish />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
