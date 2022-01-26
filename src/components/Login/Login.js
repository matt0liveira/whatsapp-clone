import React from 'react'
import './Login.css'
import FacebookIcon from '@material-ui/icons/Facebook'
import Api from '../../Api'

export default ({onReceive}) => {
    const handleFaceLogin = async () => {
        let result = await Api.fbPopup()
        if(result) {    
            onReceive(result.user)
        } else {
            alert('Erro!')
        }
    }
    
    return (
        <div className="login">
            <button onClick={handleFaceLogin}>
                <FacebookIcon />
                Entrar com o Facebook
                </button>
        </div>
    )
}