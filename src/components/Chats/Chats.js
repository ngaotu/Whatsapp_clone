import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { Avatar } from '@mui/material'
import { IconButton } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SettingsIcon from '@mui/icons-material/Settings'
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import db  from '../../firebase';
import './Chats.css'
function Chats() {
    const {userId} = useParams()
    const [input, setInput] = useState('')
    const [user, setUser] = useState('')
    useEffect(() => {
        const fetchUser = async () => {
          if (userId) {
            try {
              const userDoc = await getDoc(doc(db, 'users', userId));
              if (userDoc.exists()) {
                setUser(userDoc.data());
              } else {
                console.log('No such document!');
              }
            } catch (error) {
              console.error('Error fetching user: ', error);
            } 
          }
        };
    
        fetchUser();
      }, [userId]);
    const handleSubmitMessage = (e) =>{
        e.preventDefault()
        setInput('')
    }
  return (
    <div className='chats'>
        <div className='chats__header'>
            <div className='chats__header__left'>
                <Avatar src={user.photoURL}/>
                <div className='chats__header__info'>
                    <h2>{user.fullName}</h2>
                    <p>Last seen at...</p>
                </div>
            </div>
            <div className='chats__header__icons'>
          <IconButton>
            <SearchIcon className='chats__header__icon' />
          </IconButton>
          <IconButton>
            <AttachFileIcon className='chats__header__icon' />
          </IconButton>
          <IconButton>
            <SettingsIcon className='chats__header__icon' />
          </IconButton>
        </div>
        </div>
        <div className='chats__body'>
            {/* check if message is sent by me => */}
            <p className={`chats__message  ${true && "chats__receive"}`}>
            <span className= "chats__name">User</span>
            Message
            <span className= "chats__timestamp">4:45PM</span>
            </p>
        </div>
        <div className='chats__footer'>
            <IconButton>
                <InsertEmoticonIcon />
            </IconButton>
            <form>
                <input autoFocus  value={input} onChange={e => setInput(e.target.value)} type="text" placeholder='Type a message' />
                <button  onClick= {handleSubmitMessage} type="submit">Send message</button>
            </form>
            <IconButton>
                <KeyboardVoiceIcon/>
            </IconButton>
        </div>
        
    </div>
  )
}

export default Chats