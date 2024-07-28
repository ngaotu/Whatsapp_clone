import React, { useState, useEffect } from 'react';
import { IconButton, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, List, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import SideBarChat from './SideBarChat/SideBarChat';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import FriendRequestsIcon from '@mui/icons-material/GroupAdd';
import './SideBar.css';
import db from '../../firebase';
import { collection, getDocs, addDoc, onSnapshot, query, where, updateDoc, doc } from 'firebase/firestore';
import { useStateValue } from '../StateProvider';
import { actionTypes } from '../reducer';
import { useNavigate } from 'react-router-dom';
import FriendRequests from '../FriendRequest/FriendRequest';

function SideBar() {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [openFriendRequestsDialog, setOpenFriendRequestsDialog] = useState(false);
  const [email, setEmail] = useState('');
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [error, setError] = useState('');
  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    if (user) {
      const fetchFriends = async () => {
        const q = query(collection(db, 'friends'), where('userEmail', '==', user.email));
        const querySnapshot = await getDocs(q);
        const friendEmails = querySnapshot.docs.map(doc => doc.data().friendEmail);

        if (friendEmails.length > 0) {
          const usersQuery = query(collection(db, 'users'), where('email', 'in', friendEmails));
          const usersSnapshot = await getDocs(usersQuery);
          const friendsList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setFriends(friendsList);
        }
      };

      const fetchFriendRequests = async () => {
        const q = query(collection(db, 'friend_requests'), where('receiverEmail', '==', user.email), where('status', '==', 'pending'));
        const querySnapshot = await getDocs(q);
        const requestsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFriendRequests(requestsList);
      };

      fetchFriends();
      fetchFriendRequests();
    }
  }, [user]);

  const handleAddPersonClick = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEmail('');
    setError('');
  };

  const handleLogoutClick = () => {
    setOpenLogoutDialog(true);
  };

  const handleCloseLogoutDialog = () => {
    setOpenLogoutDialog(false);
  };

  const handleFriendRequestsClick = () => {
    setOpenFriendRequestsDialog(true);
  };

  const handleCloseFriendRequestsDialog = () => {
    setOpenFriendRequestsDialog(false);
  };

  const handleAddPerson = async () => {
    if (email) {
      const checkEmailExist = friends.some(friend => friend.email === email);
      if (checkEmailExist) {
        setError('Already friends');
        return;
      }

      const usersQuery = query(collection(db, 'users'), where('email', '==', email));
      const usersSnapshot = await getDocs(usersQuery);
      if (usersSnapshot.empty) {
        setError('Email does not exist');
        return;
      }

      const receiverEmail = usersSnapshot.docs[0].data().email;
      const q = query(collection(db, 'friend_requests'), where('senderEmail', '==', user.email), where('receiverEmail', '==', receiverEmail));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setError('Friend request already sent');
        return;
      }

      try {
        await addDoc(collection(db, 'friend_requests'), { senderEmail: user.email, receiverEmail, status: 'pending' });
        setError('');
      } catch (error) {
        console.error('Error adding friend request: ', error);
      }
      handleCloseDialog();
    }
  };
//  xử lý với friend request
  const handleAcceptRequest = async (request) => {
    try {
      await addDoc(collection(db, 'friends'), { userEmail: user.email, friendEmail: request.senderEmail });
      await addDoc(collection(db, 'friends'), { userEmail: request.senderEmail, friendEmail: user.email });
      const requestDoc = doc(db, 'friend_requests', request.id);
      await updateDoc(requestDoc, { status: 'accepted' });
      setFriendRequests(friendRequests.filter(req => req.id !== request.id));
      setFriends([...friends, { email: request.senderEmail }]);
    } catch (error) {
      console.error('Error accepting friend request: ', error);
    }
  };
  const handleRejectRequest = async (request) => {
    try {
      const requestDoc = doc(db, 'friend_requests', request.id);
      await updateDoc(requestDoc, { status: 'rejected' });
      setFriendRequests(friendRequests.filter(req => req.id !== request.id));
    } catch (error) {
      console.error('Error rejecting friend request: ', error);
    }
  };
  

  const handleLogout = () => {
    localStorage.removeItem('user');
    dispatch({
      type: actionTypes.LOGOUT,
    });
    navigate('/');
  };

  return (
    <div className='sidebar'>
      <div className='sidebar__header'>
        <Avatar src={user ? user.photoURL : ''} />
        <div className='sidebar__header__icons'>
          <IconButton>
            <ChatIcon className='sidebar__header__icon' />
          </IconButton>
          <IconButton>
            <RefreshIcon className='sidebar__header__icon' />
          </IconButton>
          <IconButton onClick={handleAddPersonClick}>
            <PersonAddIcon className='sidebar__header__icon' />
          </IconButton>
          <IconButton onClick={handleLogoutClick}>
            <LogoutIcon className='sidebar__header__icon' />
          </IconButton>
          <IconButton onClick={handleFriendRequestsClick}>
            <FriendRequestsIcon className='sidebar__header__icon' />
          </IconButton>
        </div>
      </div>
      <div className='sidebar__search'>
        <IconButton>
          <SearchIcon />
        </IconButton>
        <input type='text' placeholder='Search or start new chat' />
      </div>
      <div className='sidebar__chats'>
        <SideBarChat friends={friends} />
      </div>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        {error && <div style={{ color: 'red', padding: '10px' }}>{error}</div>}
        <DialogTitle>Add New Contact</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            name='email'
            label='Email'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleAddPerson}>Add</Button>
        </DialogActions>
      </Dialog>
      
      <Dialog open={openLogoutDialog} onClose={handleCloseLogoutDialog}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          Are you sure you want to logout?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLogoutDialog}>Cancel</Button>
          <Button onClick={handleLogout}>Logout</Button>
        </DialogActions>
      </Dialog>

      <FriendRequests
        open={openFriendRequestsDialog}
        onClose={handleCloseFriendRequestsDialog}
        requests={friendRequests}
        onAccept={handleAcceptRequest}
        onReject={handleRejectRequest}
      />
    </div>
  );
}

export default SideBar;
