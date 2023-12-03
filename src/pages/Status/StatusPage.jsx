/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import { AuthContext } from '../../auth/AuthContext'
import './StatusPage.css'
import axios from 'axios'
import LocationCard from '../../components/Cards/LocationCard'
import Dialog from '@mui/material/Dialog'

function StatusPage () {
  const { token, parseJwt } = useContext(AuthContext)
  const [usersStatus, setUsersStatus] = useState([])
  const [searchedStatus, setSearchedStatus] = useState([])
  const [accessDenied, setAccessDenied] = useState(false)
  const [friend, setFriend] = useState('')
  const [statusModal, setStatusModal] = useState(false)
  const [searchModal, setSearchModal] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [actualUserId, setActualUserId] = useState(0) 

  const api = axios.create({ baseURL: import.meta.env.VITE_BACKEND_URL })
  api.interceptors.request.use((config) => (config.headers.Authorization = `Bearer ${token}`, config))

  const handleUsersStatus = async (userId) => {
    try {
      const response = await api.get('/users')
      const user = await api.get(`/users/${userId}`)
      const usersFriends = response.data.filter(elem => user.data.friendsIds.includes(elem.id))
      setUsersStatus(usersFriends.reverse())
      setSearchedStatus(usersFriends.reverse())
    } catch (error) {
      console.error('Ocurrio un error al mostrar los estados:', error);
    }
  }

  const editUserStatus = async () => {
    try {
      await api.patch(`/users/${actualUserId}`, {
        status: newStatus
      })
      setStatusModal(false)
      setNewStatus('')
    } catch (error) {
      console.error('Ocurrio un error al editar el estado:', error);
    }
  }

  const searchFriend = () => {
    const searched = usersStatus.filter(user => user.name.includes(friend))
    setSearchedStatus(searched)
    setFriend('')
    setSearchModal(false)
  }

  useEffect(() => {
    if (token != 'null') {
      setActualUserId(parseJwt(token).sub)
      handleUsersStatus(parseJwt(token).sub)
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
      <div className='status-container'>
        <Navbar/>
        <h2 className='status-title'>¡Mira que estan haciendo tus amigos!</h2>
        <div className='status-buttons'>
          <button className='edit-status-button' onClick={() => setSearchModal(true)}>Buscar amigo</button>
          <button className='edit-status-button' onClick={() => setStatusModal(true)}>Cambiar estado</button>
        </div>
        <Dialog
          open={statusModal}
          onClose={() => setStatusModal(false)}
        >
          <p className='dialog-text'>Ingrese el nuevo estado deseado:</p>
          <textarea type="text" className="edit-status" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}/>
          <button className='edit-status-button' onClick={() => editUserStatus(true)}>Confirmar</button>
        </Dialog>
        <Dialog
          open={searchModal}
          onClose={() => setSearchModal(false)}
        >
          <p className='dialog-text'>Ingrese el nombre del amigo a buscar o una parte:</p>
          <textarea type="text" className="edit-status" value={friend} onChange={(e) => setFriend(e.target.value)}/>
          <button className='edit-status-button' onClick={() => searchFriend()}>Confirmar</button>
        </Dialog>
        <div className='grid-status'>
          {searchedStatus.map((user, index) => (
            <div key={index} className='user-status-container'>
              <LocationCard name={user.name} status={user.status} friendId={user.id} userId={actualUserId}/>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default StatusPage
