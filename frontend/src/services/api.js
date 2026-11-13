import axios from "axios";

// Cria a conexão padrão com o backend.
const api = axios.create({
  baseURL: "http://localhost:8080",

  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepta as requisições antes de serem enviadas.
api.interceptors.request.use(
  (config) => {
    // Recupera o token JWT armazenado no navegador.
    const token = localStorage.getItem("token");

    // Se existir um token, adiciona ao cabeçalho.
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (erro) => {
    return Promise.reject(erro);
  }
);

export default api;
