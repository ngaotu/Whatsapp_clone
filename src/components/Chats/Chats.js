import React, { useState, useEffect } from 'react';
import { Avatar, IconButton } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import { useParams } from 'react-router-dom';
import { doc, getDoc, Timestamp, addDoc, collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import db from '../../firebase';
import { useStateValue } from '../StateProvider';
import EmojiPicker from 'emoji-picker-react';
import './Chats.css';

function Chats() {
  const [openEmoji, setOpenEmoji] = useState(false);
  const { userId } = useParams(); // receiver userId
  const [input, setInput] = useState('');
  const [receiverUser, setReceiverUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [{ user }] = useStateValue();
  const chatId = user.uid < userId ? `${user.uid}_${userId}` : `${userId}_${user.uid}`;

  useEffect(() => {
    const fetchUser = async () => {
      if (userId) {
        try {
          const userDoc = await getDoc(doc(db, 'users', userId));
          if (userDoc.exists()) {
            setReceiverUser({ receiverUserId: userId, ...userDoc.data() });
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

  useEffect(() => {
    if (user && receiverUser) {
      const q = query(
        collection(db, `chats/${chatId}/messages`),
        orderBy('timeStamp', 'asc') 
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setMessages(messages);
        
      });

      return () => unsubscribe();
    }
  }, [user, receiverUser, chatId]);

  const handleSubmitMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    const payload = {
      text: input,
      senderEmail: user.email,
      receiverEmail: receiverUser.email,
      timeStamp: Timestamp.now(),
    };

    try {
      await addDoc(collection(db, `chats/${chatId}/messages`), payload);
    } catch (error) {
      console.error('Error sending message: ', error);
    }
    setInput('');
  };

  return (
    <div className='chats'>
      <div className='chats__header'>
        <div className='chats__header__left'>
          <Avatar src={receiverUser?.photoURL} />
          <div className='chats__header__info'>
            <h2>{receiverUser?.fullName}</h2>
          </div>
        </div>
        <div className='chats__header__icons'>
          <IconButton>
            <AttachFileIcon className='chats__header__icon' />
          </IconButton>
        </div>
      </div>
      <div className='chats__body'>
        {messages.map((message) => (
          <p
            key={message.id}
            className={`chats__message ${message.senderEmail === user.email && "chats__receive"}`}>
            {message.text}
            <span className="chats__timestamp">{new Date(message.timeStamp?.toDate()).toLocaleString()}</span>
          </p>
        ))}
      </div>
      {openEmoji && (
        <div className='emoji-picker'>
          <EmojiPicker onEmojiClick={(emoji) => setInput(input + emoji.emoji)} />
        </div>
      )}
      <div className='chats__footer'>
        <IconButton>
          <InsertEmoticonIcon onClick={() => setOpenEmoji(!openEmoji)} />
        </IconButton>
        <form onSubmit={handleSubmitMessage}>
          <input
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder='Type a message'
          />
          <button type="submit">Send message</button>
        </form>
        <IconButton>
          <KeyboardVoiceIcon />
        </IconButton>
      </div>
    </div>
  );
}

export default Chats;
