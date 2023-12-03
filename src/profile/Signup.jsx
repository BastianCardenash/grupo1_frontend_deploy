import { useState } from 'react';
import axios from 'axios';
import Logo from '../assets/Logo.png';
import './Signup.css';
import { useNavigate } from 'react-router-dom'

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault();

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/signup`, {
        name: name,
        email: email,
        password: password,
      })
      .then(() => {
        setError(false);
        setMsg('Registro exitoso, te redirigiremos al login en un momento');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
      })
      .catch((error) => {
        console.error('Ocurrió un error:', error);
        setError(true);
        setName('');
        setEmail('');
        setPassword('');
      });
  };

  return (
    <div className="Signup">
      <div className="form-box">
        <img src={Logo} alt="Descripción de la imagen" style={{ maxWidth: '300px' }} />
        <h1>Sign Up</h1>
        {msg.length > 0 && <div className="alert alert-success"> {msg} </div>}
        {error && <div className="alert alert-danger">El correo ingresado ya se encuentra registrado</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              <i className="bi bi-person-fill"></i> Name:
            </label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              <i className="bi bi-envelope-fill"></i> Email:
            </label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              <i className="bi bi-lock-fill"></i> Password:
            </label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className='submit-button'>
            <button type="submit" className="btn btn-primary btn-lg btn-submit">
              <i className="bi bi-box-arrow-in-right me-2 fs-5"></i> Submit
            </button>
          </div>

          <button className="btn btn-primary btn-lg btn-submit" onClick={() => navigate('/')}>
            Volver al inicio
          </button>

        </form>
      </div>
    </div>
  );
}

export default Signup;