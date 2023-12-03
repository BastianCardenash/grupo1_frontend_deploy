import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../auth/AuthContext';
import './AdminCheck.css';
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar';

const AdminCheck = () => {
  const { token, parseJwt } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate()

  const api = axios.create({ baseURL: import.meta.env.VITE_BACKEND_URL })
  api.interceptors.request.use((config) => (config.headers.Authorization = `Bearer ${token}`, config))

  const actualUserId = parseJwt(token).sub;

  const config = {
    'method': 'get',
    'url': `${import.meta.env.VITE_BACKEND_URL}/protected/admin`,
    'headers': {
      'Authorization': `Bearer ${token}`
    }
  }

  useEffect(() => {
    axios(config).then((response) => {
      setUsers(response.data);
    }).catch((error) => {
      console.log("No tienes autorizacion para acceder a esta informacion");
      console.log(error);
    });
  }, []);

  const deleteUser = async (userId) => {
    try {
      const confirmation = window.confirm('¿Estás seguro de que quieres eliminar este usuario?')
      if (confirmation) {
        await api.delete(`/users/${userId}`)
        const updatedUsers = users.filter(user => user.id !== userId);
        setUsers(updatedUsers);
      }
    } catch (error) {
      console.log('Ocurrió un error al eliminar el usuario')
    }
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="user-table">
        <h1 className='title'>Gestión de usuarios</h1>
        <h2 className='subtitle'>Busqueda de usuarios por nombre</h2>
        <div className="search-bar">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="user-container">
          {filteredUsers.length > 0 &&
            filteredUsers.map((user, index) => (
              (user.email !== 'admin@uc.cl') && (
                <div className='user-item' key={index}>
                  <h3 className='h3'>{user.name}</h3>
                  <p>{user.email}</p>
                  <button className='delete-button' onClick={() => deleteUser(user.id)}>Eliminar</button>
                </div>
              )
            ))}
        </div>
      </div>
      <button className='navigate-button' onClick={() => navigate('/home')}>Volver</button>
    </>
  )

}

export default AdminCheck;