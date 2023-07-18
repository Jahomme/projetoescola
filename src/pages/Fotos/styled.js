import styled from 'styled-components';
import * as colors from '../../config/colors';

export const Title = styled.h1`
  text-align: center;
`;

export const Buttons = styled.div``;

export const Form = styled.form`
  label {
    width: 180px;
    height: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #eee;
    border: 5px dashed ${colors.primaryColor};
    margin: 30px auto;
    cursor: pointer;
    border-radius: 50%;
    overflow: hidden;

    img {
      width: 180px;
      height: 180px;
    }
  }

  input {
    display: none;
  }
`;

export const FotosContainer = styled.div`
  margin-top: 30px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: solid #eee 1px;
  justify-items: center;
  border-radius: 1%;

  .image {
    /* Estilização padrão da imagem */
    width: 150px;
    height: 150px;
    border-radius: 50%;
    border: 4px solid ${colors.primaryColor};
  }

  .image.selected {
    border-color: ${colors.primaryDarkColor}; /* Defina a cor desejada para a borda */
    filter: blur(3px);
  }

  button {
    width: 150px;
    height: 150px;
    cursor: pointer;
    border-radius: 50%;
    overflow: hidden;
    padding: 0;
  }

  .buttons-div {
    align-items: center;
    justify-content: center;
    display: flex;
    position: relative;
    top: -50%;
    left: 30%;
  }

  .button-click {
    width: 36px;
    height: 36px;
    align-items: center;
  }
`;
