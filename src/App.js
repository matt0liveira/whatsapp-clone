import React, { useState, useEffect } from 'react'
import './App.css'
import DonutLargeIcon from '@material-ui/icons/DonutLarge'
import ChatIcon from '@material-ui/icons/Chat'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import SearchIcon from '@material-ui/icons/Search';
import ChatListItem from './components/ChatListItem/ChatListItem'
import ChatIntro from './components/ChatIntro/ChatIntro'
import ChatWindow from './components/ChatWindow/ChatWindow'
import NewChat from './components/NewChat/NewChat'
import Login from './components/Login/Login'
import Api from './Api'

export default () => {
	const [chatList, setChatList] = useState([])
	const [activeChat, setActiveChat] = useState({})
	const [user, setUser] = useState(null)
	const [showNewChat, setShowNewChat] = useState(false)

	useEffect(() => {
		if(user !== null) {
			let unsub = Api.onChatList(user.id, setChatList)
			return unsub
		}
	},[user])

	function handleNewChat() {
		setShowNewChat(true)
	}

	const handleLoginData = async (u) => {
		let newUser = {
			id: u.id,
			name: u.displayName,
			avatar: u.photoURL
		}

		await Api.addUser(newUser)
		setUser(newUser)
	}

	if(user === null) {
		return (<Login onReceive={handleLoginData} />)
	}

	return (
		<div className="app-window">
			<div className="sidebar">
				<NewChat show={showNewChat} setShow={setShowNewChat} user={user} chatList={chatList} />
				<header>
					<img src={user.avatar} alt="" className="header-avatar" />

					<div className="header-buttons">
						<div className="header-btn">
							<DonutLargeIcon style={{ color: '#919191' }} />
						</div>

						<div className="header-btn">
							<ChatIcon style={{ color: '#919191' }} onClick={handleNewChat} />
						</div>

						<div className="header-btn">
							<MoreVertIcon style={{ color: '#919191' }} />
						</div>
					</div>
				</header>

				<div className="search">
					<div className="search-input">
						<SearchIcon fontSize="small" style={{ color: '#919191' }} />
						<input type="search" placeholder="Procurar ou começar uma nova conversa" />
					</div>
				</div>

				<div className="chatList">
					{chatList.map((item, key) => (
						<ChatListItem key={ key } data={ item } active={ activeChat.chatId === chatList[key].chatId } onClick={() => setActiveChat(chatList[key])} />
					))}
				</div>
			</div>

			<div className="content-area">
				{activeChat.chatId !== undefined &&
					<ChatWindow user={ user } data={activeChat} />
				}

				{activeChat.chatId === undefined && 
					<ChatIntro />
				}
			</div>
		</div>
	)
}