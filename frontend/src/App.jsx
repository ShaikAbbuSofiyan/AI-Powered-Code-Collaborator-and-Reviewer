import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home.jsx'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { useEffect } from 'react'
import API from './services/api.js'
import { useDispatch } from 'react-redux'
import { setUser } from './redux/authSlice.js'
import CreateProject from './pages/CreateProject.jsx'
import Workspace from './pages/Workspace.jsx'

function App() {
  const dispatch = useDispatch();
  useEffect(()=>{
    async function checkAuth(){
      try {
        const response = await API.get('/api/auth/getUser', {withCredentials: true});
        dispatch(setUser(response.data.user));
      } catch (error) {
        console.log(`User auth error: ${error}`);
      }
    }
    checkAuth();
  }, []);
  return (
    <div className='bg-gray-900 min-h-screen text-white'>
      <Routes>
        {/* <Route path='/' element = {<Home/>} /> */}
        <Route path='/' element = {<Login/>}/>
        <Route path='/dashboard' element = {<Dashboard/>}/>
        <Route path='/signup' element = {<Signup/>}/>
        <Route path='/createproject' element={<CreateProject/>}/>
        <Route path = '/workspace/:id' element = {<Workspace/>}/>
      </Routes>
    </div>
  )
}

export default App
