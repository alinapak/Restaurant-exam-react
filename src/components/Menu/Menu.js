import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './Menu.css';
import { Link } from 'react-router-dom';

function Menu() {
  const [title, setTitle] = useState("");
  const [restaurant, setRestaurant] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantsId, setRestaurantsId] = useState([]);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [menus, setMenus] = useState([]);
  const [updateForm, setUpdateForm] = useState(false);
  const [menuId, setMenuId] = useState("");
  const [message, setMessage] = useState(false);
  const [token, _] = useState(localStorage.getItem("token"));
  const [admin, setAdmin] = useState(localStorage.getItem("username"));

  function createMenu(e) {
    const formData = new FormData();
    formData.append('title', title);
    if (restaurant !== "") {
    
      restaurantsId.map(r => {
        console.warn(r);
        console.warn(restaurant);
        if (r !== parseInt(restaurant)) {
          console.warn("<<<<<<<<<<<<<<>>>>>>>>>>>>>>");
          formData.append('restaurant_id', restaurant);
        }
        else if (r === parseInt(restaurant)) {
          console.warn(r);
          console.warn(restaurant);
          e.preventDefault();
          setMessage(true);
        }
      });
      console.warn(">>>>>>>");
    }
    else if (restaurant === "") {
      e.preventDefault();
      setMessage(true);
    }
    fetch('https://restaurant-app-laravel.herokuapp.com/api/v1/menus', {
    // fetch("http://127.0.0.1:8000/api/v1/menus", {
      method: 'POST',
      headers: { 'Accept': 'application/json', "Authorization": `Bearer ${token}` },
      body: formData
    });
  }
  function deleteMenu(id, e) {
    // fetch from heroku
     fetch("https://restaurant-app-laravel.herokuapp.com/api/v1/menus/" + id, {

    // fetch while creating project
    // fetch("http://127.0.0.1:8000/api/v1/menus/" + id, {
      method: 'DELETE',
      headers: { 'Accept': 'application/json', "Authorization": `Bearer ${token}` }
    })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          const remaining = menus.filter(m => id !== m.id)
          setMenus(remaining)
        }
      });
  }
  function selectMenu(id, e) {
    // console.warn(title, price, file, restaurant);
    menus.map((m) => {
      if (m.id === id) {
        setMenuId(m.id);
        setTitle(m.title);
        setRestaurant((m.restaurant === null) ? " " : m.restaurant_id);
      }
    })
    setUpdateForm(true);
  }
  function changeMenu(e) {
    const formData = new FormData;
    formData.set("_method", "PUT");
    formData.set('title', title);
    const index = restaurantsId.indexOf(parseInt(restaurant));
    if (index > -1) {
      restaurantsId.splice(index, 1);
      restaurantsId.map(c => {
        if (c !== parseInt(restaurant)) {
          formData.set('restaurant_id', restaurant);
        }
        else if (c === parseInt(restaurant)) {
          e.preventDefault();
          setMessage(true);
        }
      });
    }
    else if (index === -1) {
      formData.set('restaurant_id', restaurant);
    }

    // fetch from heroku
    fetch("https://restaurant-app-laravel.herokuapp.com/api/v1/menus/" + menuId, {
    // fetch while creating app
    // fetch("http://127.0.0.1:8000/api/v1/menus/" + menuId, {
      method: 'POST',
      headers: { 'Accept': 'application/json', "Authorization": `Bearer ${token}` },
      body: formData
    })
  }
  useEffect(() => {
    // fetch from heroku
     fetch("https://restaurant-app-laravel.herokuapp.com/api/v1/restaurants",

    // fetch while creating app
    // fetch("http://127.0.0.1:8000/api/v1/restaurants",
      { headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', "Authorization": `Bearer ${token}` } }
    )
      .then(res => res.json())
      .then(
        (result) => {
          setRestaurants(result); setIsLoaded(true);
        },
        (error) => { setError(error); setIsLoaded(true); })
  }, [])

  useEffect(() => {
    // fetch from heroku
    fetch("https://restaurant-app-laravel.herokuapp.com/api/v1/menus",
    // fetch while creating app
    // fetch("http://127.0.0.1:8000/api/v1/menus",
      { headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', "Authorization": `Bearer ${token}` } }
    )
      .then(res => res.json())
      .then(
        (result) => {
          //   if(!result.ok) {
          //     setError(result);
          //     setIsLoaded(true);
          // }
          console.log(result); // <--- check this out in the console
          setMenus(result); setIsLoaded(true);
          const restIdList = result.map(r => r.restaurant_id);
          setRestaurantsId(restIdList);
          console.log(restIdList);
        },
        (error) => { setError(error); setIsLoaded(true); })
  }, [])

  if (!isLoaded) {
    return <div>Loading...</div>;
  } else if (error) {
    return <div>Error: {error.message}</div>;
  } else {
    return (
      <>
        {admin === 'admin' ? <Link className="btn btn-success btn-lg d-block m-5" to="#create" role="button">Sukurti menu</Link> : <h1 className='display-1 m-3 p-3 text-success text-center'>Menu</h1>}
        <div className="container card mt-3">
          <table className="table">
            <thead>
              <tr>
                <th>Pavadinimas</th>
                <th>Restoranas</th>
                {admin === "admin" ? <th>Veiksmai</th> : <th></th>}
              </tr>
            </thead>
            <tbody>
              {menus.map(m =>
              (
                <tr key={m.id}>
                  <td>{m.title}</td>
                  {m.restaurant !== null ? (<td>{m.restaurant.title}</td>) : (<td></td>)}
                  {admin === 'admin' ? <td>
                    <div className='d-grid gap-2 d-md-block'><Link to='#update' ><button onClick={(e) => selectMenu(m.id, e)} className="btn btn-success mx-1">Atnaujinti</button></Link><button onClick={(e) => deleteMenu(m.id, e)} className="btn btn-dark">Ištrinti</button></div></td> : <td></td>}

                </tr>
              )
              )}
            </tbody>
          </table>
          {admin === 'admin' ? <div>{
            !updateForm
              ? <div id='create' className='card  mt-3 border-success'>
                <h3 className='m-3 text-success text-center mt-5'> Sukurti menu</h3>
                <form className='container'>
                  {message ? <p className='mt-2 alert alert-danger'>Būtina priskirti menu restoranui. Kiekvienas meniu gali turėti tik vieną restoraną</p> : ""}
                  <div className="form-group">
                    <input type="text" className="form-control m-1" placeholder='Pavadinimas' value={title} onChange={(e) => setTitle(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className='my-3'>Priskirti menu restoranui:</label>
                    <select className='form-select dish' value={restaurant} onChange={(e) => setRestaurant(e.target.value)} required>
                      {restaurants.map(r => (
                        <option key={r.id} value={r.id} >{r.title}</option>
                      )
                      )}
                      <option value={""}>--Nepriskirtas jokiam restoranui--</option>
                    </select>
                  </div>
                  <button onClick={createMenu} className='bg-success btn float-end text-light m-3'>Pridėti</button>
                </form>
              </div>
              : <div id='update' className='card  mt-3 border-success'>
                <h3 className='m-3 text-success text-center mt-5'> Pakeisti menu</h3>
                {message ? <p className='mt-2 alert alert-danger'>Restoranas gali turėti tik vieną menu</p> : ""}
                <form className='container'>
                  <div className="form-group">
                    <input type="text" className="form-control m-1" placeholder='Pavadinimas' value={title} onChange={(e) => setTitle(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className='my-3'>Priskirti menu restoranui:</label>
                    <select className='form-select dish' value={restaurant} onChange={(e) => setRestaurant(e.target.value)} required>
                      {restaurants.map(r => (
                        <option key={r.id} value={r.id} >{r.title}</option>
                      )
                      )}
                      <option value={""}>--Nepriskirtas jokiam restoranui--</option>
                    </select>
                  </div>
                  <button onClick={(e) => setUpdateForm(false)} className='bg-dark btn float-end text-light m-3'>Atšaukti</button>
                  <button onClick={changeMenu} className='bg-success btn float-end text-light m-3'>Pakeisti</button>
                </form>
              </div>
          }</div> : <div></div>}

        </div >
      </>
    );
  }
}
export default Menu;
