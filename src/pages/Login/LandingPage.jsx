import Carousel from '../../components/Input/Carousel'
import Card from '../../components/Input/Card'
import './LandingPage.css'
import { TbMapSearch } from "react-icons/tb";
import { HiOutlineUserGroup } from "react-icons/hi";
import { MdOutlineForum } from "react-icons/md";
import Logo from '../../../public/Logo.png';
import Login from './Login';

function LandingPage() {

  return (
    <div className='landingpage'>

      <div className="row">
        <div className="column left">
          <div className="element">
            <img src={Logo} alt="Descripción de la imagen" style={{ maxWidth: '650px'}} />
          </div>
          <div className="element">
            <p>En todo <span className="highlight">momento</span>.</p>
            <p>En todo <span className="highlight">lugar</span>.</p>
            <p>Todo lo que necesitas para una mejor experiencia en la <span className="highlight">universidad</span>.</p>
            <p>Conoce <span className="highlight">UConnect</span>, la primera red social dedicada exclusivamente para estudiantes
            de la Universidad Católica.</p>
            <Login/>
          </div>
        </div>

        <div className="column right">
            <Carousel>
              <Card
                key={1}
                title={'Estados de actividad'}
                content='¡Muestra donde te encuentras y la actividad que estas realizando! Ya sea si estás en clases, en una reunión o en una sala de estudio,
                incluso si faltaste a la universidad, tus amistades podrán saberlo a cualquier hora. ¡Olvidate de esos rutinarios mensajes de "¿Dónde estás?" o ¿Que
                estás haciendo?" y ve directamente al encuentro!'
                icon={TbMapSearch}
              />
              <Card
                key={2}
                title={'Eventos'}
                content='¿Estás en busca de un grupo de estudio? ¿Eres ayudante y quieres realizar una sesión de consultas extra? ¿Organizar una reunión con
                tu grupo de trabajo? Lo anterior y mucho más podrás hacer con la sección de eventos. ¡Crea eventos y permite que tus compañeros se unan o
                anotate en alguno de los que se encuentran disponibles de acuerdo a tus intereses!'
                icon={HiOutlineUserGroup}
              />
              <Card
                key={3}
                title={'Publicaciones y foros'}
                content='¿Tienes dificultades con el contenido de algun curso y no encuentras la explicación en internet? ¿Quieres compartir material de un ramo que podría
                ser de ayuda para los estudiantes? Solicita ayuda o da una mano a tus compañeros en la sección de foros. ¡Comparte tus conocimientos o aprende junto con los demás!'
                icon={MdOutlineForum}
              />

            </Carousel>
        </div>
      </div>
    </div>
  )
}

export default LandingPage