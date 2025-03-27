import React, { useState, useEffect } from "react";
import api, { API_BASE_URL } from "../services/api";
import "../styles/AllCandidatos.css";

const AllCandidatos = () => {
  const [candidatos, setCandidatos] = useState([]);
  const [vagas, setVagas] = useState([]);
  const [filtroVaga, setFiltroVaga] = useState("");
  const [buscaNome, setBuscaNome] = useState("");
  const [ordem, setOrdem] = useState("");
  const [curriculoUrl, setCurriculoUrl] = useState(null);

  useEffect(() => {
    const fetchCandidatos = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return window.location.href = "/login";

        const response = await api.get("/api/jrnet/listar", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCandidatos(response.data);
      } catch (error) {
        console.error("Erro ao buscar candidatos:", error);
        if (error.response?.status === 401) {
          window.location.href = "/login";
        }
      }
    };

    const fetchVagas = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return window.location.href = "/login";

        const response = await api.get("/api/jrnet/vagas", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVagas(response.data);
      } catch (error) {
        console.error("Erro ao buscar vagas:", error);
      }
    };

    fetchCandidatos();
    fetchVagas();
  }, []);

  // Filtrar e ordenar candidatos dinamicamente
  const candidatosExibidos = candidatos
    .filter((candidato) =>
      filtroVaga ? candidato.vaga_id.toString() === filtroVaga : true
    )
    .filter((candidato) =>
      candidato.nome.toLowerCase().includes(buscaNome.toLowerCase())
    )
    .sort((a, b) => {
      if (ordem === "asc") return a.id - b.id;
      if (ordem === "desc") return b.id - a.id;
      if (ordem === "az") return a.nome.localeCompare(b.nome);
      if (ordem === "za") return b.nome.localeCompare(a.nome);
      return 0;
    });

  const vagasComCandidatos = vagas.filter((vaga) =>
    candidatos.some((candidato) => candidato.vaga_id === vaga.id)
  );

  const abrirModalCurriculo = (curriculo) => {
    setCurriculoUrl(`${API_BASE_URL}${curriculo}`);
  };

  const fecharModal = () => {
    setCurriculoUrl(null);
  };

  return (
    <div className="candidatos-container">
      <div className="candidatos-filter">
        <h2>Todos Candidatos</h2>

        <div className="filtro-row">
          <div>
            <label className="filter-order">Filtrar por Vagas:</label>
            <select
              className="filtro-select"
              value={filtroVaga}
              onChange={(e) => setFiltroVaga(e.target.value)}
            >
              <option value="">Todos</option>
              {vagasComCandidatos.map((vaga) => (
                <option key={vaga.id} value={vaga.id}>
                  {vaga.titulo}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="filter-order">Ordenar por:</label>
            <select
              className="filtro-select"
              value={ordem}
              onChange={(e) => setOrdem(e.target.value)}
            >
              <option value="">Ordenar por</option>
              <option value="asc">Primeiros a enviar</option>
              <option value="desc">Últimos a enviar</option>
              <option value="az">Nomes A a Z</option>
              <option value="za">Nomes Z a A</option>
            </select>
          </div>

          <div className="candidatos-search">
            <label className="filter-order">Buscar:</label>
            <input
              type="text"
              placeholder="Pesquisar por nome..."
              value={buscaNome}
              onChange={(e) => setBuscaNome(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="candidatos-grid">
        {candidatosExibidos.map((candidato) => (
          <div key={candidato.id} className="candidato-card">
            <div className="candidato-info">
              <img
                src={
                  candidato.foto
                    ? `${API_BASE_URL}${candidato.foto}`
                    : "/img/default-profile.png"
                }
                alt={candidato.nome}
                className="candidato-foto"
              />
              <div className="candidato-detalhes">
                <strong>{candidato.nome}</strong>
                <p>Vaga: {candidato.vaga}</p>
                <small>Email: {candidato.email}</small>
                <br />
                <small>Telefone: {candidato.telefone}</small>
                <button
                  className="ver-curriculo-btn"
                  onClick={() => abrirModalCurriculo(candidato.curriculo_pdf)}
                >
                  Ver Currículo
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {curriculoUrl && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={fecharModal}>✖</button>
            <iframe
              src={curriculoUrl}
              title="Currículo"
              className="curriculo-viewer"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllCandidatos;
