import React, { useEffect, useState, useRef } from 'react';
import './Menu.css';
import { Link } from 'react-router-dom';

function Menu() {
  const titleInputRef = useRef(null);
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
  const [updateList, setUpdateList] = useState(false);

  function handleLinkClick() {
    setMessage(false)
    setTimeout(() => {
      if (titleInputRef.current) {
        titleInputRef.current.focus();
      }
    }, 50)
  }
  function handleCancel(e) {
    e.preventDefault();
    setTitle("");
    setRestaurant("");
    setUpdateForm(false);
    setMessage(false);
  }
  function createMenu(e) {
    handleCancel(e)
    const formData = new FormData();
    let hasError = false; // Flag to track validation errors

    formData.append('title', title);
    if (restaurant !== "") {
      restaurantsId.forEach(r => { // Use forEach instead of map
        if (r === parseInt(restaurant)) {
          setMessage(true);
          hasError = true; // Set error flag
        }
      });
    } else {
      setMessage(true);
      hasError = true; // Set error flag
    }

    if (hasError) {
      return; // Return early if there are validation errors
    }

    formData.append('restaurant_id', restaurant);

    fetch('/v1/menus', {
      // fetch('https://restaurant-app-laravel.herokuapp.com/api/v1/menus', {
      method: 'POST',
      headers: { 'Accept': 'application/json', "Authorization": `Bearer ${token}` },
      body: formData
    })
      .then(response => {
        if (response.status === 200) {
          setUpdateList(!updateList);
        }
      })
      .catch(error => {
        // Handle fetch errors here
        console.error('Error:', error);
      });
  }
  function deleteMenu(id, e) {
    fetch("/v1/menus/" + id, {
      // fetch("https://restaurant-app-laravel.herokuapp.com/api/v1/menus/" + id, {
      method: 'DELETE',
      headers: { 'Accept': 'application/json', "Authorization": `Bearer ${token}` }
    })
      .then((response) => {
        if (response.status === 200) {
          // const remaining = menus.filter(m => id !== m.id)
          // setMenus(remaining)
          setUpdateList(!updateList);
        }
      });
  }
  function selectMenu(id, e) {
    menus.forEach((m) => {
      if (m.id === id) {
        setMenuId(m.id);
        setTitle(m.title);
        setRestaurant((m.restaurant === null) ? " " : m.restaurant_id);
      }
    });
    setUpdateForm(true);
  }
  function changeMenu(e) {
    e.preventDefault()
    // Prevent default form submission behavior
    const formData = new FormData();
    formData.set("_method", "PUT");
    formData.set('title', title);
    const menuToUpdate = menus.find(menu => menu.id === menuId);
    if (!menuToUpdate) {
      console.error(`Menu with ID ${menuId} not found.`);
      return;
    }

    // Get the original title and restaurant_id of the menu
    const originalTitle = menuToUpdate.title;
    const originalRestaurantId = menuToUpdate.restaurant_id;

    // Check if there are changes in title or restaurant_id
    if (title === originalTitle && parseInt(restaurant) === originalRestaurantId) {
      handleCancel(e)
      // No changes made, do nothing
      return;
    }
    let hasError = false; // Flag to track validation errors
    if (restaurant !== "") {
      menus.forEach(menu => {
        const founded = menus.find(menu => menu.id === menuId)
        if (menu.restaurant_id === parseInt(restaurant) && founded.title === title) { // Check if restaurant already has a menu
          setMessage(true);
          hasError = true; // Set error flag
        }
      });
    }
    if (hasError) {
      return; // Return early if there are validation errors
    }

    formData.set('restaurant_id', restaurant);

    fetch("/v1/menus/" + menuId, {
      // fetch("https://restaurant-app-laravel.herokuapp.com/api/v1/menus/" + menuId, {
      method: 'POST',
      headers: { 'Accept': 'application/json', "Authorization": `Bearer ${token}` },
      body: formData
    })
      .then(response => {
        if (response.status === 200) {
          setUpdateList(!updateList);
          handleCancel(e)
        }
      })
      .catch(error => {
        // Handle fetch errors here
        console.error('Error:', error);
      });
  }
  useEffect(() => {
    fetch("/v1/restaurants",
      // fetch("https://restaurant-app-laravel.herokuapp.com/api/v1/restaurants",
      { headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', "Authorization": `Bearer ${token}` } }
    )
      .then(res => res.json())
      .then(
        (result) => {
          setRestaurants(result); setIsLoaded(true);
        },
        (error) => { setError(error); setIsLoaded(true); })
  }, [updateList])

  useEffect(() => {
    fetch("/v1/menus",
      // fetch("https://restaurant-app-laravel.herokuapp.com/api/v1/menus",
      { headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', "Authorization": `Bearer ${token}` } }
    )
      .then(res => res.json())
      .then(
        (result) => {
          setMenus(result); setIsLoaded(true);
          const restIdList = result.map(r => r.restaurant_id);
          setRestaurantsId(restIdList);
        },
        (error) => { setError(error); setIsLoaded(true); })
  }, [updateList])

  if (error) {
    return <div>Error: {error.message}</div>;
  } else {
    return (
      <>
        {admin === 'admin'
          ? <Link className={` ${updateForm ? 'disabled' : ''} btn btn-success btn-lg d-block m-5`} to="" onClick={handleLinkClick} role="button">Sukurti menu</Link> : <h1 className='display-1 m-3 p-3 text-success text-center'>Menu</h1>}
        {isLoaded ? <div className="container card mt-3">
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
                    <div className='d-grid gap-2 d-md-block'><Link to='' ><button onClick={(e) => { selectMenu(m.id, e); handleLinkClick() }} className="btn btn-success mx-1">Atnaujinti</button></Link><button onClick={(e) => deleteMenu(m.id, e)} className="btn btn-dark">Ištrinti</button></div></td> : <td></td>}

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
                    <input
                      ref={titleInputRef}
                      type="text" className="form-control m-1" placeholder='Pavadinimas' value={title} onChange={(e) => setTitle(e.target.value)} required />
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
                    <input
                      ref={titleInputRef}
                      type="text" className="form-control m-1" placeholder='Pavadinimas' value={title} onChange={(e) => setTitle(e.target.value)} required />
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
                  <button onClick={(e) => handleCancel(e)} className='bg-dark btn float-end text-light m-3'>Atšaukti</button>
                  <button onClick={changeMenu} className='bg-success btn float-end text-light m-3'>Pakeisti</button>
                </form>
              </div>
          }</div>
            : <div></div>}

        </div > : <div className="d-flex justify-content-center">
          <div className="spinner-border m-5" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>}

      </>
    );
  }
}
export default Menu;
