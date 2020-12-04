import React from 'react';
import { FiLoader } from 'react-icons/fi';

import './style.css';

export default function Loader(){
    return (
        <button type="button" className="button">
            <div className="icone">
                <FiLoader size={20} color="#a8a8b4" />
            </div>
        </button>
    );
}
