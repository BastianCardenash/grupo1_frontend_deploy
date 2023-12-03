import { useEffect, useState, useContext } from 'react';
import Button from '../components/Button/Button';
import { AuthContext } from '../auth/AuthContext';
import axios from 'axios';
import Navbar from '../components/Navbar/Navbar';
import Input from '../components/Input/Input';
import EventCard from '../components/Cards/EventCard';
import './Events.css';

function Events() {
  const { token, parseJwt } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [msg, setMsg] = useState('');
  const [deleteMsg, setDeleteMsg] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [actualUserId, setActualUserId] = useState('');

  const api = axios.create({ baseURL: import.meta.env.VITE_BACKEND_URL })
  api.interceptors.request.use((config) => (config.headers.Authorization = `Bearer ${token}`, config))

  useEffect(() => {
    if (token != null) {
      setActualUserId(parseJwt(token).sub)
    }
    getEvents();
  }, [])

  const handleEvent = async () => {
    if (eventTitle != '' && eventDescription != '') {
      try {
        await api.post('/events', {
          user_id: actualUserId,
          name: eventTitle,
          description: eventDescription,
          participantsIds: [actualUserId]
        })
        setEventTitle('');
        setEventDescription('');
        setMsg('')
        getEvents();
      } catch (error) {
        console.log('Ocurrió un error al crear el evento')
      }
    }
    else {
      setMsg('Tienes que rellenar los campos para crear un evento')
    }
  }

  const getEvents = async () => {
    try {
      console.log(actualUserId)
      const response = await api.get('/events');
      const userPromises = response.data.map(async (event) => {
        const user = await api.get(`/users/${event.user_id}`)
        return {
          id: event.id,
          userName: user.data.name,
          user_id: event.user_id,
          title: event.name,
          description: event.description,
          participantsIds: event.participantsIds,
          fecha: event.createdAt
        }
      })

      const eventsWithUserNames = await Promise.all(userPromises)

      const sortedEvents = [...eventsWithUserNames].sort((a, b) => {
        const dateA = new Date(a.fecha);
        const dateB = new Date(b.fecha);
        return dateB - dateA; // Orden descendente, cambia a dateA - dateB para ascendente
      });
  
      setEvents(sortedEvents);
    } catch (error) {
      console.log('Ocurrió un error al obtener los eventos')
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      const confirmation = window.confirm('¿Estás seguro de que quieres eliminar este evento?')
      if (confirmation) {
        await api.delete(`/events/${eventId}`)
        setDeleteMsg('Evento eliminado correctamente')
        getEvents()

        setTimeout(() => {
          setDeleteMsg('')
        }, 3000);
      }
    } catch (error) {
      console.log('Ocurrió un error al eliminar el evento')
    }
  }

  const handleJoinEvent = async (eventId) => {
    try {
      await api.patch(`/events/${eventId}/add/${actualUserId}`)
      getEvents();
    } catch (error) {
      console.log('Ocurrió un error al unirse al evento')
    }
  }

  const handleLeaveEvent = async (eventId) => {
    try {
      await api.patch(`/events/${eventId}/remove/${actualUserId}`)
      getEvents();
    } catch (error) {
      console.log('Ocurrió un error al unirse al evento')
    }
  }

  const isAdmin = () => {
    const scope = parseJwt(token).scope;
    if (scope.includes('admin')) {
      return true;
    } else {
      return false;
    }
  }

  return (
    <div className='home-page-container'>
      <Navbar />
      <div className='home-page-info-container'>
        <div className='home-event-column'>
          <div className='event-column'>
            <h2 className='subtitle'>¡Crea tu evento!</h2>
            <Input type='post' text={eventDescription} title={eventTitle} setText={setEventDescription} setTitle={setEventTitle} />
            {msg.length > 0 && <div className="alert alert-danger"> {msg} </div>}
            <div className='post-button-container'>
              <Button text='Crear evento' type='submit' onClick={handleEvent} />
            </div>
          </div>
          <div className='event-column'>
            <h2 className='subtitle'>Eventos disponibles</h2>
            {deleteMsg.length > 0 && <div className="alert alert-danger"> {deleteMsg} </div>}
            {events.length > 0 &&
              events.map((event, index) => (
                <div key={index}>
                  <EventCard
                    eventId={event.id}
                    name={event.userName}
                    title={event.title}
                    description={event.description}
                    canDelete={event.user_id ==  actualUserId || isAdmin()}
                    deleteEvent={deleteEvent}
                    joinEvent={handleJoinEvent}
                    getEvents={getEvents}
                    leaveEvent={handleLeaveEvent}
                    participantsIds={event.participantsIds}
                    userId = {actualUserId}
                  />
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default Events;