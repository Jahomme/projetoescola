import React from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { FaTrash } from 'react-icons/fa';
import Loading from '../../components/Loading';

import { Container } from '../../styles/GlobalStyles';
import { Title, Form, FotosContainer, Buttons } from './styled';
import axios from '../../services/axios';
import history from '../../services/history';
import * as actions from '../../store/modules/auth/actions';

export default function Fotos({ match }) {
  const dispatch = useDispatch();

  const id = get(match, 'params.id', '');
  const [isLoading, setIsLoading] = React.useState(false);
  const [foto, setFoto] = React.useState('');
  const [fotos, setFotos] = React.useState([]);
  const [selectedFotoId, setSelectedFotoId] = React.useState(null);

  React.useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);

        const { data } = await axios.get(`/alunos/${id}`);

        setFoto(get(data, 'Fotos[0].url', ''));

        const response = await axios.get(`/fotos/${id}`);
        setFotos(response.data);

        setIsLoading(false);
      } catch {
        toast.error('Erro ao obter imagem.');
        setIsLoading(false);
        history.push('/');
      }
    };

    getData();
  }, [id]);

  const handleChange = async (e) => {
    const file = e.target.files[0];
    const fotoURL = URL.createObjectURL(file);

    setFoto(fotoURL);

    const formData = new FormData();
    formData.append('aluno_id', id);
    formData.append('foto', file);

    try {
      setIsLoading(true);

      await axios.post('/fotos/', formData, {
        'Content-Type': 'multipart/form-data',
      });

      const response = await axios.get(`/fotos/${id}`);
      setFotos(response.data);

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);

      const { status } = get(err, 'response', '');
      toast.error('Erro ao enviar foto.');

      if (status === 401) dispatch(actions.loginFailure());
    }
  };

  // const handleReset = () => {};

  const handleClick = (e, fotoId) => {
    setSelectedFotoId(fotoId);
    const { target } = e;
    const parentDiv = target.closest('div');
    const images = parentDiv.parentNode.querySelectorAll('.image');

    // Remover a classe 'selected' de todas as imagens
    images.forEach((image) => {
      image.classList.remove('selected');
    });
    const image = parentDiv.querySelector('img');
    image.classList.add('selected');
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/fotos/${id}/foto/${selectedFotoId}`);

      const response = await axios.get(`/fotos/${id}`);
      setFotos(response.data);

      setIsLoading(false);
      toast.success('Foto Excluída com sucesso');
    } catch (err) {
      setIsLoading(false);

      toast.error('Erro ao excluir a foto');
    }
  };

  return (
    <Container>
      <Loading isLoading={isLoading} />
      <Title>Escolha uma nova foto principal</Title>

      <Form>
        <label title="Escolha Uma Nova Foto Principal" htmlFor="foto">
          {foto ? <img src={foto} alt="Foto" crossOrigin="" /> : 'Selecionar'}
          <input type="file" id="foto" onChange={handleChange} />
        </label>
      </Form>

      <Buttons>
        <h2>Selecione uma foto para apagar</h2>
      </Buttons>
      <FotosContainer>
        {fotos.map((fotoFromArray, index) => (
          <div key={fotoFromArray.id}>
            <button
              type="submit"
              onClick={(e) => handleClick(e, fotoFromArray.id)}
            >
              <img
                crossOrigin=""
                title="Clique Para Excluir a Imagem"
                src={fotoFromArray.url}
                alt={`Foto ${index}`}
                className="image"
              />
            </button>

            {selectedFotoId === fotoFromArray.id && (
              <div className="buttons-div">
                <button
                  title="Clique Novamente Para Confirmar Exclusão"
                  className="button-delete"
                  type="submit"
                  onClick={handleDelete}
                >
                  <FaTrash />
                </button>
              </div>
            )}
          </div>
        ))}
      </FotosContainer>
    </Container>
  );
}

Fotos.propTypes = {
  match: PropTypes.shape({}).isRequired,
};
