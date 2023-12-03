import { useState, useContext, useEffect } from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import EditNoteIcon from '@mui/icons-material/EditNote';
import axios from 'axios';
import { AuthContext } from '../../auth/AuthContext'
import './EventCard.css'

export default function EventCard({ eventId, name, title, description, canDelete, deleteEvent, getEvents, joinEvent, leaveEvent, participantsIds, userId }) {
    const { token } = useContext(AuthContext)
    const [edit, setEdit] = useState(false)
    const [newTitle, setNewTitle] = useState('')
    const [newText, setNewText] = useState('')
    const [msg, setMsg] = useState('')
    const isUserParticipant = participantsIds.map(String).includes(String(userId));
    const [showParticipants, setShowParticipants] = useState(false);
    const [participantsData, setParticipantsData] = useState([]);

    const api = axios.create({ baseURL: import.meta.env.VITE_BACKEND_URL })
    api.interceptors.request.use((config) => (config.headers.Authorization = `Bearer ${token}`, config))

    const handleEdit = () => {
        setNewTitle(title)
        setNewText(description)
        setEdit(true)
    }

    const editEvent = async () => {
        if (newText != '' && newTitle != '') {
            try {
                await api.patch(`/events/${eventId}`, {
                    name: newTitle,
                    description: newText
                })
                setMsg('')
                getEvents()
                setEdit(false)
            } catch (error) {
                console.error('Ocurrio un error al editar el evento:', error)
            }
        }
        else {
            setMsg('No puedes dejar alguno de los campos vacio.')
        }
    }

    const cancelEdit = () => {
        setEdit(false)
        setMsg('')
    }

    const toggleParticipants = () => {
        setShowParticipants(!showParticipants);
    }

    useEffect(() => {
        const fetchParticipantsData = async () => {
            try {
                const participantsDetails = await Promise.all(
                    participantsIds.map(async (participantId) => {
                        try {
                            const response = await api.get(`/users/${participantId}`);
                            return response.data;
                        } catch (error) {
                            console.error(`Error al obtener detalles del participante ${participantId}:`, error);
                            return null;
                        }
                    })
                );
                setParticipantsData(participantsDetails.filter(Boolean));
            } catch (error) {
                console.error('Error al obtener detalles de participantes:', error);
            }
        };

        if (showParticipants) {
            fetchParticipantsData();
        }
    }, [participantsIds, showParticipants]);

    return (
        <div className='event-card-container'>
            <div className='event-card-header'>
                <h2 className='event-user'>{name}</h2>
                {canDelete && <EditNoteIcon className='event-icon' onClick={() => handleEdit()} />}
                {canDelete && <DeleteIcon className='event-icon' onClick={() => deleteEvent(eventId)} />}
            </div>
            {edit ?
                <>
                    <div className='event-card-body'>
                        <input className='edit-title' type='text' value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
                        <textarea className='edit-text' type='text' value={newText} onChange={(e) => setNewText(e.target.value)} />
                    </div>
                    <div className='comment-buttons'>
                        <button className='comment-post-button' onClick={() => cancelEdit()}>Cancelar</button>
                        <button className='comment-post-button' onClick={() => editEvent()}>Editar</button>
                    </div>
                    {msg.length > 0 && <p className='error-msg'>{msg}</p>}
                </>
                :
                <div className='event-card-body'>
                    <h2 className='event-title'>{title}</h2>
                    <p className='event-text'>{description}</p>
                    <div className='join-button'>
                        {isUserParticipant ? (
                            <>
                                <button className='event-button' onClick={() => leaveEvent(eventId)}>Abandonar</button>
                                <button className='event-button-2' onClick={toggleParticipants}>
                                    {showParticipants ? 'Ocultar Participantes' : 'Mostrar Participantes'}
                                </button>
                            </>
                        ) : (
                            <>
                                <button className='event-button' onClick={() => joinEvent(eventId)}>Unirse</button>
                                <button className='event-button-2' onClick={toggleParticipants}>
                                    {showParticipants ? 'Ocultar Participantes' : 'Mostrar Participantes'}
                                </button>
                            </>
                        )}
                    </div>

                    {showParticipants && (
                        <div className='participants-list'>
                            <h3>Participantes:</h3>
                            <ul>
                                {participantsData.map(participant => (
                                    <li key={participant.id}>{participant.name}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            }
            {msg.length > 0 && <p className='error-msg'>{msg}</p>}
        </div>
    )
}  