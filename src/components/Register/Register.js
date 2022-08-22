import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';


function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(false);
  const nav = useNavigate();

  const createUser = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);

    // await fetch('/register', {
    await fetch('https://restaurant-app-laravel.herokuapp.com/api/register', {
      method: 'POST',
      body: formData,
      headers: { "Accept": 'application/json' },
    }).then(response => {
      console.log(response);

      if (response.status === 200) {
        return nav("/login");
      }
      else if (response.status === 422) {
        setMessage(true);
      }
    });
  }
  return (
    <>
      <div className="col-sm-6 mt-5 offset-sm-3">
        <h5>Prašome užsiregistruoti</h5>
        <div className='card p-3'>
          <form onSubmit={createUser}>
            <div className="form-group">
              <label className='m-2' htmlFor="text">Vardas</label>
              <input type="text" className="form-control mb-2" id="text" placeholder="Įveskite savo vardą" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="form-group">
              <label className='m-2' htmlFor="email">El. paštas</label>
              <input type="email" className="form-control mb-2" id="email" placeholder="Įveskite savo el. paštą" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label className='m-2' htmlFor="pass">Slaptažodis</label>
              <input type="password" className="form-control" id="pass" placeholder="Sukurkite slaptažodį" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <br />
            <button type="submit" className="btn btn-warning">Užsiregistruoti</button>
          </form>
        </div>
        {message ? <p className='mt-2 alert alert-danger'>Vartotojas tokiu el. pašto adresu jau užsiregsitravęs</p> : ""}
      </div>
    </>
  );
}
export default Register;
