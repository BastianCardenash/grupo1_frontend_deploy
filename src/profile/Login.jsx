import { useState, useContext } from 'react';
import axios from 'axios';
import Logo from '../assets/Logo.png';
import './Signup.css';
import { AuthContext } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom'

function Login() {
  const { setToken } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault();

    axios.post(`${import.meta.env.VITE_BACKEND_URL}/login`, {
      email: email,
      password: password
    }).then((response) => {
      console.log('Login successful');
      setError(false);
      setMsg("Login exitoso, te redirigiremos al home en un momento");
      // Recibimos el token y lo procesamos
      const access_token = response.data.access_token;
      localStorage.setItem('token', access_token);

      setToken(access_token);
      console.log(response.data.access_token)

      setTimeout(() => {
        window.location.href = "/home";
      }, 1000);

    }).catch((error) => {
      console.error('An error occurred while trying to login:', error);
      setError(true);
    })

  };

  return (
    <div className="Signup">
      <div className="form-box">
        <img src={Logo} alt="Descripción de la imagen" style={{ maxWidth: '300px' }} />
        <h1>Login</h1>
        {msg.length > 0 && <div className="alert alert-success"> {msg} </div>}
        {error && <div className="alert alert-danger">Las credenciales ingresadas son incorrectas. Intentalo nuevamente.</div>}
        <form onSubmit={handleSubmit}>
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
          <div className="submit-button">
            <button type="submit" className="btn btn-primary btn-lg btn-submit">
              <i className="bi bi-box-arrow-in-right me-2 fs-5"></i> Submit
            </button>
          </div>
        </form>
        <button className="btn btn-primary btn-lg btn-submit" onClick={() => navigate('/')}>
          Volver al inicio
        </button>
      </div>
    </div>
  );
}

export default Login;