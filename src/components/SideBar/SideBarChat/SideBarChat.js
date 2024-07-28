import React from 'react'
import { Avatar } from '@mui/material'
import { useEffect, useState } from 'react'
import axios from 'axios'
import './SideBarChat.css'
import { Link } from 'react-router-dom'
function SideBarChat({friends}) {
        console.log(friends,'hello')
  return (
    <div className='sidebar__chat__list'>
        {friends.map((user) => (
            <Link to = {`/chat/${user.id}`} style={{textDecoration:'none', color:'black'}} key={user.id}>
                <div className='sidebar__chat' >
                    <Avatar src={user.photoURL || ''}/>
                    <div className='sidebar__chat__content'>
                        <h3>{user.fullName}</h3>   
                        <p>Messages....</p>
                    </div>
                </div>
            
            </Link>
        ))}
    </div>
  )
}

export default SideBarChat