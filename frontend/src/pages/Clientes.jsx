import { useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const formularioInicial = { nome: "", cpf: "", telefone: "", endereco: "" };

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [aberto, setAberto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formulario, setFormulario] = useState(formularioInicial);

  const filtrados = useMemo(() => {
    const termo = pesquisa.toLowerCase();
    return clientes.filter((cliente) =>
      Object.values(cliente).some((valor) => String(valor).toLowerCase().includes(termo))
    );
  }, [clientes, pesquisa]);

  function abrirCadastro() {
    setEditando(null);
    setFormulario(formularioInicial);
    setAberto(true);
  }

  function abrirEdicao(cliente) {
    setEditando(cliente);
    setFormulario({ nome: cliente.nome, cpf: cliente.cpf, telefone: cliente.telefone, endereco: cliente.endereco });
    setAberto(true);
  }

  function salvar(event) {
    event.preventDefault();
    const dados = Object.fromEntries(Object.entries(formulario).map(([chave, valor]) => [chave, valor.trim()]));

    if (Object.values(dados).some((valor) => !valor)) {
      alert("Preencha todos os campos.");
      return;
    }

    if (editando) {
      setClientes((lista) => lista.map((item) => item.id === editando.id ? { ...item, ...dados } : item));
    } else {
      setClientes((lista) => [...lista, { id: Math.max(0, ...lista.map((item) => item.id)) + 1, ...dados }]);
    }

    setAberto(false);
    setFormulario(formularioInicial);
    setEditando(null);
  }

  function excluir(id) {
    if (window.confirm("Deseja excluir este cliente?")) {
      setClientes((lista) => lista.filter((item) => item.id !== id));
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Clientes</h2>
          <p className="text-sm text-muted-foreground">Gerencie os clientes cadastrados na oficina.</p>
        </div>
        <Button onClick={abrirCadastro}><Plus className="mr-2 size-4" />Novo cliente</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de clientes</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientes.length}</div>
            <p className="text-xs text-muted-foreground">Clientes cadastrados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">Resultados encontrados</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filtrados.length}</div>
            <p className="text-xs text-muted-foreground">Conforme a pesquisa</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de clientes</CardTitle>
          <CardDescription>Consulte e gerencie os clientes da oficina.</CardDescription>
          <div className="relative pt-2">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Pesquisar cliente..." value={pesquisa} onChange={(e) => setPesquisa(e.target.value)} className="pl-9" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtrados.length ? filtrados.map((cliente) => (
                  <TableRow key={cliente.id}>
                    <TableCell className="font-medium">{cliente.nome}</TableCell>
                    <TableCell>{cliente.cpf}</TableCell>
                    <TableCell>{cliente.telefone}</TableCell>
                    <TableCell>{cliente.endereco}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" onClick={() => abrirEdicao(cliente)} aria-label="Editar cliente"><Pencil className="size-4" /></Button>
                        <Button variant="outline" size="icon" onClick={() => excluir(cliente.id)} aria-label="Excluir cliente"><Trash2 className="size-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow><TableCell colSpan={5} className="h-28 text-center text-muted-foreground">
                    {pesquisa ? "Nenhum cliente encontrado." : "Nenhum cliente cadastrado. Clique em Novo cliente para começar."}
                  </TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={aberto} onOpenChange={setAberto}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editando ? "Editar cliente" : "Cadastrar cliente"}</DialogTitle>
            <DialogDescription>Informe os dados do cliente.</DialogDescription>
          </DialogHeader>
          <form onSubmit={salvar}>
            <div className="grid gap-4 py-4">
              {[
                ["nome", "Nome completo", "Nome do cliente"],
                ["cpf", "CPF", "000.000.000-00"],
                ["telefone", "Telefone", "(00) 00000-0000"],
                ["endereco", "Endereço", "Rua, número, bairro"],
              ].map(([campo, titulo, placeholder]) => (
                <div className="grid gap-2" key={campo}>
                  <Label htmlFor={campo}>{titulo}</Label>
                  <Input id={campo} placeholder={placeholder} value={formulario[campo]} onChange={(e) => setFormulario({ ...formulario, [campo]: e.target.value })} />
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAberto(false)}>Cancelar</Button>
              <Button type="submit">{editando ? "Salvar alterações" : "Cadastrar cliente"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}