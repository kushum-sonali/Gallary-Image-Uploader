import './App.css'
import { SignupForm } from './components/custom/Signup'
import { LoginForm } from './components/custom/Login' 
import { Route, Routes,useLocation,useNavigate } from 'react-router-dom'
import UploadImage from './pages/UploadImage'
import Forgetpass from './pages/Forgetpass'
import Resetpass from './pages/Resetpass'
import Gallary from './pages/Gallary'
import NavBar from './components/custom/NavBar'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { Toaster } from './components/ui/toaster'
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

function App() {
  const {user}= useSelector((state) => state.user)

  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if ( location.pathname === "/") {
      if(user){
        navigate("/upload-image")
      }
      else{
      navigate("/login")
      }
    }
  }, [user, location, navigate])
  return (
    <div className="h-screen bg-[#f3f4f5] flex flex-col gap-2  items-center">
      <NavBar />
       <Routes>
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/upload-image" element={<UploadImage />} />
        <Route path="/forgetpass" element={<Forgetpass />} />
        <Route path="/resetpass/:id/:token" element={<Resetpass />} />
        <Route path="/gallary/:uid" element={<Gallary />} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
