import React from 'react'
import './ChatIntro.css'

export default () => {
    return (
        <div className="chatIntro">
            <img src={ require("../../img/whats-intro.jpg") } alt="" />
            <h1>Mantenha seu celular conectado</h1>
            <h2>
                Faça chamadas e envie mensagens sem precisar conectar seu celular à internet. <br /> Use o WhatsApp em até quatro aparelhos ao mesmo tempo.
            </h2>
        </div>
    )   
}