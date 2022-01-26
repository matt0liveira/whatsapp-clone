import React, { useState, useEffect, useRef } from 'react'
import './ChatWindow.css'
import EmojiPicker from 'emoji-picker-react' 
import SearchIcon from '@material-ui/icons/Search'
import AttachFileIcon from '@material-ui/icons/AttachFile';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import CloseIcon from '@material-ui/icons/Close';
import SendIcon from '@material-ui/icons/Send';
import MicIcon from '@material-ui/icons/Mic';
import MessageItem from '../MessageItem/MessageItem';
import Api from '../../Api';

export default ({user, data}) => {
    let recognition = null
    let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if(SpeechRecognition !== undefined) {
        recognition = new SpeechRecognition()
    }

    const body = useRef()
    const [emojiOpen, setEmojiOpen] = useState(false)
    const [text, setText] = useState('')
    const [listening, setListening] = useState(false)
    const [list, setList] = useState([])
    const [users, setUsers] = useState([])

    useEffect(() => {
        setList([])
        let unsub = Api.onChatContent(data.chatId, setList)
        return unsub
    }, [data.chatId])

    useEffect(() => {
        if(body.current.scrollHeight > body.current.offsetHeight) {
            body.current.scrollTop = body.current.scrollHeight - body.current.offsetHeight
        }
    }, [list])

    function handleEmojiClick(e, emojiObject) {
        setText(text + emojiObject.emoji)
    }

    function handleOpenEmoji() {
        setEmojiOpen(true)
    }

    function handleCloseEmoji() {
        setEmojiOpen(false)
    }

    function handleSendClick() {
        if(text !== '') {
            Api.sendMessage(data, user.id, 'text', text, users)
            setText('')
            setEmojiOpen(false)
        }
    }

    function handleMicClick() {
        if(recognition !== null) {
            recognition.onstart = () => {
                setListening(true)
            }
            recognition.onend = () => {
                setListening(false)
            }
            recognition.onresult = (e) => {
                setText(e.results[0][0].transcript)
            }
            recognition.start()
        }
    }

    const handleInputKeyUp = (e) => {
        if(e.keyCode === 13) {
            handleSendClick()
        }
    }

    return (
        <div className="chatWindow">
            <div className="chatWindow-header">
                <div className="chatWindow-headerInfo">
                    <img src={data.image} alt="" className="chatWindow-avatar" />
                    <div className="chatWindow-name">{data.title}</div>
                </div>

                <div className="chatWindow-headerButtons">
                    <div className="chatWindow-btn">
                        <SearchIcon style={{ color: '#919191' }} />
                    </div>

                    <div className="chatWindow-btn">
                        <AttachFileIcon style={{ color: '#919191' }} />
                    </div>

                    <div className="chatWindow-btn">
                        <MoreVertIcon style={{ color: '#919191' }} />
                    </div>
                </div>
            </div>

            <div ref={body} className="chatWindow-body">
                {list.map((item, key) => (
                    <MessageItem key={ key } data={ item } user={ user } />
                ))}
            </div>

            <div className="chatWindow-emojiArea" style={{height: emojiOpen ? '200px' : '0px'}}>
                <EmojiPicker disableSearchBar onEmojiClick={handleEmojiClick} />
            </div>

            <div className="chatWindow-footer">
                <div className="chatWindow-pre">
                    <div className="chatWindow-btn" style={{width: emojiOpen ? '40px' : '0px'}}>
                        <CloseIcon style={{ color: '#919191' }} onClick={handleCloseEmoji} />
                    </div>

                    <div className="chatWindow-btn">
                    <InsertEmoticonIcon style={{ color: emojiOpen ? '#009688' : '#919191' }} onClick={handleOpenEmoji} />
                    </div>                    
                </div>
                
                <div className="chatWindow-inputArea">
                    <input type="text" className="chatWindow-input" placeholder="Digite uma mensagem" value={ text } onChange={e => setText(e.target.value)} onKeyUp={handleInputKeyUp} />
                </div>

                <div className="chatWindow-pos">
                    {text === '' && 
                        <div className="chatWindow-btn">
                            <MicIcon onClick={handleMicClick} style={{ color: listening ? '#126ece' : '#919191' }} />
                        </div>
                    }

                    {text !== '' &&
                        <div className="chatWindow-btn">
                            <SendIcon onClick={handleSendClick} style={{ color: '#919191' }} />
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}