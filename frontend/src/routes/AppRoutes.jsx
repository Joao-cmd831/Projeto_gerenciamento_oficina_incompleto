import { BrowserRouter, Routes, Route, Navigate } from "react-router";

import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";

import Dashboard from "@/pages/Dashboard";
import Clientes from "@/pages/Clientes";
import Veiculos from "@/pages/Veiculos";
import Servicos from "@/pages/Servicos";
import Agendamentos from "@/pages/Agendamentos";
import OrdensServico from "@/pages/OrdensServico";
import Estoque from "@/pages/Estoque";
import Notificacoes from "@/pages/Notificacoes";
import Login from "@/pages/Login";
import Cadastro from "@/pages/Cadastro";

// Impede o acesso às páginas internas sem autenticação.
function RotaProtegida({ children }) {
  const { autenticado } = useAuth();

  if (!autenticado) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Páginas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        {/* Páginas que exigem login */}
        <Route
          element={
            <RotaProtegida>
              <AppLayout />
            </RotaProtegida>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/veiculos" element={<Veiculos />} />
          <Route path="/servicos" element={<Servicos />} />
          <Route path="/agendamentos" element={<Agendamentos />} />
          <Route path="/ordens-servico" element={<OrdensServico />} />
          <Route path="/estoque" element={<Estoque />} />
          <Route path="/notificacoes" element={<Notificacoes />} />
        </Route>

        {/* Redirecionamentos */}
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />

        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}
