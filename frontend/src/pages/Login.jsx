
import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Wrench, Loader2, Eye, EyeOff } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();

    setErro("");
    setCarregando(true);

    try {
      await login(email, senha);

      navigate("/dashboard", { replace: true });
    } catch (error) {
      if (error.response?.status === 401) {
        setErro("E-mail ou senha incorretos.");
      } else if (error.response?.status === 400) {
        setErro("Verifique os dados informados.");
      } else {
        setErro("Não foi possível conectar ao servidor.");
      }

      console.error("Erro ao realizar login:", error);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <div className="mb-2 text-foreground">
            <Wrench className="h-9 w-9" />
          </div>

          <CardTitle className="text-2xl">
            Oficina Web
          </CardTitle>

          <CardDescription>
            Entre com seus dados para acessar o sistema.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>

              <Input
                id="email"
                type="email"
                placeholder="seuemail@email.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>

              <div className="relative">
                <Input
                  id="senha"
                  type={mostrarSenha ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(event) => setSenha(event.target.value)}
                  className="pr-10"
                  required
                />

                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-0 top-0 flex h-full items-center justify-center px-3 text-muted-foreground hover:text-foreground"
                  aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                >
                  {mostrarSenha ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {erro && (
              <p className="text-sm text-destructive" role="alert">
                {erro}
              </p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={carregando}
            >
              {carregando ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Ainda não possui uma conta?{" "}
            <Link
              to="/cadastro"
              className="font-medium text-primary hover:underline"
            >
              Criar conta
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
