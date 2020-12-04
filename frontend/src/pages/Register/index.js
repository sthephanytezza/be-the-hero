
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { maskJs } from 'mask-js';

import api from '../../services/api';

import './style.css';

import logo from '../../assets/logo.svg';

const useYupValidationResolver = validationSchema =>
  useCallback(
    async data => {
      try {
        const values = await validationSchema.validate(data, {
          abortEarly: false
        });

        return {
          values,
          errors: {}
        };
      } catch (errors) {
        return {
          values: {},
          errors: errors.inner.reduce(
            (allErrors, currentError) => ({
              ...allErrors,
              [currentError.path]: {
                type: currentError.type ?? "validation",
                message: currentError.message
              }
            }),
            {}
          )
        };
      }
    },
    [validationSchema]
);

export default function Register(){
    const history = useHistory();
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [whatsapp, setWhatapp] = useState('');
    const [city, setCity] = useState('');
    const [uf, setUf] = useState('');

    const handlePhoneMask = value => {
        if (value.length < 15) {
          return maskJs('(99) 9999-9999', value.replace(/[^0-9]/g, ''));
        }
        return maskJs('(99) 9 9999-9999', value.replace(/[^0-9]/g, ''));
    };

    const validationSchema = useMemo(
        () =>
          yup.object({
            name: yup.string()
                .matches(/^([^0-9]*)$/g, 'O nome é inválido')
                .min(4, 'O nome é muito curto')
                .max(20, 'O nome é muito extenso')
                .required('Informe o nome'),
            email: yup.string()
                .email('Informe um e-mail válido')
                .required('Informe o e-email'),
            whatsapp: yup.string().
                required('Informe o telefone'),
            city: yup.string()
                .matches(/^([^0-9]*)$/g, 'A cidade é inválida')
                .min(4, 'O nome da cidade é muito curto')
                .max(30, 'O nome da cidade é muito extenso')
                .required('Informe a cidade'),
            uf: yup.string()
                .matches(/^([^0-9]*)$/g, 'O estado é inválido')
                .min(2, 'Informe um estado válido')
                .max(2, 'Informe um estado válido')
                .required('Informe um estado'),
          }),
        []
    );

    const resolver = useYupValidationResolver(validationSchema);
    const { handleSubmit, register, setValue, errors } = useForm({
        resolver,
        mode: 'onBlur'
    });

    useEffect(() => {
        register({ name: 'name' }, { required: true });
        register({ name: 'email' }, { required: true });
        register({ name: 'whatsapp' }, { required: true });
        register({ name: 'city' }, { required: true });
        register({ name: 'uf' }, { required: true });
    }, [register]); 

    async function handleRegister(e){
        //Tira o comportamento de reiniciar a página
        e.preventDefault();

        const data = {
            name, 
            email,
            whatsapp,
            city,
            uf
        }

        try{
            const response = await api.post('ongs', data);

            alert(`Seu ID de acesso: ${response.data.id}`);

            history.push({pathname:'/send-email', state:{id: response.data.id, name, email}});

        } catch(err){
            alert('Erro no cadastro, tente novamente!');
        }
    }

    return (
       <div className="register-container">
           <div className="content">
                <section>
                    <img src={logo} alt="Be The Hero"/>

                    <h1>Cadastro</h1>
                    <p>
                        Faça seu cadastro, entre na plataforma e ajude pessoas a encontrarem os casos da sua ONG.
                    </p>

                    <Link className="back-link" to="/">
                        <FiArrowLeft size={16} color="#E02041" />
                        Voltar para o logon
                    </Link>
                </section>

               <form onSubmit={(e) => {
                 handleSubmit();
                 handleRegister(e)
               }}>
                    <input 
                        placeholder="Nome da ONG" 
                        value={name} 
                        name="name"
                        onChange={e => setName(e.target.value)}
                        ref={register}
                        style={{borderColor: errors.name && "red" }}
                    />
                    {errors.name && <p className="error">{errors.name.message}</p>}

                    <input 
                        type="text" 
                        placeholder="E-mail" 
                        value={email} 
                        name="email"
                        onChange={e => setEmail(e.target.value)}
                        ref={register}
                        style={{borderColor: errors.email && "red" }}
                    />
                    {errors.email && <p className="error">{errors.email.message}</p>}

                    <input 
                        type="text" 
                        placeholder="WhasApp" 
                        value={whatsapp} 
                        name="whatsapp"
                        onChange={e => setWhatapp(handlePhoneMask(e.target.value))}
                        ref={register}
                        style={{borderColor: errors.whatsapp && "red" }}
                    />
                    {errors.whatsapp && <p className="error">{errors.whatsapp.message}</p>}

                    <div className="input-group">
                        <input 
                            placeholder="Cidade" 
                            value={city} 
                            name="city"
                            onChange={e => setCity(e.target.value)}
                            ref={register}
                            style={{borderColor: errors.city && "red" }}
                        />
                        {errors.city && <p className="error">{errors.city.message}</p>}

                        <input 
                            placeholder="UF" 
                            style={{ width: 80 }} 
                            value={uf} 
                            name="uf"
                            onChange={e => setUf(e.target.value)}
                            ref={register}
                            style={{borderColor: errors.uf && "red" }}
                        />
                        {errors.uf && <p className="error">{errors.uf.message}</p>}

                    </div>
                    
                    <button className="button" type="submit">Cadastrar</button>

                </form>
           </div>
       </div>
    );
}