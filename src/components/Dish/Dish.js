import React, { useEffect, useState, useRef } from 'react';
import { HashLink as Link } from 'react-router-hash-link';

function Dish() {
  const [updateList, setUpdateList] = useState(false);
  const titleInputRef = useRef(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState("");
  const [description, setDescription] = useState("");
  const [menu, setMenu] = useState("");
  const [menus, setMenus] = useState([]);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [dishes, setDishes] = useState([]);
  const [updateForm, setUpdateForm] = useState(false);
  const [dishId, setDishId] = useState("");
  const [token, _] = useState(localStorage.getItem("token"));
  const [admin, setAdmin] = useState(localStorage.getItem("username"));
  function handleLinkClick() {
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }
  function createDish(e) {
    e.preventDefault()
    const formData = new FormData();
    formData.append('title', title);
    formData.append('price', price);
    formData.append('file', file);
    formData.append('description', description);
    formData.append('menu_id', menu);

    fetch("/v1/dishes", {
      // fetch("https://restaurant-app-laravel.herokuapp.com/api/v1/dishes", {
      method: 'POST',
      headers: { 'Accept': 'application/json', "Authorization": `Bearer ${token}` },
      body: formData
    }).then(response => {
      if (response.status === 200) {
        setUpdateList(!updateList);
      }
    });
  }
  function selectDish(id, e) {
    dishes.forEach((d) => {
      if (d.id === id) {
        setDishId(d.id);
        setTitle(d.title);
        setPrice(d.price);
        setFile(d.file);
        setDescription(d.description);
        setMenu((d.menu === null) ? "" : d.menu_id);
      }
    });
    setUpdateForm(true);
  }
  function cancelEdit(e) {
    setTitle("");
    setPrice("");
    setFile("");
    setDescription("");
    setMenu("");
    setDishId("");
    setUpdateForm(false);
  }

  function changeDish(e) {
    e.preventDefault();
    cancelEdit(e)
    const formData = new FormData();
    formData.set("_method", "PUT");
    formData.set('title', title);
    formData.set('price', price);
    formData.set('file', file);
    formData.set('description', description);
    formData.set('menu_id', menu);

    fetch("/v1/dishes/" + dishId, {
      // fetch("https://restaurant-app-laravel.herokuapp.com/api/v1/dishes/" + dishId, {
      method: 'POST',
      headers: { 'Accept': 'application/json', "Authorization": `Bearer ${token}` },
      body: formData
    }).then(response => {
      if (response.status === 200) {
        setUpdateList(!updateList);
      }
    });
  }

  function deleteDish(id, e) {
    fetch("/v1/dishes/" + id, {
      // fetch("https://restaurant-app-laravel.herokuapp.com/api/v1/dishes/" + id, {
      method: 'DELETE',
      headers: { 'Accept': 'application/json', "Authorization": `Bearer ${token}` }
    })
      .then((response) => {
        if (response.status === 200) {
          const remaining = dishes.filter(r => id !== r.id)
          setDishes(remaining)
        }
      });
  }

  useEffect(() => {
    fetch("/v1/menus",
      // fetch("https://restaurant-app-laravel.herokuapp.com/api/v1/menus",
      { headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', "Authorization": `Bearer ${token}` } }
    )
      .then(res => res.json())
      .then(
        (result) => {
          setMenus(result); setIsLoaded(true);
        },
        (error) => { setError(error); setIsLoaded(true); })
  }, [])

  useEffect(() => {
    fetch("/v1/dishes",
      // fetch("https://restaurant-app-laravel.herokuapp.com/api/v1/dishes",
      { headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', "Authorization": `Bearer ${token}` } }
    )
      .then(res => res.json())
      .then(
        (result) => {
          setDishes(result); setIsLoaded(true);
        },
        (error) => { setError(error); setIsLoaded(true); })
  }, [updateList])

  if (error) {
    return <div>Error: {error.message}</div>;
  } else {
    return (
      <>
        {admin === 'admin' ? <Link className={` ${updateForm ? 'disabled' : ''} btn btn-success btn-lg d-block m-5`} onClick={handleLinkClick} to="" role="button">Sukurti patiekalą</Link> : <h1 className='display-1 m-3 p-3 text-success text-center'>Patiekalai</h1>}
        {isLoaded ? <div className="container card mt-3">
          <table className="table">
            <thead>
              <tr>
                <th>Pavadinimas</th>
                <th>Kaina</th>
                <th>Nuotrauka</th>
                <th>Aprašymas</th>
                <th>Menu</th>
                {admin === "admin" ? <th>Veiksmai</th> : <th></th>}
              </tr>
            </thead>
            <tbody>
              {dishes.map(dish =>
              (
                <tr key={dish.id}>
                  <td>{dish.title}</td>
                  <td>{dish.price}</td>
                  <td><img style={{ width: "150px", height: "150px", objectFit: "cover" }}
                    // src from heroku
                    // src={'https://restaurant-app-laravel.herokuapp.com/'+ dish.file}
                    alt={dish.title}
                    // src in development mode
                    src={'http://127.0.0.1:8000/' + dish.file}
                  /></td>
                  <td style={{ width: "200px" }}>{dish.description}</td>
                  {dish.menu !== null ? (<td>{dish.menu.title}</td>) : (<td></td>)}
                  {admin === 'admin' ? <td>
                    <div className='d-grid gap-2 d-md-block'><Link to='' onClick={handleLinkClick} ><button onClick={(e) => selectDish(dish.id, e)} className="btn btn-success mx-1">Atnaujinti</button></Link><button onClick={(e) => deleteDish(dish.id, e)} className="btn btn-dark">Ištrinti</button></div></td> : <td></td>}
                </tr>
              )
              )}
            </tbody>
          </table>
          {admin === 'admin' ? <div>  {
            !updateForm
              ? <div id='create' className='card  mt-3 border-success'>
                <h3 className='m-3 text-success text-center mt-5'> Sukurti patiekalą</h3>
                <form className='container'>
                  <div className="form-group">
                    <input type="text"
                      ref={titleInputRef} className="form-control m-1" placeholder='Pavadinimas' value={title} onChange={(e) => setTitle(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <input type="text" className="form-control m-1" placeholder='Kaina' value={price} onChange={(e) => setPrice(e.target.value)} required />
                  </div>  <div className="form-group">
                    <label htmlFor="formFile" className="form-label my-3">Įkelti patiekalo nuotrauką</label>
                    <input type="file" className=" m-1" placeholder='Patiekalo nuotrauka' name='file' onChange={(e) => setFile(e.target.files[0])} />
                    <div className="form-group">
                      <textarea type="text" className="form-control m-1" placeholder='Aprašymas' value={description} onChange={(e) => setDescription(e.target.value)} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className='my-3'>Priskirti patiekalą restorano menu:</label>
                    <select required className='form-select dish' value={menu} onChange={(e) => setMenu(e.target.value)}>
                      {menus.map(m => (
                        <option key={m.id} value={m.id} >{m.title}</option>
                      )
                      )}
                      <option value={""}>--Nėra jokio restorano menu--</option>
                    </select>
                  </div>
                  <button onClick={createDish} className='bg-success btn float-end text-light m-3'>Pridėti</button>
                </form>
              </div>
              : <div id='update' className='card  mt-3 border-success'>
                <h3 className='m-3 text-success text-center mt-5'> Pakeisti patiekalą</h3>
                <form className='container'>
                  <div className="form-group">
                    <input type="text"
                      ref={titleInputRef} className="form-control m-1" placeholder='Pavadinimas' value={title} onChange={(e) => setTitle(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <input type="text" className="form-control m-1" placeholder='Kaina' value={price} onChange={(e) => setPrice(e.target.value)} required />
                  </div>  <div className="form-group">
                    <label htmlFor="formFile" className="form-label my-3">Atnaujinti patiekalo nuotrauką</label>
                    <input type="file" className=" m-1" placeholder='Patiekalo nuotrauka' name='file' onChange={(e) => setFile(e.target.files[0])} />
                  </div>
                  <div className="form-group">
                    <textarea type="text" className="form-control m-1" placeholder='Kaina' value={description} onChange={(e) => setDescription(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className='my-3'>Priskirti patiekalą restorano menu:</label>
                    <select required className='form-select dish' value={menu} onChange={(e) => setMenu(e.target.value)}>
                      <option value={""}>--Nėra jokio restorano menu--</option>
                      {menus.map(m => (
                        <option key={m.id} value={m.id} >{m.title}</option>
                      )
                      )}
                    </select>
                  </div><button onClick={(e) => cancelEdit(e)} className='bg-dark btn float-end text-light m-3'>Atšaukti</button>
                  <button onClick={changeDish} className='bg-success btn float-end text-light m-3'>Pakeisti</button>
                </form>
              </div>
          }</div> : <div></div>}

        </div > : <div className="d-flex justify-content-center">
          <div className="spinner-border m-5" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>}

      </>
    );
  }
}

export default Dish;

