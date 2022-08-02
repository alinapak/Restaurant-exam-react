import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

async function loginUser(credentials) {
  console.log(JSON.stringify(credentials));
  return fetch('http://127.0.0.1:8000/api/login',
    {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    }).then(data => data.json())
  // .then((d) => {
  //     console.log(d["authorisation"]['token']);
  // return d;}
  // );
}

export default function Login({ setLogedIn }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const nav = useNavigate();

  useEffect(() => {
    if (token) { 
console.log(token);
window.location.href='/restaurants'}
    else if(!token){
      return nav("/login");
    }
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const loginInfo = await loginUser({ email, password });
    console.log(loginInfo);
    setToken(loginInfo["authorisation"]["token"]);
    localStorage.setItem('token', loginInfo["authorisation"]["token"]);
    localStorage.setItem('username', loginInfo["user"]["name"]);
    // localStorage.setItem('admin', loginInfo["user"]["admin"]);
    setLogedIn(true);
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
            <input type="password" className="form-control" id="pass" onChange={e => setPassword(e.target.value)}  required placeholder="Password" />
          </div>
          <br />
          <button type="submit" className="btn btn-warning">Submit</button>
        </form>

      </div>
    </div>
  )
}
