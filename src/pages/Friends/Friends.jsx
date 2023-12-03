import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../auth/AuthContext';
import './Friends.css';
import Navbar from '../../components/Navbar/Navbar';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

const Friends = () => {
    const { token, parseJwt } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate()

    const api = axios.create({ baseURL: import.meta.env.VITE_BACKEND_URL })
    api.interceptors.request.use((config) => (config.headers.Authorization = `Bearer ${token}`, config))

    const actualUserId = parseJwt(token).sub

    const config = {
        'method': 'get',
        'url': `${import.meta.env.VITE_BACKEND_URL}/users`,
        'headers': {
            'Authorization': `Bearer ${token}`
        }
    }

    useEffect(() => {
        axios(config).then((response) => {
            setUsers(response.data);
        }).catch((error) => {
        });
    }, []);

    const addFriend = async (userId) => {
        try {
            await api.patch(`/users/${actualUserId}/friends/${userId}`);
            // Obtener la lista actualizada de usuarios después de agregar un amigo
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (error) {
            console.log('Ocurrió un error al agregar el amigo');
        }
    };
    
    const deleteFriend = async (userId) => {
        try {
            await api.patch(`/users/${actualUserId}/remove/${userId}`);
            // Obtener la lista actualizada de usuarios después de eliminar un amigo
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (error) {
            console.log('Ocurrió un error al eliminar el amigo');
        }
    };

    // Obtenemos el listado de amigos del usuario actual que se guarda en el atributo friendsIds
    const friendsIds = users.filter(user => user.id == actualUserId)[0]?.friendsIds
    console.log(friendsIds)

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Navbar />
            <div className="user-table">
                <h1 className='title'>¡Agrega a tus amigos!</h1>
                <h2 className='subtitle'>Busqueda de usuarios por nombre</h2>
                <div className="search-bar">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="user-container-friend">
                    {filteredUsers.length > 0 &&
                        filteredUsers.map((user, index) => (
                            (user.email != 'admin@uc.cl' && user.id != actualUserId) && (
                                <div className='user-item-friend' key={index}>
                                    <h3 className='h3'>{user.name}</h3>
                                    <AccountBoxIcon id='chat-icon' onClick={() => navigate(`/profile/${user.id}`)}/>
                                    <p>{user.email}</p>
                                    {friendsIds.includes(user.id) ? (
                                        <button className='delete-button' onClick={() => deleteFriend(user.id)}>Eliminar amigo</button>
                                    ) : (
                                        <button className='add-button' onClick={() => addFriend(user.id)}>Agregar amigo</button>
                                    )}
                                </div>
                            )
                        ))}
                </div>
            </div>
            <button className='navigate-button' onClick={() => navigate('/home')}>Volver al inicio</button>
        </>
    )
}

export default Friends;