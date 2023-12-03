/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import { AuthContext } from '../../auth/AuthContext'
import { useParams, useNavigate } from 'react-router-dom';
import './Profile.css'
import axios from 'axios'

function Profile () {
  const { token, parseJwt } = useContext(AuthContext)
  const [accessDenied, setAccessDenied] = useState(false)
  const [userInfo, setUserInfo] = useState([])
  const { id } = useParams();
  const navigate = useNavigate()
  const [actualUserId, setActualUserId] = useState(0) 
  const [deleteMsg, setDeleteMsg] = useState('')

  const api = axios.create({ baseURL: import.meta.env.VITE_BACKEND_URL })
  api.interceptors.request.use((config) => (config.headers.Authorization = `Bearer ${token}`, config))

  const getUserInfo = async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`)
      setUserInfo(response.data)
    } catch (error) {
      console.error('Ocurrio un error al obtener informacion del usuario:', error);
    }
  }

  const deleteFriend = async (userId) => {
    try {
      const confirmation = window.confirm('¿Seguro que quieres eliminar el comentario?')
      if (confirmation) {
        const response = await api.patch(`/users/${actualUserId}/remove/${userId}`)
        navigate('/profile')
      }
    } catch (error) {
      setDeleteMsg(error.response.data.message)
      console.error('Ocurrio un error al eliminar amigo:', error);
    }
  }

  useEffect(() => {
    if (token != 'null') {
      setActualUserId(parseJwt(token).sub)
      getUserInfo(id)
      const tokenExpired = token && parseJwt(token).exp < Date.now() / 1000;
      if (tokenExpired) {
        setAccessDenied(true)
      }
    }
    else {
      setAccessDenied(true)
    }
  }, [token])

  if (accessDenied) {
    return (
      <>
        <h1 className='unauthorized-message'>No tienes autorización para ver esta página</h1>
        <button className='unauthorized-button' onClick={() => window.location.href = '/login'}>Inicia sesión</button>
      </>
    )
  } else {
    return (
      <div className='profile-container'>
        <Navbar/>
        <h2 className='status-title'>Perfil de amigo</h2>
        <div className='profile-sections-container'>
          <div className='profile-info'>
            <h2 className='profile-name'>{userInfo.name}</h2>
            <div className='profile-line'></div>
            <div className='profile-info-section'>
              <h3 className='profile-text'>Mail del usuario:</h3>
              <h3 className='profile-text'>{userInfo.email}</h3>
            </div>
            <div className='profile-info-section'>
              <h3 className='profile-text'>Numero de amigos:</h3>
              {userInfo.friendsIds ? <h3 className='profile-text'>{userInfo.friendsIds.length}</h3> : <h3 className='profile-text'>0</h3>}
            </div>
            <div className='profile-info-section'>
              <h3 className='profile-text'>Estado del usuario:</h3>
              {userInfo.status == '' || userInfo.status == null 
                ? <h3 className='profile-text'>N/A</h3>
                : <h3 className='profile-text'>{userInfo.status}</h3>
              }
            </div>
            <div className='profile-info-section'>
              <button className='edit-profile-button' onClick={() => navigate(`/chat/${userInfo.id}/${actualUserId}`)}>Ir a chat</button>
              <button className='edit-profile-button' onClick={() => deleteFriend(userInfo.id)}>Eliminar amigo</button>
            </div>
            {deleteMsg.length > 0 && <div className="alert alert-danger"> {deleteMsg} </div>}
          </div>
        </div>
      </div>
    )
  }
}

export default Profile