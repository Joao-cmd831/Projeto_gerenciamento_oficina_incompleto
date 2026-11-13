import { createContext, useContext, useState } from "react";
import api from "@/services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const usuarioSalvo = localStorage.getItem("usuario");

    return usuarioSalvo ? JSON.parse(usuarioSalvo) : null;
  });

  async function login(email, senha) {
    const resposta = await api.post("/auth/login", {
      email,
      senha,
    });

    const dados = resposta.data;

    localStorage.setItem("token", dados.token);

    const usuarioLogado = {
      id: dados.id,
      nome: dados.nome,
      email: dados.email,
      tipo: dados.tipo,
    };

    localStorage.setItem("usuario", JSON.stringify(usuarioLogado));

    setUsuario(usuarioLogado);

    return usuarioLogado;
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    setUsuario(null);
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        login,
        logout,
        autenticado: !!usuario,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
