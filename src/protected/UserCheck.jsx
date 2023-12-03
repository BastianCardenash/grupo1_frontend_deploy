import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../auth/AuthContext';
import './UserCheck.css';

const UserCheck = () => {
  const { token } = useContext(AuthContext);
  const [msg, setMsg] = useState('');
  const [name, setName] = useState('');

  const config = {
    'method': 'get',
    'url': `${import.meta.env.VITE_BACKEND_URL}/protected/protecteduser`,
    'headers': {
      'Authorization': `Bearer ${token}`
    }
  }

  useEffect(() => {
    axios(config).then((response) => {
      const iduser = response.data.id;
      setMsg(iduser);

      const config2 = {
        'method': 'get',
        'url': `${import.meta.env.VITE_BACKEND_URL}/users/${iduser}`,
        'headers': {
          'Authorization': `Bearer ${token}`
        }
      }
      // Buscamos el nombre del usuario donde el id sea igual al id del usuario logueado
      axios(config2).then((response2) => {
        setName(response2.data.name);
      }).catch((error) => {
        console.log("Hubo un error, no estas logueado o el token es inválido o no eres admin.");
        console.log(error);
      });

    }).catch((error) => {
      console.log("Hubo un error, no estas logueado o el token es inválido o no eres admin.");
      console.log(error);
    });
  }, []);

  return (
    <div className='sessionname'>
      <h1>{name}</h1>
    </div>
  );
};

export default UserCheck;