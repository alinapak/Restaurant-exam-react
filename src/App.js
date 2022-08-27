
import './App.css';
import Header from './components/Header/Header';
import { BrowserRouter, Route, Routes} from "react-router-dom";
import Restaurant from './components/Restaurant/Restaurant';
import Home from './components/Home/Home';
import Menu from './components/Menu/Menu';
import Dish from './components/Dish/Dish';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import SearchRestaurant from './components/Restaurant/SearchRestaurant';

function App() {
 
  return (
    <BrowserRouter >
    <Header/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/search" element={<SearchRestaurant />} />
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
