import './instructions.css';
import Navbar from '../../components/Navbar/Navbar';

function Instructions(){
  return(
    <div className='instrucctions-container'>
      <Navbar/>
      <div className='info-container'>
        <h1 className='title'>Instrucciones</h1>
        <p>UConnect es una plataforma diseñada para los alumnos de la universidad católica, donde pueden compartir su actividad, participar de eventos y resolver sus dudas.</p>
        <h2>Registro de Usuario</h2>
        <p>Para usar al aplicación primero debe obligatoriamente registrarse mediante el formulario de log in.</p>
        <h2>Perfil</h2>
        <p>Este apartado te permite configurar qué mostrar en tu perfil, tu actividad, carrera, etc.</p>
        <h2>Ubiación de amigos</h2>
        <p>En este apartado se puede ver el nombre y la ubicacion de los amigos de tu lista de amigos.</p>
        <h2>Chats</h2>
        <p>Esta pestaña te permite chatear con los usuarios que esten en tu lista de amigos.</p>
        <h2>Añadir amigos</h2>
        <p>Este apartado te permite agregar usuarios a tu lista de amigos según su nombre de usuario.</p>
        <h2>Eventos</h2>
        <p>Esta pestana te permite ver, crear y unirte a todo tipo de eventos y actividades que se vayan a desarrollar en la universidad.</p>
        <h2> Proximos eventos</h2>
        <p>Este apartado te permite ver los proximos eventos mas relevantes en la universidad con la opción de unirte a ellos.</p>
        <h2>Foros</h2>
        <p>Este apartado esta hecho para poder ver, crear y responder foros de distinto tipo, ya sea sobre información general de la universidad o pedir ayuda respecto a algún curso.</p>
        <h2>Publicaciones</h2>
        <p>Esta sección te permite crear una publicación con la opción de agregar una foto.</p>
        <h2>Ubicación</h2>
        <p>Este apartado te permite seleccionar tu ubicación para que la puedan los demas usuarios.</p>
      </div>
    </div>
  )
}
  
export default Instructions