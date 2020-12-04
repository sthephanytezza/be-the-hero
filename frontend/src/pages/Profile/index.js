import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiPower, FiTrash2 } from 'react-icons/fi';

import api from '../../services/api';

import './style.css';

import logo from '../../assets/logo.svg';
import Loader from '../../pages/Loader';

export default function Profile(){
    const history = useHistory();

    const [ loading, setLoading ] = useState(true);

    const [incidents, setIncidents] = useState([]);

    const ongName = localStorage.getItem('ongName');
    const ongId = localStorage.getItem('ongId');

    const [quantidade, setQuantidade] = useState(0);


    //Realiza alguma coisa assim que o componente é chamado
    useEffect(() => {
        api.get('profile', {
            headers: {
                Authorization: ongId,
            }
        }).then(response => {
            setIncidents(response.data);
            response.data && setLoading(false);
            setQuantidade(response.headers['x-total-count']);
        })
        
    }, [ongId]);

    async function handleDeleteIncident(id) {
        try {
            await api.delete(`incidents/${id}`, {
                headers: {
                    Authorization: ongId,
                }
            });

            setIncidents(incidents.filter(incident => incident.id != id));
        } catch (err) {
            alert('Erro ao deletar caso, tente novamente.');
        }
    }


    function handleLogout() {
        localStorage.clear();
        history.push('/');
    }

    return (
        <div className="profile-container">
            <header>
                <img src={logo} alt="Be The Hero" />
                <span>Bem vinda, {ongName}</span>
                <p>{quantidade}</p>

                <Link className="button" to="/incidents/new">Cadastrar novo caso</Link>
                <button onClick={handleLogout} type="button">
                    <FiPower size={18} color="E02041" />
                </button>
            </header>

            <h1>Casos cadastrados</h1>
            

            {loading ?  
                <Loader />
            : 
                <ul>
                    {incidents.map(incident => (
                        <li key={incident.id}>
                            <strong>Caso:</strong>
                            <p>{incident.title}</p>

                            <strong>Descrição:</strong>
                            <p>{incident.description}</p>

                            <strong>Valor:</strong>
                            <p>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL'}).format(incident.value)}</p>

                            <button onClick={() => handleDeleteIncident(incident.id)} type="button">
                                <FiTrash2 size={20} color="#a8a8b4" />
                            </button>
                        </li>
                    ))}
                </ul>
            }    
        
        </div>
    );
}