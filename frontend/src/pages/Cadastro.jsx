
import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Wrench, Loader2, Eye, EyeOff } from "lucide-react";

import api from "@/services/api";

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

export default function Cadastro() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleCadastro(event) {
    event.preventDefault();

    setErro("");

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    if (senha.length < 8) {
      setErro("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    setCarregando(true);

    try {
      await api.post("/usuarios", {
        nome,
        email,
        senha,
        tipo: "CLIENTE",
      });

      navigate("/login", { replace: true });
    } catch (error) {
      if (error.response?.status === 409) {
        setErro("Este e-mail já está cadastrado.");
      } else if (error.response?.status === 400) {
        setErro(
          error.response.data?.erro ||
          "Verifique os dados informados."
        );
      } else {
        setErro("Não foi possível realizar o cadastro.");
      }

      console.error("Erro ao cadastrar usuário:", error);
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
            Criar conta
          </CardTitle>

          <CardDescription>
            Cadastre-se para acessar a Oficina Web.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleCadastro} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome completo</Label>

              <Input
                id="nome"
                type="text"
                placeholder="Digite seu nome"
                value={nome}
                onChange={(event) => setNome(event.target.value)}
                required
              />
            </div>

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
                  placeholder="Mínimo de 8 caracteres"
                  value={senha}
                  onChange={(event) => setSenha(event.target.value)}
                  className="pr-10"
                  minLength={8}
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

            <div className="space-y-2">
              <Label htmlFor="confirmarSenha">
                Confirmar senha
              </Label>

              <div className="relative">
                <Input
                  id="confirmarSenha"
                  type={mostrarConfirmacao ? "text" : "password"}
                  placeholder="Digite a senha novamente"
                  value={confirmarSenha}
                  onChange={(event) =>
                    setConfirmarSenha(event.target.value)
                  }
                  className="pr-10"
                  required
                />

                <button
                  type="button"
                  onClick={() => setMostrarConfirmacao(!mostrarConfirmacao)}
                  className="absolute right-0 top-0 flex h-full items-center justify-center px-3 text-muted-foreground hover:text-foreground"
                  aria-label={mostrarConfirmacao ? "Ocultar confirmação" : "Mostrar confirmação"}
                >
                  {mostrarConfirmacao ? (
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
                  Cadastrando...
                </>
              ) : (
                "Criar conta"
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Já possui uma conta?{" "}
              <Link
                to="/login"
                className="font-medium text-primary hover:underline"
              >
                Fazer login
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
