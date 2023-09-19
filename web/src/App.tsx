import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Login from './pages/login';
import Register from './pages/Register';
import Recover from './pages/Recover';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import VerifyEmail from './middleware/VerifyEmail';
import Home from './pages/Home';
import ChangePassword from './middleware/ChangePassword';
import ResetPassword from './pages/ResetPassword';
import { AuthProvider } from './context/AuthContext';
import { LogProvider } from './context/LogContext';
import Profile from './pages/Profile';
import Story from './pages/Story';
import TextStory from './pages/TextStory';
import Friend from './pages/Friend';
import Reel from './pages/Reel';
import ReelDisplay from './pages/ReelDisplay';
import Chat from './pages/Chat';
import Notification from './pages/Notification';
import Search from './pages/Search';
import Group from './pages/Group';
import CreateGroup from './pages/CreateGroup';
import GroupProfile from './pages/GroupProfile';
import ChatId from './pages/ChatId';

function App() {
  return (
    <>
      <div>
        <BrowserRouter>
          <Routes>
            <Route path='/login' element={
              <LogProvider>
                <Login />
              </LogProvider>
            } />
            <Route path='/register' element={
              <LogProvider>
                <Register />
              </LogProvider>} />
            <Route path='/recover' element={
              <LogProvider>
                <Recover />
              </LogProvider>
            } />
            <Route path='/' element={
              <AuthProvider>
                <Home />
              </AuthProvider>
            } />
            <Route path='/verif/:token' element={<VerifyEmail />} />
            <Route path='/change_password/:token' element={
              <ChangePassword>
                <ResetPassword></ResetPassword>
              </ChangePassword>
            } />
            <Route path='/login' element={<Login />} />
            <Route path="/create-story" element={
              <AuthProvider>
                <Story />
              </AuthProvider>
            } />
            <Route path='/create-story/text' element={
              <AuthProvider>
                <TextStory />
              </AuthProvider>
            } />
            <Route path='/profile/:username' element={
              <AuthProvider>
                <Profile />
              </AuthProvider>
            } />
            <Route path='/friends' element={
              <AuthProvider>
                <Friend />
              </AuthProvider>
            } />
            <Route path='/create-reel' element={
              <AuthProvider>
                <Reel />
              </AuthProvider>
            } />
            <Route path='/reels' element={
              <AuthProvider>
                <ReelDisplay />
              </AuthProvider>
            } />
            <Route path='/chat' element={
              <AuthProvider>
                <Chat />
              </AuthProvider>
            } />
            <Route path='/notification' element={
              <AuthProvider>
                <Notification />
              </AuthProvider>
            } />
            <Route path='/search/:value' element={
              <AuthProvider>
                <Search />
              </AuthProvider>
            } />
            <Route path='/group' element={
              <AuthProvider>
                <Group />
              </AuthProvider>
            } />
            <Route path='/create-group' element={
              <AuthProvider>
                <CreateGroup />
              </AuthProvider>
            } />
            <Route path='/group/:id' element={
              <AuthProvider>
                <GroupProfile />
              </AuthProvider>
            } />
            <Route path='chat/:id' element={
              <AuthProvider>
                <ChatId />
              </AuthProvider>
            } />
            <Route path='*' element={<h1>404 Not Found</h1>} />
          </Routes>
        </BrowserRouter>
        <ToastContainer position='top-right' autoClose={2000} />
      </div>
    </>
  )
}

export default App;
