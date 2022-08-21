import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

async function loginUser(credentials) {
  console.log(JSON.stringify(credentials));
  return fetch('/api/login',{
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    }).then(data => data.json())
}

export default function Login({ setLogedIn }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [message, setMessage] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    if (token) {
      console.log(token);
      window.location.href = '/restaurants'
    }
    else if (!token) {
      return nav("/login");
    }
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const loginInfo = await loginUser({ email, password });
    console.log(loginInfo);
    if (loginInfo.status === "error") {
      setMessage(true);
    }
    else if (loginInfo.status === 'success') {
      setMessage(false);
      setToken(loginInfo["authorisation"]["token"]);
      localStorage.setItem('token', loginInfo["authorisation"]["token"]);
      localStorage.setItem('username', loginInfo["user"]["name"]);
      setLogedIn(true);
    }
  }

  return (


    <div className="col-sm-6 mt-5 offset-sm-3">
      <h5>Please login</h5>
      <div className='card p-3'>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className='m-2' htmlFor="email">Email address</label>
            <input type="email" className="form-control mb-2" id="email" onChange={e => setEmail(e.target.value)} placeholder="Enter email" required />
          </div>
          <div className="form-group">
            <label className='m-2' htmlFor="pass">Password</label>
            <input type="password" className="form-control" id="pass" onChange={e => setPassword(e.target.value)} required placeholder="Password" />
          </div>
          <br />
          <button type="submit" className="btn btn-warning">Submit</button>
        </form>

      </div>
      {message ? <p className='mt-2 alert alert-danger'>Neteisingas pašto adresas arba slaptažodis</p> : ""}
    </div>
  )
}
