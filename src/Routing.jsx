import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Instructions from './pages/Instructions/instructions';
import App from './App'
import Events from './pages/Events'
import Login from './profile/Login'
import Signup from './profile/Signup'
import UserCheck from './protected/UserCheck';
import AdminCheck from './protected/AdminCheck';
import Friends from './pages/Friends/Friends';
import StatusPage from './pages/Status/StatusPage';
import Profile from './pages/Profile/Profile';
import OwnProfile from './pages/Profile/OwnProfile';

function Routing() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App/>} />
        <Route path="/home" element={<Home />} />
        <Route path="/info" element={<Instructions />} />
        <Route path="/events" element={<Events />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/usercheck" element={<UserCheck />} />
        <Route path="/admin" element={<AdminCheck />} />
        <Route path="/friends" element={<Friends />} />
        <Route path='/status' element={<StatusPage/>}/>
        <Route path='/profile' element={<OwnProfile/>}/>
        <Route path='/profile/:id' element={<Profile/>}/>
      </Routes>
    </Router>
  );
}

export default Routing;
