import HomeIcon from '@mui/icons-material/Home';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import ChatIcon from '@mui/icons-material/Chat';
import GroupIcon from '@mui/icons-material/Group';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useNavigate } from 'react-router-dom'
import LogoutButton from '../../profile/Logout';
import UserCheck from '../../protected/UserCheck';
import './Navbar.css'
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../auth/AuthContext';
import axios from 'axios';

function Navbar() {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const { token, parseJwt } = useContext(AuthContext);
  const [useremail, setUseremail] = useState('');
  const actualUserId = parseJwt(token).sub;

  const api = axios.create({ baseURL: import.meta.env.VITE_BACKEND_URL })
  api.interceptors.request.use((config) => (config.headers.Authorization = `Bearer ${token}`, config))

  const isAdmin = () => {
    const scope = parseJwt(token).scope;
    if (scope.includes('admin')) {
      return true;
    } else {
      return false;
    }
  }

  return (
    <div className="navbar-container">
      <div className="navbar-section">
        <div className='navbar-option' onClick={() => navigate('/home')}>
          {/* TODO: Reemplazar por el icono de la pagina cuando este */}
          <HomeIcon/>
          <p className='navbar-text'>Home</p>
        </div>
        <div className='navbar-option' onClick={() => navigate('/events')}>
          <EventIcon/>
          <p className='navbar-text'>Eventos</p>
        </div>
        <div className='navbar-option' onClick={() => navigate('/chat')}>
          <ChatIcon/>
          <p className='navbar-text'>Chats</p>
        </div>
        <div className='navbar-option' onClick={() => navigate('/info')}>
          <InfoOutlinedIcon/>
          <p className='navbar-text'>Instrucciones</p>
        </div>
        {isAdmin() && <div className='navbar-option' onClick={() => navigate('/admin')}>
          <GroupIcon/>
          <p className='navbar-text'>Administrar Usuarios</p>
        </div>}
      </div>
      <div className="navbar-section">
        <div className='navbar-option' onClick={() => navigate('/status')}>
          <GroupIcon/>
          <p className='navbar-text'>Estados</p>
        </div>
        <div className='navbar-option' onClick={() => navigate('/friends')}>
          <PersonAddIcon/>
          <p className='navbar-text'>Añadir amigo</p>
        </div>
        <div className='navbar-option' onClick={() => navigate('/profile')}>
          <PersonIcon/>
          <UserCheck></UserCheck>
        </div>
        <div className='navbar-option' onClick={() => navigate('/')}>
          <LogoutButton></LogoutButton>
        </div>
      </div>
    </div>
  )
}


export default Navbar