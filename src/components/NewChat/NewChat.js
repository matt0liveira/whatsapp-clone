import React, { useState, useEffect } from 'react'
import './NewChat.css'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Api from '../../Api'

export default ({ user, chatList, show, setShow }) => {
    const [list, setList] = useState([])

    useEffect(() => {
        const getList = async () => {
            if(user !== null) {
                let results = await Api.getContactList(user.id)
                setList(results)
            }
        }
        getList()
    },[user])

    function handleClose() {
        setShow(false)
    }

    const addNewChat = async (user2) => {
        await Api.addNewChat(user, user2)
        handleClose()
    }
    
    return (
        <div className="newChat" style={{ left: show ? 0 : -415  }}>
            <div className="newChat-head">
                <div className="newChat-backButton">
                    <ArrowBackIcon style={{ color: '#fff' }} onClick={handleClose} />
                </div>
                <div className="newChat-headTitle">Nova conversa</div>
            </div>
            <div className="newChat-list">
                {list.map((item, key) => (
                    <div onClick={() => addNewChat(item)} className="newChat-item" key={key}>
                        <img src={item.avatar} alt="" className="newChat-itemAvatar" />
                        <div className="newChat-itemName">{ item.name }</div>
                    </div>
                ))}
            </div>
        </div>
    )
}