import React from 'react';
import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import { HashLink as Link } from 'react-router-hash-link';

function Restaurant() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [restaurants, setRestaurants] = useState([]);
    const [menus, setMenus] = useState([]);
    const [menuTitle, setMenuTitle] = useState("");
    const [dish, setDishes] = useState([]);
    const [title, setTitle] = useState("");
    const [titles, setTitles] = useState("");
    const [code, setCode] = useState("");
    const [codes, setCodes] = useState([]);
    const [city, setCity] = useState("");
    const [address, setAddress] = useState("");
    const [updateForm, setUpdateForm] = useState(false);
    const [selectMenu, setSelectMenu] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [restId, setRestId] = useState("");
    const [menuId, setMenuId] = useState("");
    const [message, setMessage] = useState(false);
    const [token, _] = useState(localStorage.getItem("token"));
    const [admin, setAdmin] = useState(localStorage.getItem("username"));

    function createRest(e) {
        const formData = new FormData();
        titles.map(t => {
            if (t !== title) {
                formData.append('code', code);
            }
            else if (t === title) {
                e.preventDefault();
                setMessage(true);
            }
        });
        formData.append('title', title);
        codes.map(c => {
            if (c !== parseInt(code)) {
                formData.append('code', code);
            }
            else if (c === parseInt(code)) {
                e.preventDefault();
                setMessage(true);
            }
        });
        formData.append('city', city);
        formData.append('address', address);
        fetch("/v1/restaurants", {
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
            }
        })
        setUpdateForm(true);
    }
    function selectMenuId(id, e) {
        menus.map((m) => {
            if (m.id === id) {
                setMenuId(m.id);
                setMenuTitle(m.restaurant.title);
            }
        })
        console.log(menuId);
        setSelectMenu(true);
    }
    function updateRest(e) {
        const formData = new FormData;
        formData.set("_method", "PUT");
        formData.set('title', title);
        const index = codes.indexOf(parseInt(code));
        console.warn(index);
        if (index > -1) {
            codes.splice(index, 1);
            console.warn(codes);
            codes.map(c => {
                if (c !== parseInt(code)) {
                    formData.set('code', code);
                }
                else if (c === parseInt(code)) {
                    e.preventDefault();
                    setMessage(true);
                }
            });
        }
        else if (index === -1) {
            formData.set('code', code);
        }
        formData.set('city', city);
        formData.set('address', address);
        fetch("/v1/restaurants/" + restId, {
            method: 'POST',
            headers: { 'Accept': 'application/json', "Authorization": `Bearer ${token}` },
            body: formData
        })
    }
    function renderMenu(e) {
        fetch("/v1/menus/" + menuId, {
            method: 'GET',
            headers: { 'Accept': 'application/json', "Authorization": `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(
                (result) => {
                    setDishes(result.dishes);
                    setIsLoaded(true);
                },
                (error) => { setError(error); setIsLoaded(true); })
        console.log(dish);
        setShowMenu(true);
    }
    function deleteRest(id, e) {
        fetch("/v1/restaurants/" + id, {
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
        fetch("/v1/restaurants", {
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', "Authorization": `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(
                (result) => {
                    setRestaurants(result);
                    const codeList = result.map(r => r.code);
                    const titleList = result.map(t => t.title);
                    setTitles(titleList);
                    setCodes(codeList);
                    console.log(codes);
                    setIsLoaded(true);
                },
                (error) => { setError(error); setIsLoaded(true); })
    }, [])
    useEffect(() => {
        fetch("/v1/menus", {
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', "Authorization": `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(
                (result) => {
                    setMenus(result);
                    setIsLoaded(true);
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
                {admin === 'admin' ? <Link className="btn btn-success btn-lg d-block m-5" to="#create" role="button">Sukurti restoraną</Link> : <h1 className='display-1 m-3 p-3 text-success text-center'>Restoranai</h1>}
                <div className="container card mt-3">
                    <table className="table m-3 table-responsive">
                        <thead>
                            {admin === 'admin' ? <tr>
                                <th>Pavadinimas</th>
                                <th>Kodas</th>
                                <th>Miestas</th>
                                <th>Adresas</th>
                                <th>Veiksmai</th>
                            </tr> : <tr>
                                <th>Pavadinimas</th>
                                <th>Miestas</th>
                                <th>Adresas</th>
                            </tr>
                            }

                        </thead>
                        {admin === 'admin' ? <tbody>
                            {restaurants.map(restaurant => (
                                <tr key={restaurant.id}>
                                    <td>{restaurant.title}</td>
                                    <td>{restaurant.code}</td>
                                    <td>{restaurant.city}</td>
                                    <td>{restaurant.address}</td>
                                    <td className='d-grid gap-2 d-md-block'><button className="btn btn-success mx-1" onClick={(e) => selectRest(restaurant.id, e)}>Atnaujinti</button><button onClick={(e) => deleteRest(restaurant.id, e)} className="btn btn-dark">Ištrinti</button></td>
                                </tr>
                            )
                            )}
                        </tbody>
                            : <tbody>{menus.map(menu => (
                                <tr key={menu.id}>
                                    <td><button className="btn btn-success mx-1" onClick={(e) => selectMenuId(menu.id, e)}>{menu.restaurant.title}</button></td>
                                    <td>{menu.restaurant.city}</td>
                                    <td>{menu.restaurant.address}</td>
                                </tr>
                            ))}</tbody>}

                    </table>
                    {admin !== 'admin' ? <> {selectMenu ? <button onClick={(e) => renderMenu()} className="btn btn-success mx-1 mb-3">Peržiūrėti {menuTitle} Menu</button> : <></>}</> : <></>}
                    {showMenu ? <div class="row">
                        {dish.map(d => (
                            <div class="col-sm-6">
                                <div key={d.id} className="card text-center">
                                    <div className="card-body d-flex ">
                                        <div>
                                            <h5 className="card-title">{d.title}</h5>
                                            <img className='m-2 card-img-top' style={{ width: "200px", height: "150px", objectFit: "cover" }}
                                            // src while in development mode
                                                // src={'http://127.0.0.1:8000/' + d.file}
                                                // src heroku
                                                src={'https://restaurant-app-laravel.herokuapp.com/' + d.file}
                                                alt={d.title}
                                            >
                                            </img>
                                            <p className='text-success fst-italic fs-4'>{d.price}</p>
                                        </div>
                                        <div className='float-end m-3' style={{ "width": "15rem" }}>
                                            <p className="card-text p-4 text-wrap">{d.description}</p>
                                        </div>


                                    </div>
                                </div></div>
                        ))}</div> : <></>}
                    {admin === 'admin' ? <div>{!updateForm
                        ? <div id='create' className='card  mt-3 border-success'>
                            <h3 className=' text-success text-center mt-5'> Sukurti restoraną</h3>
                            {message ? <p className='mt-2 alert alert-danger'>Restorano kodas ir pavadinimas turi būti unikalus</p> : ""}
                            <form className='container'>
                                <div className="form-group">
                                    <input name='title' type="text" className="form-control m-1" placeholder='Pavadinimas' value={title} onChange={(e) => setTitle(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <input name='title' type="number" className="form-control m-1" placeholder='Kodas' value={code} onChange={(e) => setCode(e.target.value)} required />
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
                            {message ? <p className='mt-2 alert alert-danger'>Restorano kodas turi būti unikalus</p> : ""}
                            <form className='container'>
                                <div className="form-group">
                                    <input name='title' type="text" className="form-control m-1" placeholder='Pavadinimas' value={title} onChange={(e) => setTitle(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <input name='title' type="number" className="form-control m-1" placeholder='Kodas' value={code} onChange={(e) => setCode(e.target.value)} required />
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

