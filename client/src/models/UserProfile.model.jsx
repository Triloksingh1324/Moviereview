import React from 'react'
import Navbar from '../component/Navbar'
import LoginModel from './login.model'
const UserProfile=()=> {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
    }
  return (
    <div>
        <Navbar isLoggedIn={isLoggedIn}  />
         <LoginModel onLoginSuccess={handleLoginSuccess} />
    </div>
  )
}

export default UserProfile