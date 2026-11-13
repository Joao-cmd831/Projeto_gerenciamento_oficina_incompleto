import { useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, CarFront } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const formularioInicial = { marca: "", modelo: "", ano: "", placa: "", cor: "", cliente: "" };

export default function Veiculos() {
  const [veiculos, setVeiculos] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [aberto, setAberto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formulario, setFormulario] = useState(formularioInicial);

  const filtrados = useMemo(() => {
    const termo = pesquisa.toLowerCase();
    return veiculos.filter((item) => Object.values(item).some((valor) => String(valor).toLowerCase().includes(termo)));
  }, [veiculos, pesquisa]);

  function abrirCadastro() {
    setEditando(null);
    setFormulario(formularioInicial);
    setAberto(true);
  }

  function abrirEdicao(item) {
    setEditando(item);
    setFormulario({ marca: item.marca, modelo: item.modelo, ano: item.ano, placa: item.placa, cor: item.cor, cliente: item.cliente });
    setAberto(true);
  }

  function salvar(event) {
    event.preventDefault();
    const dados = Object.fromEntries(Object.entries(formulario).map(([chave, valor]) => [chave, valor.trim()]));
    if (Object.values(dados).some((valor) => !valor)) return alert("Preencha todos os campos.");

    if (editando) {
      setVeiculos((lista) => lista.map((item) => item.id === editando.id ? { ...item, ...dados } : item));
    } else {
      setVeiculos((lista) => [...lista, { id: Math.max(0, ...lista.map((item) => item.id)) + 1, ...dados }]);
    }
    setAberto(false);
    setFormulario(formularioInicial);
    setEditando(null);
  }

  function excluir(id) {
    if (window.confirm("Deseja excluir este veículo?")) setVeiculos((lista) => lista.filter((item) => item.id !== id));
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div><h2 className="text-2xl font-bold tracking-tight">Veículos</h2><p className="text-sm text-muted-foreground">Gerencie os veículos cadastrados na oficina.</p></div>
        <Button onClick={abrirCadastro}><Plus className="mr-2 size-4" />Novo veículo</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Total de veículos</CardTitle><CarFront className="size-4 text-muted-foreground" /></CardHeader>
          <CardContent><div className="text-2xl font-bold">{veiculos.length}</div><p className="text-xs text-muted-foreground">Veículos cadastrados</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">Resultados encontrados</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{filtrados.length}</div><p className="text-xs text-muted-foreground">Conforme a pesquisa</p></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Veículos cadastrados</CardTitle>
          <CardDescription>Consulte e gerencie os veículos.</CardDescription>
          <div className="relative pt-2"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Pesquisar por placa, marca, modelo ou cliente..." value={pesquisa} onChange={(e) => setPesquisa(e.target.value)} className="pl-9" /></div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow><TableHead>Veículo</TableHead><TableHead>Ano</TableHead><TableHead>Placa</TableHead><TableHead>Cor</TableHead><TableHead>Cliente</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader>
              <TableBody>
                {filtrados.length ? filtrados.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.marca} {item.modelo}</TableCell><TableCell>{item.ano}</TableCell><TableCell>{item.placa}</TableCell><TableCell>{item.cor}</TableCell><TableCell>{item.cliente}</TableCell>
                    <TableCell><div className="flex justify-end gap-2"><Button variant="outline" size="icon" onClick={() => abrirEdicao(item)} aria-label="Editar veículo"><Pencil className="size-4" /></Button><Button variant="outline" size="icon" onClick={() => excluir(item.id)} aria-label="Excluir veículo"><Trash2 className="size-4" /></Button></div></TableCell>
                  </TableRow>
                )) : <TableRow><TableCell colSpan={6} className="h-28 text-center text-muted-foreground">{pesquisa ? "Nenhum veículo encontrado." : "Nenhum veículo cadastrado. Clique em Novo veículo para começar."}</TableCell></TableRow>}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={aberto} onOpenChange={setAberto}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader><DialogTitle>{editando ? "Editar veículo" : "Cadastrar veículo"}</DialogTitle><DialogDescription>Preencha os dados do veículo.</DialogDescription></DialogHeader>
          <form onSubmit={salvar}>
            <div className="grid gap-4 py-4 sm:grid-cols-2">
              {[
                ["marca", "Marca", "Ex.: Toyota"],
                ["modelo", "Modelo", "Ex.: Corolla"],
                ["ano", "Ano", "Ex.: 2022"],
                ["placa", "Placa", "ABC1D23"],
                ["cor", "Cor", "Ex.: Prata"],
                ["cliente", "Cliente", "Nome do cliente"],
              ].map(([campo, titulo, placeholder]) => (
                <div className="grid gap-2" key={campo}><Label htmlFor={campo}>{titulo}</Label><Input id={campo} placeholder={placeholder} value={formulario[campo]} onChange={(e) => setFormulario({ ...formulario, [campo]: campo === "placa" ? e.target.value.toUpperCase() : e.target.value })} /></div>
              ))}
            </div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setAberto(false)}>Cancelar</Button><Button type="submit">{editando ? "Salvar alterações" : "Cadastrar veículo"}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}