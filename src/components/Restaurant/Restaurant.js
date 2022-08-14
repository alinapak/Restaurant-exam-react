import React from 'react';
import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import { HashLink as Link } from 'react-router-hash-link';

function Restaurant() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [restaurants, setRestaurants] = useState([]);
    // const [menus, setMenus] = useState([]);
    const [dish, setDishes] = useState([]);
    const [title, setTitle] = useState("");
    const [code, setCode] = useState("");
    const [city, setCity] = useState("");
    const [address, setAddress] = useState("");
    const [updateForm, setUpdateForm] = useState(false);
    const [selectMenu, setSelectMenu] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [restId, setRestId] = useState("");
    const [menuId, setMenuId] = useState("");
    const [token, _] = useState(localStorage.getItem("token"));
    const [admin, setAdmin] = useState(localStorage.getItem("username"));

    function createRest() {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('code', code);
        formData.append('city', city);
        formData.append('address', address);
        // fetch from heroku
         fetch("https://restaurant-menu-laravel.herokuapp.com/api/v1/restaurants", {
        // fetch while creating app
        // fetch("http://127.0.0.1:8000/api/v1/restaurants", {
            method: 'POST',
            headers: { 'Accept': 'application/json', "Authorization": `Bearer ${token}` },
            body: formData
        });
    }

    function selectRest(id, e) {
        restaurants.map((r) => {
            if (r.id === id) {
                setRestId(r.id);
                setTitle(r.title);
                setCode(r.code);
                setCity(r.city);
                setAddress(r.address);
                setMenuId((r.menu ===null) ? " " : r.menu.id);
                console.log(menuId);
            }
        })
        setUpdateForm(true);
        setSelectMenu(true);
    }
    function updateRest() {
        const formData = new FormData;
        formData.set("_method", "PUT");
        formData.set('title', title);
        formData.set('code', code);
        formData.set('city', city);
        formData.set('address', address);
        // fetch from heroku
          fetch("https://restaurant-menu-laravel.herokuapp.com/api/v1/restaurants/" + restId, {
        // fetch while creating app
        // fetch("http://127.0.0.1:8000/api/v1/restaurants/" + restId, {
            method: 'POST',
            headers: { 'Accept': 'application/json', "Authorization": `Bearer ${token}` },
            body: formData
        })
    }
    function renderMenu(e) {
        fetch("https://restaurant-menu-laravel.herokuapp.com/api/v1/menus/" + menuId, {
            method: 'GET',
            headers: { 'Accept': 'application/json', "Authorization": `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(
                (result) => {
                    // if(!result.ok) {
                    //     setError(result);
                    //     setIsLoaded(true);
                    // }
                    setDishes(result.dishes);
                    setIsLoaded(true);
                },
                (error) => { setError(error); setIsLoaded(true); })
        console.log(dish);
        setShowMenu(true);
    }
    function deleteRest(id, e) {
        // fetch from heroku
        fetch("https://restaurant-menu-laravel.herokuapp.com/api/v1/restaurants/" + id, { 
        // fetch("http://127.0.0.1:8000/api/v1/restaurants/" + id, {
            method: 'DELETE',
            headers: { 'Accept': 'application/json', "Authorization": `Bearer ${token}` }
        })
            .then((response) => {
                if (response.status === 200) {
                    const remaining = restaurants.filter(r => id !== r.id)
                    setRestaurants(remaining)
                }
            });
    }

    useEffect(() => {
        // fetch from heroku
        fetch("https://restaurant-menu-laravel.herokuapp.com/api/v1/restaurants",
        // fetch while creating app
        // fetch("http://127.0.0.1:8000/api/v1/restaurants",
            { headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', "Authorization": `Bearer ${token}` } }
        )
            .then(res => res.json())
            .then(
                (result) => {
                    // if(!result.ok) {
                    //     setError(result);
                    //     setIsLoaded(true);
                    // }
                    setRestaurants(result);
                    setIsLoaded(true);
                },
                (error) => { setError(error); setIsLoaded(true); })
    }, [])
    // useEffect(() => {
    //     // fetch from heroku
    //     fetch("https://restaurant-menu-laravel.herokuapp.com/api/v1/menus",
    //     // fetch while creating app
    //     // fetch("http://127.0.0.1:8000/api/v1/restaurants",
    //         { headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', "Authorization": `Bearer ${token}` } }
    //     )
    //         .then(res => res.json())
    //         .then(
    //             (result) => {
    //                 // if(!result.ok) {
    //                 //     setError(result);
    //                 //     setIsLoaded(true);
    //                 // }
    //                 setMenus(result);
    //                 setIsLoaded(true);
    //             },
    //             (error) => { setError(error); setIsLoaded(true); })
    // }, [])

    if (!isLoaded) {
        return <div>Loading...</div>;
    } else if (error) {
        return <div>Error: {error.message}</div>;
    } else {
        return (
            <>

                {admin === 'admin' ? <Link className="btn btn-success btn-lg d-block m-5" to="#create" role="button">Sukurti restoraną</Link> : <h1 className='display-1 m-3 p-3 text-success text-center'>Restoranai</h1>}
                <div className="container card mt-3">
                    <table className="table m-3 table-responsive">
                        <thead>
                            <tr>
                                <th>Pavadinimas</th>
                                <th>Kodas</th>
                                <th>Miestas</th>
                                <th>Adresas</th>
                                {admin === "admin" ? <th>Veiksmai</th> : <th></th>}
                            </tr>
                        </thead>
                        <tbody>
                            {restaurants.map(restaurant => (
                                <tr key={restaurant.id}>
                                    {admin === 'admin' ? <td>{restaurant.title}</td> : <td><button className="btn btn-success mx-1" onClick={(e) => selectRest(restaurant.id, e)}>{restaurant.title}</button></td>}
                                    <td>{restaurant.code}</td>
                                    <td>{restaurant.city}</td>
                                    <td>{restaurant.address}</td>
                                    {admin === 'admin' ? <td className='d-grid gap-2 d-md-block'><button className="btn btn-success mx-1" onClick={(e) => selectRest(restaurant.id, e)}>Atnaujinti</button><button onClick={(e) => deleteRest(restaurant.id, e)} className="btn btn-dark">Ištrinti</button></td> : <td></td>}
                                </tr>
                            )
                            )}
                        </tbody>
                    </table>
                    {selectMenu ? <><button onClick={(e) => renderMenu()} className="btn btn-success mx-1 mb-3">Peržiūrėti {title} Menu</button></> : <></>}
                    {showMenu ? <div class="row">
                        {dish.map(d => (
                            <div class="col-sm-6">
                                <div key={d.id} className="card text-center">
                                    <div className="card-body d-flex ">
                                        <div>
                                            <h5 className="card-title">{d.title}</h5>
                                            <img className='m-2 card-img-top' style={{ width: "200px", height: "150px", objectFit: "cover" }} src={'http://127.0.0.1:8000/' + d.file}></img>
                                            <p className='text-success fst-italic fs-4'>{d.price}</p>
                                        </div>
                                        <div className='float-end m-3' style={{"width":"15rem"}}>
                                            <p className="card-text p-4 text-wrap">{d.description}</p>
                                        </div>


                                    </div>
                                </div></div>
                        ))}</div> : <></>}
                    {admin === 'admin' ? <div>{!updateForm
                        ? <div id='create' className='card  mt-3 border-success'>
                            <h3 className='m-3 text-success text-center mt-5'> Sukurti restoraną</h3>
                            <form className='container'>
                                <div className="form-group">
                                    <input name='title' type="text" className="form-control m-1" placeholder='Pavadinimas' value={title} onChange={(e) => setTitle(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <input name='title' type="text" className="form-control m-1" placeholder='Kodas' value={code} onChange={(e) => setCode(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <input name='city' type="text" className="form-control m-1" placeholder='Miestas' value={city} onChange={(e) => setCity(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <input name='address' type="text" className="form-control m-1" placeholder='Adresas' value={address} onChange={(e) => setAddress(e.target.value)} required />
                                </div>
                                <button onClick={createRest} className='bg-success btn float-end text-light m-3'>Pridėti</button>
                            </form>
                        </div>
                        : <div className='card  mt-3 border-success'>
                            <h3 className='m-3 text-success text-center mt-5'> Pakeisti restoraną</h3>
                            <form className='container'>
                                <div className="form-group">
                                    <input name='title' type="text" className="form-control m-1" placeholder='Pavadinimas' value={title} onChange={(e) => setTitle(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <input name='title' type="text" className="form-control m-1" placeholder='Kodas' value={code} onChange={(e) => setCode(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <input name='city' type="text" className="form-control m-1" placeholder='Miestas' value={city} onChange={(e) => setCity(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <input name='address' type="text" className="form-control m-1" placeholder='Adresas' value={address} onChange={(e) => setAddress(e.target.value)} required />
                                </div>
                                <button onClick={(e) => setUpdateForm(false)} className='bg-dark btn float-end text-light m-3'>Atšaukti</button>
                                <button onClick={updateRest} className='bg-success btn float-end text-light m-3'>Pakeisti</button>
                            </form>
                        </div>}</div> : <div></div>}

                </div>
            </>
        );
    }
}

export default Restaurant;

