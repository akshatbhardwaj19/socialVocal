import React from 'react'
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/auth/login/LoginPage';
import SignUpPage from './pages/auth/signup/SignUpPage';
import { Route,Routes } from 'react-router-dom';
import Error from './pages/Error/Error';
import Sidebar from './components/common/Sidebar';
import RightPanel from './components/common/RightPanel';
import NotificationPage from './pages/notification/NotificationPage';
import ProfilePage from './pages/profile/ProfilePage';

const App = () => {
  return (
    <div className='flex max-w-6xl mx-auto'>
      <Sidebar />
      <Routes>
        <Route path='/' element={<HomePage />}></Route>
        <Route path='/signup' element={<SignUpPage />}></Route>
        <Route path='/login' element={<LoginPage />}></Route>
        <Route path='/notifications' element={<NotificationPage />}></Route>
        <Route path='/profile/:username' element={<ProfilePage />}></Route>
        <Route path='*' element={<Error />}></Route>
      </Routes>
      <RightPanel />
    </div>
  )
}

export default App