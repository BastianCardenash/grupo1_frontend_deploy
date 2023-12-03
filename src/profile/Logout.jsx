import {useContext, useState} from 'react';
import { AuthContext } from '../auth/AuthContext';

const LogoutButton = () => {
  const {logout} = useContext(AuthContext);
  const [msg, setMsg] = useState("");

  const handleLogout = () => {
    logout();
    setMsg("Has hecho logout con éxito!")
  }

  return (
    <>
      {msg.length > 0 && <div className="successMsg"> {msg} </div>}
      <button onClick={handleLogout} style={{backgroundColor: 'transparent', border: '2px solid', borderRadius: '10px', width: 'auto'}}>
        Cerrar sesión
      </button>
    </>
  );
}

export default LogoutButton;