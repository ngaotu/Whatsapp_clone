import React from 'react';
import { Button } from '@mui/material';
import './Login.css';
import db, {auth , provider} from '../../firebase'
import {signInWithPopup} from 'firebase/auth'
import { useStateValue } from '../StateProvider';
import { actionTypes } from '../reducer';
import { setDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
function Login() {
    const [{}, dispatch] = useStateValue();
    const navigate = useNavigate()
    const signIn = async () =>{
      try{
        const result = await signInWithPopup(auth, provider)
        const user = result.user

        await setDoc(doc(db,'users',user.uid), {
        email: user.email,
        photoURL: user.photoURL,
        fullName: user.displayName,
      })
        const userData = {
          uid: user.uid,
          email: user.email,
          photoURL: user.photoURL,
          fullName: user.displayName,
        }
        localStorage.setItem('user', JSON.stringify(userData))
        dispatch({
          type: actionTypes.SET_USER,
          user: userData,
        })
        // navigate('/')
      }
      catch(error){
        console.error(error);
      }
    }
  return (
    <div className='login'>
      <div className='login__container'>
        <div className='login__about'>
            <p className='login__about__title'>WhatsApp</p>
            <p className='login__about__content'>WhatsApp helps you connect and share with the people in your life.</p>
        </div>
        <div className='login__box'>
            <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1200px-WhatsApp.svg.png' className='login__image' alt='whatsapp logo'/>
                <div className='login__text'>
                    <h1>Sign in to WhatsApp</h1>
                </div>
                <Button variant="contained" color="primary" fullWidth className='login__button' onClick={signIn}>
                Sign in with Google
                </Button>

        </div>
      </div>
    </div>
  );
}

export default Login;
