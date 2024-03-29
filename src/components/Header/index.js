import React from 'react';
import {
  FaHome,
  FaSignInAlt,
  FaUserAlt,
  FaCircle,
  FaPowerOff,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { Nav } from './styled';
import * as actions from '../../store/modules/auth/actions';
import history from '../../services/history';

export default function Header() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(actions.loginFailure());
    history.push('/');
  };

  return (
    <Nav>
      <Link title="Página Inicial" to="/">
        {' '}
        <FaHome size={24} />{' '}
      </Link>
      <Link title="Registrar Nova Conta/Editar Conta" to="/register">
        {' '}
        <FaUserAlt size={20} />{' '}
      </Link>

      {isLoggedIn ? (
        <Link title="Deslogar" onClick={handleLogout} to="/logout">
          {' '}
          <FaPowerOff size={24} />{' '}
        </Link>
      ) : (
        <Link title="Logar" to="/login">
          {' '}
          <FaSignInAlt size={24} />{' '}
        </Link>
      )}

      {isLoggedIn && <FaCircle size={20} color="#66ff33" />}
    </Nav>
  );
}
