import { useState,useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from './pages/HomePage'
import RegisterModel from './models/register.model';
import MoviesPage from './pages/MoviesPage';
import ReviewPage from './pages/ReviewPage';

// import MovieList from './hooks/useIMDBLink';
import AccountSettings from './pages/AccountSettingPage';
import WebSeriesPage from './pages/WebSeriesPage';
import TVShows from './pages/TVShows';
import UserActivityPage from './pages/UserActivityPage';

// import getUserDetails from './pages/GetUserDetails';
function App() {
  
  return (
    <>
     <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterModel />} />
        <Route path="/movies" element={<MoviesPage />} />
        <Route path="/review" element={<ReviewPage />} />
      
       <Route path="/user-account-setting" element={<AccountSettings/>} />      
        <Route path='/webseries' element={<WebSeriesPage/>} />
        <Route path='/tvShows' element={<TVShows/>} />
        <Route path='/user-activity' element={<UserActivityPage/>} />
    
      </Routes>
    </Router>
    </>
  )
}

export default App
