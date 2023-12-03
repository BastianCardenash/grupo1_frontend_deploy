/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import { AuthContext } from '../../auth/AuthContext'
import { useNavigate } from 'react-router-dom';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AddIcon from '@mui/icons-material/Add';
import './Profile.css'
import axios from 'axios'
import Dialog from '@mui/material/Dialog'

function OwnProfile () {
  const { token, parseJwt } = useContext(AuthContext)
  const [accessDenied, setAccessDenied] = useState(false)
  const [userInfo, setUserInfo] = useState([])
  const [userFriends, setUserFriends] = useState([])
  const [newStatus, setNewStatus] = useState('')
  const [newName, setNewName] = useState('')
  const [newMail, setNewMail] = useState('')
  const [msg, setMsg] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [prevPassword, setPrevPassword] = useState('')
  const [passwordModal, setPasswordModal] = useState(false)
  const [passMsg, setPassMsg] = useState('')
  const navigate = useNavigate()
  const [actualUserId, setActualUserId] = useState(0) 
  const [edit, setEdit] = useState(false)

  const api = axios.create({ baseURL: import.meta.env.VITE_BACKEND_URL })
  api.interceptors.request.use((config) => (config.headers.Authorization = `Bearer ${token}`, config))

  const getUserInfo = async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`)
      setUserInfo(response.data)

      if (response.data.friendsIds != [] && response.data.friendsIds != null) {
        const friendsPromises = response.data.friendsIds.map(async (id) => {
          const user = await api.get(`/users/${id}`)
          return {
            id: user.data.id,
            name: user.data.name,
          }
        })
  
        const friendsWithName = await Promise.all(friendsPromises)
        setUserFriends([...friendsWithName].reverse())
      }
      
    } catch (error) {
      console.error('Ocurrio un error al obtener informacion del usuario:', error);
    }
  }

  const changePassword = async (userId) => {
    if (newPassword != '' && prevPassword != ''){
      try {
        const response = await api.patch(`/users/password/${userId}`, {
          password: newPassword,
          prevPassword
        })
        getUserInfo(userId)
        setPasswordModal(false)
        setNewPassword('')
        setPrevPassword('')
        setPassMsg('')
      } catch (error) {
        if (error.response.data.message) {
          setPassMsg(error.response.data.message)
        }
        console.error('Ocurrio un error al cambiar la contraseña:', error);
      }
    } else {
      setPassMsg('Tienes que completar ambos campos.')
      setTimeout(() => {setPassMsg('')}, 5000)
    }
    
  }

  const handleEdit = () => {
    setNewStatus(userInfo.status)
    setNewName(userInfo.name)
    setNewMail(userInfo.email)
    setEdit(true)
  }

  const editProfile = async (userId) => {
    if (newMail != '' && newName != '') {
      try {
        const response = await api.patch(`/users/${userId}`, {
          email: newMail,
          name: newName,
          status: newStatus
        })
        getUserInfo(userId)
        setMsg('')
        setEdit(false)
      } catch (error) {
        console.error('Ocurrio un error al editar usuario:', error);
      }
    } else {
      setMsg('No puedes dejar el mail o nombre vacio.')
    }
  }

  const cancelEdit = () => {
    setEdit(false)
    setMsg('')
  }

  const closeModal = () => {
    setPasswordModal(false)
    setNewPassword('')
    setPrevPassword('')
    setPassMsg('')
  }

  useEffect(() => {
    if (token != 'null') {
      setActualUserId(parseJwt(token).sub)
      getUserInfo(parseJwt(token).sub)
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
        <h2 className='status-title'>Mi perfil</h2>
        <div className='profile-sections-container'>
          {edit ? 
            <div className='profile-info-own'>
              <div className='profile-edit-section'>
                <h2 className='profile-name'>Nombre: </h2>
                <input className='edit-profile' type='text' value={newName} onChange={(e) => setNewName(e.target.value)}/>
              </div>
              <div className='profile-line'></div>
              <div className='profile-edit-section'>
                <h3 className='profile-text'>Email:</h3>
                <input className='edit-profile' type='text' value={newMail} onChange={(e) => setNewMail(e.target.value)}/>
              </div>
              <div className='profile-edit-section'>
                <h3 className='profile-text'>Estado actual:</h3>
                <input className='edit-profile' type='text' value={newStatus} onChange={(e) => setNewStatus(e.target.value)}/>
              </div>
              <div className='profile-info-section'>
                <button className='edit-profile-button' onClick={() => cancelEdit()}>Cancelar</button>
                <button className='edit-profile-button' onClick={() => editProfile(userInfo.id)}>Confirmar</button>
              </div>
              {msg.length > 0 && <div className="alert alert-danger"> {msg} </div>}
            </div>
          :
            <div className='profile-info-own'>
              <h2 className='profile-name'>{userInfo.name}</h2>
              <div className='profile-line'></div>
              <div className='profile-info-section'>
                <h3 className='profile-text'>Email:</h3>
                <h3 className='profile-text'>{userInfo.email}</h3>
              </div>
              <div className='profile-info-section'>
                <h3 className='profile-text'>Estado actual:</h3>
                {userInfo.status == '' || userInfo.status == null 
                  ? <h3 className='profile-text'>N/A</h3>
                  : <h3 className='profile-text'>{userInfo.status}</h3>
                }
              </div>
              <div className='profile-info-section'>
                <button className='edit-profile-button' onClick={() => handleEdit()}>Editar perfil</button>
                <button className='edit-profile-button' onClick={() => setPasswordModal(true)}>Cambiar contraseña</button>
              </div>
            </div>
          }
          <Dialog
            open={passwordModal}
            onClose={() => closeModal()}
          >
            <p className='dialog-text'>Ingresa tu contraseña actual:</p>
            <input className='edit-profile' type='password' value={prevPassword} onChange={(e) => setPrevPassword(e.target.value)}/>
            <p className='dialog-text'>Ingresa la nueva contraseña:</p>
            <input className='edit-profile' type='password' value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
            <button className='edit-status-button' onClick={() => changePassword(userInfo.id)}>Confirmar</button>
            {passMsg.length > 0 && <div className="alert alert-danger"> {passMsg} </div>}
          </Dialog>
          <div className='profile-friends'> 
            <div className='profile-friend'>
              <h2 className='profile-name'>Lista de amigos:</h2>
              {/* TODO: Verificar ruta cuando este lo de agregar amigo */}
              <AddIcon id='chat-icon' onClick={() => navigate('/friends')}/>
            </div>
            <div className='profile-line'></div>
            {userFriends.length > 0 ? userFriends.map((user, index) => (
              <div key={index} className='profile-friend'>
                <h2 className='profile-name'>{user.name}</h2>
                <AccountBoxIcon id='chat-icon' onClick={() => navigate(`/profile/${user.id}`)}/>
              </div>
            ))
            :
              <h2 className='profile-name' style={{fontWeight: '500'}}>No tienes amigos agregados</h2>
            }
          </div>
        </div>
      </div>
    )
  }
}

export default OwnProfile