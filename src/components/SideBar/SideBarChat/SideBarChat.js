import React from 'react'
import { Avatar } from '@mui/material'
import { useEffect, useState } from 'react'
import axios from 'axios'
import './SideBarChat.css'
import { Link } from 'react-router-dom'
function SideBarChat({friends, handleSearch}) {
        console.log(friends,'hello')
  return (
    <div className='sidebar__chat__list'>
     {handleSearch.length > 0 ? (
        handleSearch.map((friend) =>(
            <Link to = {`/chat/${friend.id}`} style={{textDecoration:'none', color:'black'}} key={friend.id}>
                <div className='sidebar__chat' >
                    <Avatar src={friend.photoURL || ''}/>
                    <div className='sidebar__chat__content'>
                        <h3>{friend.fullName}</h3>   
                        <p>Messages....</p>
                    </div>
                </div>
            
            </Link>
        
        ))
     ) : (
         friends.map((friend) => (
             <Link to = {`/chat/${friend.id}`} style={{textDecoration:'none', color:'black'}} key={friend.id}>
                 <div className='sidebar__chat' >
                     <Avatar src={friend.photoURL || ''}/>
                     <div className='sidebar__chat__content'>
                         <h3>{friend.fullName}</h3>   
                         <p>Messages....</p>
                     </div>
                 </div>
             
             </Link>
         ))
     )}   
    </div>
  )
}

export default SideBarChat