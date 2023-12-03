import { useNavigate } from 'react-router-dom'
import Button from "../../components/Button/Button"
import LogoutButton from "../../profile/Logout"

function Login() {
  const navigate = useNavigate()

  return (
    <div className="login-container">
      <Button text='¡Registrate!' type='submit' onClick={() => navigate('/signup')}/>
      <Button text='¡Inicia sesion!' type='submit' onClick={() => navigate('/login')}/>
    </div>
  )
}

export default Login