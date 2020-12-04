import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiLogIn } from 'react-icons/fi';

import api from '../../services/api';

import './style.css';

import logo from '../../assets/logo.svg';

export default function Email(props){

    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        setId(props.location.state.id);
        setName(props.location.state.name);
        setEmail(props.location.state.email);

    }, []);

    async function handleSubmit(e){
        e.preventDefault();
        try{
            const response = api.post('send-email', {id, name, email});
            alert('Email enviado com sucesso!');

        } catch (error) {
            const message = `${error.response.status} - ${error.response.data.message}`;
            alert(message);
        }
    }

    return(
        <div className="email-container">
            <div className="container">
                <img src={logo} alt="Be The Hero"/>
                <section className="form">
                    <h1><b>{name}</b> cadastrada com sucesso!</h1>
                    <h2>Para acessar a plataforma Be The Hero, será preciso um ID de Login. O seu está logo abaixo:</h2>

                    <form onSubmit={handleSubmit}>
                        <input 
                            placeholder="Sua ID"
                            value={id}
                            disabled
                        />
                        <button className="button" type="submit"> Mandar para seu email </button>
                    </form>
                </section>
            </div>
        </div>
    );
}