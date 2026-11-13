import { useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, CalendarDays, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const formularioInicial = { cliente: "", veiculo: "", servico: "", data: "", horario: "", status: "PENDENTE" };
const statusConfig = {
  PENDENTE: { label: "Pendente", variant: "secondary" },
  CONFIRMADO: { label: "Confirmado", variant: "default" },
  CONCLUIDO: { label: "Concluído", variant: "outline" },
  CANCELADO: { label: "Cancelado", variant: "destructive" },
};

function formatarData(data) {
  if (!data) return "-";
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

export default function Agendamentos() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [aberto, setAberto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formulario, setFormulario] = useState(formularioInicial);

  const filtrados = useMemo(() => {
    const termo = pesquisa.toLowerCase();
    return agendamentos.filter((item) => Object.values(item).some((valor) => String(valor).toLowerCase().includes(termo)));
  }, [agendamentos, pesquisa]);

  const pendentes = agendamentos.filter((item) => item.status === "PENDENTE").length;
  const confirmados = agendamentos.filter((item) => item.status === "CONFIRMADO").length;
  const concluidos = agendamentos.filter((item) => item.status === "CONCLUIDO").length;

  function abrirCadastro() {
    setEditando(null);
    setFormulario(formularioInicial);
    setAberto(true);
  }

  function abrirEdicao(item) {
    setEditando(item);
    setFormulario({ cliente: item.cliente, veiculo: item.veiculo, servico: item.servico, data: item.data, horario: item.horario, status: item.status });
    setAberto(true);
  }

  function salvar(event) {
    event.preventDefault();
    const dados = Object.fromEntries(Object.entries(formulario).map(([chave, valor]) => [chave, valor.trim()]));
    if (Object.values(dados).some((valor) => !valor)) return alert("Preencha todos os campos.");

    if (editando) {
      setAgendamentos((lista) => lista.map((item) => item.id === editando.id ? { ...item, ...dados } : item));
    } else {
      setAgendamentos((lista) => [...lista, { id: Math.max(0, ...lista.map((item) => item.id)) + 1, ...dados }]);
    }
    setAberto(false);
    setFormulario(formularioInicial);
    setEditando(null);
  }

  function excluir(id) {
    if (window.confirm("Deseja excluir este agendamento?")) setAgendamentos((lista) => lista.filter((item) => item.id !== id));
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div><h2 className="text-2xl font-bold tracking-tight">Agendamentos</h2><p className="text-sm text-muted-foreground">Organize e acompanhe os horários da oficina.</p></div>
        <Button onClick={abrirCadastro}><Plus className="mr-2 size-4" />Novo agendamento</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Total</CardTitle><CalendarDays className="size-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{agendamentos.length}</div><p className="text-xs text-muted-foreground">Agendamentos cadastrados</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Pendentes</CardTitle><Clock className="size-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{pendentes}</div><p className="text-xs text-muted-foreground">Aguardando confirmação</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Confirmados</CardTitle><CheckCircle2 className="size-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{confirmados}</div><p className="text-xs text-muted-foreground">Horários confirmados</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Concluídos</CardTitle><CheckCircle2 className="size-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{concluidos}</div><p className="text-xs text-muted-foreground">Serviços finalizados</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Agenda da oficina</CardTitle><CardDescription>Consulte e gerencie os horários agendados.</CardDescription>
          <div className="relative pt-2"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Pesquisar agendamento..." value={pesquisa} onChange={(e) => setPesquisa(e.target.value)} className="pl-9" /></div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow><TableHead>Cliente</TableHead><TableHead>Veículo</TableHead><TableHead>Serviço</TableHead><TableHead>Data</TableHead><TableHead>Horário</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader>
              <TableBody>
                {filtrados.length ? filtrados.map((item) => (
                  <TableRow key={item.id}><TableCell className="font-medium">{item.cliente}</TableCell><TableCell>{item.veiculo}</TableCell><TableCell>{item.servico}</TableCell><TableCell>{formatarData(item.data)}</TableCell><TableCell>{item.horario}</TableCell><TableCell><Badge variant={statusConfig[item.status]?.variant ?? "secondary"}>{statusConfig[item.status]?.label ?? item.status}</Badge></TableCell><TableCell><div className="flex justify-end gap-2"><Button variant="outline" size="icon" onClick={() => abrirEdicao(item)} aria-label="Editar agendamento"><Pencil className="size-4" /></Button><Button variant="outline" size="icon" onClick={() => excluir(item.id)} aria-label="Excluir agendamento"><Trash2 className="size-4" /></Button></div></TableCell></TableRow>
                )) : <TableRow><TableCell colSpan={7} className="h-28 text-center text-muted-foreground">{pesquisa ? "Nenhum agendamento encontrado." : "Nenhum agendamento cadastrado. Clique em Novo agendamento para começar."}</TableCell></TableRow>}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={aberto} onOpenChange={setAberto}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader><DialogTitle>{editando ? "Editar agendamento" : "Novo agendamento"}</DialogTitle><DialogDescription>Informe os dados para reservar um horário.</DialogDescription></DialogHeader>
          <form onSubmit={salvar}>
            <div className="grid gap-4 py-4 sm:grid-cols-2">
              {[
                ["cliente", "Cliente", "Nome do cliente"],
                ["veiculo", "Veículo", "Modelo e placa"],
                ["servico", "Serviço", "Serviço solicitado"],
              ].map(([campo, titulo, placeholder]) => (
                <div className="grid gap-2 sm:col-span-2" key={campo}><Label htmlFor={campo}>{titulo}</Label><Input id={campo} placeholder={placeholder} value={formulario[campo]} onChange={(e) => setFormulario({ ...formulario, [campo]: e.target.value })} /></div>
              ))}
              <div className="grid gap-2"><Label htmlFor="data">Data</Label><Input id="data" type="date" value={formulario.data} onChange={(e) => setFormulario({ ...formulario, data: e.target.value })} /></div>
              <div className="grid gap-2"><Label htmlFor="horario">Horário</Label><Input id="horario" type="time" value={formulario.horario} onChange={(e) => setFormulario({ ...formulario, horario: e.target.value })} /></div>
              <div className="grid gap-2 sm:col-span-2"><Label htmlFor="status">Status</Label><select id="status" value={formulario.status} onChange={(e) => setFormulario({ ...formulario, status: e.target.value })} className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"><option value="PENDENTE">Pendente</option><option value="CONFIRMADO">Confirmado</option><option value="CONCLUIDO">Concluído</option><option value="CANCELADO">Cancelado</option></select></div>
            </div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setAberto(false)}>Cancelar</Button><Button type="submit">{editando ? "Salvar alterações" : "Cadastrar agendamento"}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}