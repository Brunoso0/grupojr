import React from 'react';
import styled from 'styled-components';

const ButtonCadastro = () => {
  return (
    <StyledWrapper>
      <button className="bt" id="bt">
        <span className="msg" id="msg" />
        Enviar
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .bt {
    border: none;
    user-select: none;
    font-size: 15px;
    color: white;
    text-align: center;
    background-color: #0873bd;
    box-shadow:rgba(24, 24, 24, 0.59) 2px 2px 10px 1px;
    border-radius: 12px;
    height: 50px;
    line-height: 50px;
    width: 155px;
    transition: all 0.2s ease;
    position: relative;
    cursor: pointer;
  }

  .msg {
    height: 0;
    width: 0;
    border-radius: 2px;
    position: absolute;
    left: 15%;
    top: 25%;
  }

  .bt:active {
    transition: all 0.001s ease;
    background-color: #5d9fcd;
    box-shadow:rgb(122, 122, 122) 0 0 0 0;
    transform: translateX(1px) translateY(1px);
  }

  .bt:hover .msg {
    animation: msgRun 2s linear forwards;
    animation-fill-mode: forwards;
  }

  


  @keyframes msgRun {
    0% {
      border-top: #d6d6d9 0 solid;
      border-bottom: #f2f2f5 0 solid;
      border-left: #f2f2f5 0 solid;
      border-right: #f2f2f5 0 solid;
    }

    20% {
      border-top: #d6d6d9 14px solid;
      border-bottom: #f2f2f5 14px solid;
      border-left: #f2f2f5 20px solid;
      border-right: #f2f2f5 20px solid;
    }

    25% {
      border-top: #d6d6d9 12px solid;
      border-bottom: #f2f2f5 12px solid;
      border-left: #f2f2f5 18px solid;
      border-right: #f2f2f5 18px solid;
    }

    80% {
      border-top: transparent 12px solid;
      border-bottom: transparent 12px solid;
      border-left: transparent 18px solid;
      border-right: transparent 18px solid;
    }

    100% {
      transform: translateX(150px);
      border-top: transparent 12px solid;
      border-bottom: transparent 12px solid;
      border-left: transparent 18px solid;
      border-right: transparent 18px solid;
    }
  }`;

export default ButtonCadastro;
