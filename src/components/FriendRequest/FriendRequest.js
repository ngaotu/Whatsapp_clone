import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Avatar } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const FriendRequests = ({ open, onClose, requests, onAccept, onReject }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Friend Requests</DialogTitle>
      <DialogContent>
        <List>
          {requests.map((request) => (
            <ListItem key={request.id} alignItems="flex-start">
              <ListItemText 
                primary={request.senderEmail} 
                secondary="Yêu cầu kết bạn"
                style={{ marginLeft: 16 }} // Để tạo khoảng cách giữa avatar và text
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="accept" onClick={() => onAccept(request)}>
                  <CheckIcon />
                </IconButton>
                <IconButton edge="end" aria-label="reject" onClick={() => onReject(request)}>
                  <CloseIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FriendRequests;
