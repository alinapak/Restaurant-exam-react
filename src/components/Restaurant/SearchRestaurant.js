import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';

function SearchRestaurant({ addToCart }) {
   const [dish, setDishes] = useState([]);
   const [showMenu, setShowMenu] = useState(false);
   const [restaurants, setRestaurants] = useState([]);
   const [menus, setMenus] = useState([]);
   const [menId, setMenuId] = useState("");
   const [restTitle, setRestTitle] = useState("");
   const [dishId, setDishId] = useState("");
   const [price, setPrice] = useState("");
   const [token, _] = useState(localStorage.getItem("token"));
   const [cartCount, setCartCount] = useState(0); // State for cart item count

   async function search(key) {
      // let result = await fetch("https://restaurant-app-laravel.herokuapp.com/api/v1/search/" + key, {
      let result = await fetch("http://127.0.0.1:8000/api/v1/search/" + key, {
         headers: { 'Accept': 'application/json', "Authorization": `Bearer ${token}` }
      });
      result = await result.json();
      setRestaurants(result);
      if (result.length === 1) {
         selectMenu(result[0])
      }
      if (key === "") {
         setShowMenu(false);
      }
   }
   function selectMenu(restaurant) {
      // e.preventDefault();
      if (restaurant) {
         setMenuId(restaurant.menu.id); // Set the menu id
         setRestTitle(restaurant.title);
         // Fetch dishes for the selected menu
         fetch("/v1/menus/" + restaurant.menu.id, {
            method: 'GET',
            headers: { 'Accept': 'application/json', "Authorization": `Bearer ${token}` }
         })
            .then(res => res.json())
            .then(result => {
               setDishes(result.dishes); // Update dishes state
               setShowMenu(true); // Show menu after dishes are fetched
            })
            .catch(error => {
               console.error('Error fetching dishes:', error);
            });
      }
   }
   function toCart(id) {
      const selectedDish = dish.find(d => d.id === id); // Find the dish with matching id
      if (selectedDish) {
         setDishId(selectedDish.id);
         setPrice(parseFloat(selectedDish.price));
         addToCart(selectedDish) // Increment cart count
      }
      console.log(price);
   }

   useEffect(() => {
      search(""); // Call search with an empty string when component mounts
   }, [])

   useEffect(() => {
      toCart()
      console.log(dishId, 'dish id')
   }, [dishId])
   useEffect(() => {
      fetch("/v1/menus", {
         // fetch("https://restaurant-app-laravel.herokuapp.com/api/v1/menus", {
         headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', "Authorization": `Bearer ${token}` }
      })
         .then(res => res.json())
         .then(
            (result) => {
               setMenus(result);
            })
   }, [])
   return (
      <div>
         <div className="col-sm-6 offset-sm-3">
            <h1 className="display-3 m-3 p-3 text-success text-center">Ieškoti restorano</h1>
            <input
               type="text"
               placeholder="Ieškoti restorano"
               onChange={(e) => search(e.target.value)}
               className="form-control my-3"
            />
         </div>
         <div className="col-sm d-flex align-items-center justify-content-center flex-wrap p-3 ">
            {restaurants.map((restaurant) => (
               <div className="card-body flex-fill mb-5 mx-4 mt-3 bg-light p-4 rounded"
                  key={restaurant.id}>
                  <div className="d-flex justify-content-between mt-3 text-align">
                     <h4 className="card-title mx-3">{restaurant.title}</h4>
                     <p className="card-title mx-3 fst-italic">{restaurant.city}</p>
                     <p className="card-title mx-3 fst-italic">{restaurant.address}</p>
                     <button onClick={(e) => { selectMenu(restaurant); }} className="btn btn-outline-success  mx-3 fst-italic">{restaurant.menu.title}</button>
                  </div>
                  <div className="d-flex justify-content-between"></div>
               </div>
            ))}
         </div>
         {showMenu && dish.length
            ? <div className=" card-group justify-content-center">
               {dish.map(d => (
                  <div className="col-sm-5 m-3">
                     <div className="card text-center">
                        <div className="card-body d-flex justify-content-center">
                           <div key={d.id} >
                              <h5 className="card-title">{d.title}</h5>
                              <img className='m-2 card-img-top' style={{ width: "200px", height: "150px", objectFit: "cover" }}
                                 // src while in development mode
                                 src={'http://127.0.0.1:8000/' + d.file}
                                 alt={d.title}
                              // src heroku
                              // src={'https://restaurant-app-laravel.herokuapp.com/' + d.file}
                              >
                              </img>
                              <p className='text-success fst-italic fs-4'>{d.price}</p>
                              <button className='btn btn-outline-danger' onClick={(e) => toCart(d.id)}>Į krepšelį</button>
                              {/* <button className='btn btn-outline-danger' onClick={toCart()}>Kiekis</button> */}
                           </div>
                           <div className='float-end m-3' style={{ "width": "15rem" }}>
                              <p className="card-text p-4 text-wrap">{d.description}</p>
                           </div>

                        </div>
                     </div>
                  </div>
               ))}</div>
            : showMenu ? <div className="col-sm-12 text-center mt-3">
               <div className="alert alert-warning text-center" role="alert">
                  Į  "{restTitle}" meniu kol kas nėra įtraukta jokių patiekalų.
               </div>
            </div> : <></>}
      </div>
   );
}
SearchRestaurant.propTypes = {
   addToCart: PropTypes.func.isRequired,
};

export default SearchRestaurant;