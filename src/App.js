import SideBar from './components/SideBar/SideBar';
import Chats from './components/Chats/Chats';
import Login from './components/Login/Login';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { useEffect, useState } from 'react';
import { useStateValue } from './components/StateProvider';
import { actionTypes } from './components/reducer';
import './App.css';
function App() {
  const [{user}, dispatch] = useStateValue();
  useEffect(() =>{
    const userData = localStorage.getItem('user');
    if(userData) {
      dispatch({
        type: actionTypes.SET_USER,
        user: JSON.parse(userData),
      });
    }
  }, [dispatch])
  return (
    <Router>
      <div className="app">
        {!user ? (
          <Login/>
        ) : (
          <div className='app_body'>
            <Routes>
              <Route  path='/'  element= {
                <>
                  <SideBar />
                  <Chats />
                </>
              }/> 
              <Route  path='/chat/:userId'  element= {
                <>
                  <SideBar />
                  <Chats />
                </>
              }/>        
            </Routes>
          </div>
        )}
      </div>

    </Router>
  );
}

export default App;
