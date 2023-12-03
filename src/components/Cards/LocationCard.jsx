/* eslint-disable react/prop-types */
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { useNavigate } from 'react-router-dom'
import './LocationCard.css'

export default function LocationCard ({ name, friendId,  status  }) {
  const navigate = useNavigate()
  
  return (
    <div className='location-card-container'>
      <div className='location-card-section'>
        <h2 className='user-name'>{name}</h2>
        {/* TODO: hacer que vaya al chat correspondiente al usuario */}
        <AccountBoxIcon id='chat-icon' onClick={() => navigate(`/profile/${friendId}`)}/>
      </div>
      <div className='location-status'>
        <p className='user-activity'>Estado: </p>
        {status == '' || status == null ? <p className='user-activity'>N/A</p> : <p className='user-activity'>{status}</p>}
      </div>
    </div>
  )
}