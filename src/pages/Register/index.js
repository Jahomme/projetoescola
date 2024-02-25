import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { isEmail } from 'validator';
import { useSelector, useDispatch } from 'react-redux';
import { FaTrash, FaExclamation } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { get } from 'lodash';

import { Container } from '../../styles/GlobalStyles';
import { Form, Title } from './styled';
import Loading from '../../components/Loading';
import * as actions from '../../store/modules/auth/actions';
import axios from '../../services/axios';
import history from '../../services/history';

export default function Register() {
  const dispatch = useDispatch();

  const id = useSelector((state) => state.auth.user.id);
  const nomeStored = useSelector((state) => state.auth.user.nome);
  const emailStored = useSelector((state) => state.auth.user.email);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (!id) return;

    setNome(nomeStored);
    setEmail(emailStored);
  }, [emailStored, id, nomeStored]);

  async function handleSubmit(e) {
    e.preventDefault();
    let formErrors = false;

    if (nome.length < 3 || nome.length > 255) {
      // eslint-disable-next-line
      formErrors = true;
      toast.error('O campo nome precisa conter entre 3 e 255 caracteres');
    }

    if (!isEmail(email)) {
      // eslint-disable-next-line
      formErrors = true;
      toast.error('Email inválido');
    }

    if (!id && (password.length < 6 || password.length > 50)) {
      // eslint-disable-next-line
      formErrors = true;
      toast.error('O campo senha precisa conter entre 6 e 50 caracteres');
    }

    if (formErrors);

    dispatch(actions.registerRequest({ nome, email, password, id }));
  }

  const handleDeleteAsk = (e) => {
    e.preventDefault();
    const exclamation = e.currentTarget.nextSibling;
    exclamation.setAttribute('display', 'block');
    e.currentTarget.remove();
  };

  const handleDelete = async (e) => {
    e.persist();

    try {
      setIsLoading(true);
      await axios.delete(`/users/`);
      dispatch(actions.loginFailure());
      setIsLoading(false);

      toast.success('Sua conta foi excluída com sucesso');
      history.push('/');
    } catch (err) {
      const status = get(err, 'response.status', 0);

      if (status === 401) {
        toast.error('Você precisa fazer login');
      } else {
        toast.error(
          'Ocorreu um erro ao excluir sua conta. Por favor, tente novamente mais tarde.'
        );
      }

      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Loading isLoading={isLoading} />

      <Title>
        <h1>{id ? 'Editar Dados' : 'Crie Sua Conta'}</h1>
        <div>
          <Link
            title="Excluir Usuário"
            onClick={handleDeleteAsk}
            to="/users/delete"
          >
            <h2> {id && <FaTrash size="18" cursor="pointer" />} </h2>
          </Link>
          <FaExclamation
            title="Confirmar Exclusão"
            display="none"
            cursor="pointer"
            size={18}
            onClick={(e) => handleDelete(e)}
          />
        </div>
      </Title>

      <Form onSubmit={(e) => handleSubmit(e)}>
        <label htmlFor="nome">
          Nome:
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Seu nome"
          />
        </label>
        <label htmlFor="email">
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu email"
          />
        </label>

        <label htmlFor="password">
          Senha:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Sua senha"
          />
        </label>

        <button type="submit">{id ? 'Salvar' : 'Criar minha conta'}</button>
      </Form>
    </Container>
  );
}
