
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi'

import { useForm } from "react-hook-form";
import * as yup from 'yup';

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

export default function NewIncident() {
    const history = useHistory();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [value, setValue] = useState('');

    const validationSchema = useMemo(
        () =>
          yup.object({
            title: yup.string()
                .matches(/^([^0-9]*)$/g, 'O título é inválido')
                .min(4, 'O título é muito curto')
                .max(20, 'O título é muito extenso')
                .required('Informe o título'),
            description: yup.string()
                .required('Informe a descrição'),
            value: yup.string().
                required('Informe o valor'),
          }),
        []
    );

    const resolver = useYupValidationResolver(validationSchema);
    const { handleSubmit, register, errors } = useForm({
        resolver,
        mode: 'onBlur'
    });

    useEffect(() => {
        register({ name: 'title' }, { required: true });
        register({ name: 'description' }, { required: true });
        register({ name: 'value' }, { required: true });
    }, [register]); 

    const ongId = localStorage.getItem('ongId');

    async function handleNewIncident(e) {
       e.preventDefault();

        const data = {
            title, 
            description,
            value,
        };

        try{
           
            await api.post('incidents', data, {
                headers: {
                    Authorization: ongId
                }
            })

            history.push('/profile');

        } catch (err) {
            alert('Erro ao cadastrar caso, tente novamente.');
        }
    }

    return (
        <div className="new-incident-container">
           <div className="content">
                <section>
                    <img src={logo} alt="Be The Hero"/>

                    <h1>Cadastrar novo caso</h1>
                    <p>
                       Descreva o caso detalhadamente para encontrar um herói para resolver isso.
                    </p>

                    <Link className="back-link" to="/profile">
                        <FiArrowLeft size={16} color="#E02041" />
                        Voltar para o home
                    </Link>
                </section>

                <form onSubmit={(e) => {
                 handleSubmit();
                 handleNewIncident(e)
               }}>
                    <input 
                        placeholder="Título do caso" 
                        value={title}
                        name="title"
                        onChange={e => setTitle(e.target.value)}
                        ref={register}
                        style={{borderColor: errors.title && "red" }}
                    />
                    {errors.title && <p className="error">{errors.title.message}</p>}

                    <textarea 
                        placeholder="Descrição" 
                        value={description}
                        name="description"
                        onChange={e => setDescription(e.target.value)}
                        ref={register}
                        style={{borderColor: errors.description && "red" }}
                    />
                    {errors.description && <p className="error">{errors.description.message}</p>}

                    <input 
                        placeholder="Valor em reais"
                        value={value}
                        name="value"
                        onChange={e => setValue(e.target.value)}
                        ref={register}
                        style={{borderColor: errors.value && "red" }}
                    />
                    {errors.value && <p className="error">{errors.value.message}</p>}

                    <button className="button" type="submit">Cadastrar</button>

                </form>
           </div>
        </div>
    );
}