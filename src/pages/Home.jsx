import React, { useState, useEffect } from 'react';
import '../styles/Home.css';
import api, { API_BASE_URL } from '../services/api';
import InputMask from 'react-input-mask';
import ButtonCadastro from '../components/buttonCadastro';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Home = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    vaga_id: '',
  });

  const [vagas, setVagas] = useState([]);
  const [curriculo, setCurriculo] = useState(null);
  const [showModal, setShowModal] = useState(false); // Controle do Modal
  const [foto, setFoto] = useState(null);
  const [aceitouPrivacidade, setAceitouPrivacidade] = useState(false);

  useEffect(() => {
    api.get(`${API_BASE_URL}/api/jrnet/vagas`)
      .then(response => setVagas(response.data))
      .catch(error => console.error("Erro ao buscar vagas:", error));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, setFile) => {
    const file = e.target.files[0];
    if (file) setFile(file);
  };

  const handleDrop = (e, setFile, allowedTypes) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];

    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      alert(`Arquivo inválido. Tipos aceitos: ${allowedTypes.join(', ')}`);
      return;
    }

    setFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.nome || !formData.email || !formData.telefone || !formData.vaga_id || !curriculo || !foto || !aceitouPrivacidade) {
      toast.warn("Preencha todos os campos e aceite os termos de privacidade.");
      return;
    }
  
    const data = new FormData();
    data.append("nome", formData.nome);
    data.append("email", formData.email);
    data.append("telefone", formData.telefone);
    data.append("vaga_id", formData.vaga_id);
    data.append("curriculo_pdf", curriculo);
    data.append("foto", foto);
  
    try {
      const response = await api.post(`${API_BASE_URL}/api/jrnet/cadastro`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.error) {
        if (response.data.error.includes("email já cadastrado")) { // Altere conforme o erro retornado pelo backend
          toast.error("Este e-mail já está em uso. Tente outro.");
        } else {
          toast.error(`Erro: ${response.data.error}`);
        }
      } else {
        toast.success("Candidatura enviada com sucesso!");
        setFormData({ nome: '', email: '', telefone: '', vaga_id: '' });
        setCurriculo(null);
        setFoto(null);
        setAceitouPrivacidade(false);
      }
    } catch (error) {
      console.error("Erro ao enviar candidatura:", error);
      if (error.response && error.response.data && error.response.data.error) {
        if (error.response.data.error.includes("email já cadastrado")) {
          toast.error("Este e-mail já está em uso. Tente outro.");
        } else {
          toast.error(`Erro: ${error.response.data.error}`);
        }
      } else {
        toast.error("Erro ao enviar candidatura. Verifique os dados e tente novamente.");
      }
    }
  };


  return (
    <div className='home-container'>
      <ToastContainer />
      <div className='content'>
        <div className='left-content'>
          <h1 className='first-h1'>Aqui,</h1>
          <h1 className='second-h1'>seu potencial </h1>
          <span>é nosso próximo passo.</span> 
          <p className='subtitle'>Venha fazer parte!</p>
        </div>

        <div className='right-content'>
            <h1 id='selecao'>Seleção encerrada</h1>
          <div className='form-container'>
            <form className='form-box' onSubmit={handleSubmit}>
              <h2>Trabalhe <b>CONOSCO</b></h2>

              {/* Nome */}
              <div className="input-container">
                <input
                  type='text'
                  name='nome'
                  placeholder='Nome'
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
                <i className="icon-user"></i>
              </div>

              {/* Email */}
              <div className="input-container">
                <input
                  type='email'
                  name='email'
                  placeholder='E-mail'
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <p className="email-hint">Atenção: Apenas um e-mail por pessoa, por favor não repetir e-mail.</p>
                <i className="icon-email"></i>
              </div>

              {/* Telefone */}
              <div className="input-container input-tell">
                <InputMask
                  mask="(99) 99999-9999"
                  type='tel'
                  name='telefone'
                  placeholder='Contato'
                  value={formData.telefone}
                  onChange={handleChange}
                  required
                />
                <i className="icon-phone"></i>
              </div>

              {/* Seleção de Vagas */}
              <p className='vaga-title'>Vaga desejada (apenas uma)</p>
              <div className='vaga-options'>
                {/* {vagas.length > 0 ? (
                  vagas.map(vaga => (
                    <label key={vaga.id} className="checkbox-btn">
                      <input
                        id={`vaga-${vaga.id}`}
                        type="checkbox"
                        checked={formData.vaga_id === String(vaga.id)}
                        onChange={() => setFormData(prevState => ({
                          ...prevState,
                          vaga_id: prevState.vaga_id === String(vaga.id) ? '' : String(vaga.id)
                        }))}
                      />
                      <span className="checkmark" />
                      {vaga.titulo}
                    </label>
                  ))
                ) : (
                  <p>Carregando vagas...</p>
                )} */}

                <p>Processo seletivo encerrado</p>
              </div>


              {/* Upload de Arquivos */}
              <div className="upload-section">
                {/* Upload de Foto */}
                <div 
                  className="upload-box"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, setFoto, ['image/jpeg', 'image/png', 'image/webp'])}
                  onClick={() => document.getElementById('foto-input').click()}
                >
                  <img src="/img/upload.png" alt="" />
                  <p>{foto ? foto.name : "Sua Foto"}</p>
                  <p className='sublinha'>{foto ? '' : "png, jpg, jpeg, webp..."}</p>
                  <input
                    id="foto-input"
                    type="file"
                    accept="image/jpeg, image/png, image/webp"
                    onChange={(e) => handleFileChange(e, setFoto)}
                    style={{ display: 'none' }}
                  />
                </div>

                {/* Upload de Currículo */}
                <div 
                  className="upload-box"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, setCurriculo, ['application/pdf'])}
                  onClick={() => document.getElementById('curriculo-input').click()}
                >
                  <img src="/img/upload.png" alt="" />
                  <p>{curriculo ? curriculo.name : "Seu Curriculo."}</p>
                  <p className='sublinha'>{curriculo ? '' : "APENAS PDF"}</p>
                  <input
                    id="curriculo-input"
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => handleFileChange(e, setCurriculo)}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>

              {/* Checkbox de Privacidade */}
              <div className='privacy'>
                <label className='container'>
                  <input
                    type='checkbox'
                    checked={aceitouPrivacidade}
                    onChange={() => setAceitouPrivacidade(!aceitouPrivacidade)}
                  />
                  <div class="checkmark2"></div>
                </label>
                <span>Declaro que li e aceito os <span
                  onClick={() => setShowModal(true)}
                  className="cadastro-privacy-link"
                  style={{ color: 'orange', cursor: 'pointer', textDecoration: 'underline' }}
                >Termos de Privacidade</span>
                </span>
              </div>


                <div className='btn'>
                  <ButtonCadastro className='btn-cadastro' type="submit">Candidatar-se</ButtonCadastro>
                </div>
            </form>
          </div>
          </div>
          
        {showModal && (
        <div className="privacidade-modal-overlay">
          <div className="privacidade-modal-content">
            <h2>Política de Privacidade</h2>
    
            <div className="privacidade-modal-body">
              <h3>Política de Privacidade</h3>
              <p>
                Ao enviar seu currículo, foto e informações pessoais através do nosso sistema, 
                você concorda que os dados fornecidos serão utilizados <b>exclusivamente para fins de recrutamento e seleção</b> 
                para as vagas anunciadas em nossa plataforma.
              </p>
    
              <h4>1. Tipos de Dados Coletados</h4>
              <p>Durante o cadastro, coletamos as seguintes informações:</p>
              <ul>
                <li>Nome completo</li>
                <li>E-mail de contato</li>
                <li>Telefone</li>
                <li>Cargo ou vaga desejada</li>
                <li>Currículo (PDF)</li>
                <li>Imagem pessoal (foto de perfil)</li>
              </ul>
    
              <h4>2. Uso dos Dados</h4>
              <p>
                Esses dados são utilizados <b>exclusivamente</b> para analisar a compatibilidade do(a) candidato(a) com as vagas disponíveis 
                e possibilitar o contato para agendamentos ou comunicações relacionadas ao processo seletivo.
              </p>
    
              <h4>3. Compartilhamento dos Dados</h4>
              <p>
                Os dados informados <b>não serão compartilhados com terceiros</b> e <b>não serão utilizados para nenhuma finalidade que não seja o processo seletivo</b>. 
                Somente os responsáveis pela seleção e pela gestão de Recursos Humanos terão acesso aos dados, em ambiente seguro e controlado.
              </p>
    
              <h4>4. Tempo de Armazenamento dos Dados</h4>
              <p>
                Os dados serão armazenados <b>temporariamente</b>, durante o período de análise e conclusão do processo seletivo. Os dados serão <b>completamente excluídos de nosso sistema em até 30 dias após o inicio do processo seletivo</b>, 
                sem possibilidade de recuperação.
              </p>
    
              <h4>5. Segurança e Proteção</h4>
              <p>
                Adotamos medidas técnicas e organizacionais para proteger os dados contra acessos não autorizados, perdas, alterações ou destruições. 
                Nosso sistema utiliza <b>conexões seguras (HTTPS)</b> e armazenamento em servidores com acesso restrito.
              </p>
    
              <h4>6. Direitos do Candidato</h4>
              <p>
                Você tem o direito de:
              </p>
              <ul>
                <li>Solicitar informações sobre os dados armazenados.</li>
                <li>Solicitar a exclusão antecipada dos dados a qualquer momento, antes do prazo final, através de contato direto.</li>
              </ul>
    
              <h4>7. Consentimento</h4>
              <p>
                Ao marcar o campo de aceite da Política de Privacidade e enviar seus dados, você <b>concorda integralmente com todos os termos</b> aqui descritos.
              </p>
    
              <h4>8. Contato</h4>
              <p>
                Para dúvidas ou solicitações relacionadas aos seus dados, entre em contato pelo e-mail: 
                <b> suporte@provedorjrnet.com.br</b>
              </p>
            </div>
    
            <div className="privacidade-modal-footer">
              <button
                className="privacidade-modal-btn privacidade-modal-btn-accept"
                onClick={() => {
                  setAceitouPrivacidade(true);
                  setShowModal(false);
                }}
              >
                Concordo
              </button>
              <button
                className="privacidade-modal-btn privacidade-modal-btn-decline"
                onClick={() => setShowModal(false)}
              >
                Não Concordo
              </button>
            </div>
          </div>
        </div>
      )}
      </div>



    </div>
  );
};

export default Home;
