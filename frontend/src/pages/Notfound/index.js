import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

import './style.css';

import notFound from '../../assets/404.png';

export default function NotFound(){

    return(
        <div className="notFound-container">
            <img src={notFound} alt="Not Found 404"/>

            <section className="informacao">
                <h1>Está perdido?</h1>

                <h2>A página que você procurava não existe.</h2>

                <Link className="voltar" to="/">
                    Me traga para a Terra
                </Link>
            </section>
        </div>
    );
}