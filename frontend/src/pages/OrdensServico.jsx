import { useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, ClipboardList, Clock, CheckCircle2, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const formularioInicial = { cliente: "", veiculo: "", servico: "", data: "", valor: "", status: "ABERTA" };
const statusConfig = {
  ABERTA: { label: "Aberta", variant: "secondary" },
  EM_ANDAMENTO: { label: "Em andamento", variant: "default" },
  CONCLUIDA: { label: "Concluída", variant: "outline" },
  CANCELADA: { label: "Cancelada", variant: "destructive" },
};

const moeda = (valor) => Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function formatarData(data) {
  if (!data) return "-";
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

export default function OrdensServico() {
  const [ordens, setOrdens] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [aberto, setAberto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formulario, setFormulario] = useState(formularioInicial);

  const filtradas = useMemo(() => {
    const termo = pesquisa.toLowerCase();
    return ordens.filter((item) => Object.values(item).some((valor) => String(valor).toLowerCase().includes(termo)));
  }, [ordens, pesquisa]);

  const abertas = ordens.filter((item) => item.status === "ABERTA").length;
  const andamento = ordens.filter((item) => item.status === "EM_ANDAMENTO").length;
  const concluidas = ordens.filter((item) => item.status === "CONCLUIDA").length;
  const valorTotal = ordens.filter((item) => item.status !== "CANCELADA").reduce((total, item) => total + Number(item.valor), 0);

  function abrirCadastro() {
    setEditando(null);
    setFormulario(formularioInicial);
    setAberto(true);
  }

  function abrirEdicao(item) {
    setEditando(item);
    setFormulario({ cliente: item.cliente, veiculo: item.veiculo, servico: item.servico, data: item.data, valor: String(item.valor), status: item.status });
    setAberto(true);
  }

  function salvar(event) {
    event.preventDefault();
    const valor = Number(formulario.valor);
    const dados = { cliente: formulario.cliente.trim(), veiculo: formulario.veiculo.trim(), servico: formulario.servico.trim(), data: formulario.data, valor, status: formulario.status };

    if (!dados.cliente || !dados.veiculo || !dados.servico || !dados.data || !formulario.valor || !Number.isFinite(valor) || valor <= 0) return alert("Preencha todos os campos com valores válidos.");

    if (editando) {
      setOrdens((lista) => lista.map((item) => item.id === editando.id ? { ...item, ...dados } : item));
    } else {
      setOrdens((lista) => {
        const id = Math.max(0, ...lista.map((item) => item.id)) + 1;
        return [...lista, { id, numero: `OS-${String(id).padStart(4, "0")}`, ...dados }];
      });
    }
    setAberto(false);
    setFormulario(formularioInicial);
    setEditando(null);
  }

  function excluir(id) {
    if (window.confirm("Deseja excluir esta ordem de serviço?")) setOrdens((lista) => lista.filter((item) => item.id !== id));
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div><h2 className="text-2xl font-bold tracking-tight">Ordens de Serviço</h2><p className="text-sm text-muted-foreground">Controle os serviços realizados e o andamento dos atendimentos.</p></div>
        <Button onClick={abrirCadastro}><Plus className="mr-2 size-4" />Nova ordem</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Total de ordens</CardTitle><ClipboardList className="size-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{ordens.length}</div><p className="text-xs text-muted-foreground">Ordens cadastradas</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Abertas</CardTitle><Clock className="size-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{abertas}</div><p className="text-xs text-muted-foreground">Aguardando atendimento</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Em andamento</CardTitle><Clock className="size-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{andamento}</div><p className="text-xs text-muted-foreground">Serviços em execução</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Concluídas</CardTitle><CheckCircle2 className="size-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{concluidas}</div><p className="text-xs text-muted-foreground">Serviços finalizados</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Ordens cadastradas</CardTitle><CardDescription>Consulte clientes, veículos, serviços e valores das ordens.</CardDescription>
          <div className="relative pt-2"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Pesquisar por número, cliente ou veículo..." value={pesquisa} onChange={(e) => setPesquisa(e.target.value)} className="pl-9" /></div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow><TableHead>Número</TableHead><TableHead>Cliente</TableHead><TableHead>Veículo</TableHead><TableHead>Serviço</TableHead><TableHead>Data</TableHead><TableHead>Valor</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader>
              <TableBody>
                {filtradas.length ? filtradas.map((item) => (
                  <TableRow key={item.id}><TableCell className="font-medium">{item.numero}</TableCell><TableCell>{item.cliente}</TableCell><TableCell>{item.veiculo}</TableCell><TableCell>{item.servico}</TableCell><TableCell>{formatarData(item.data)}</TableCell><TableCell>{moeda(item.valor)}</TableCell><TableCell><Badge variant={statusConfig[item.status]?.variant ?? "secondary"}>{statusConfig[item.status]?.label ?? item.status}</Badge></TableCell><TableCell><div className="flex justify-end gap-2"><Button variant="outline" size="icon" onClick={() => abrirEdicao(item)} aria-label="Editar ordem"><Pencil className="size-4" /></Button><Button variant="outline" size="icon" onClick={() => excluir(item.id)} aria-label="Excluir ordem"><Trash2 className="size-4" /></Button></div></TableCell></TableRow>
                )) : <TableRow><TableCell colSpan={8} className="h-28 text-center text-muted-foreground">{pesquisa ? "Nenhuma ordem encontrada." : "Nenhuma ordem cadastrada. Clique em Nova ordem para começar."}</TableCell></TableRow>}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <div className="flex items-center justify-end gap-2 border-t px-6 py-4"><DollarSign className="size-4 text-muted-foreground" /><span className="text-sm text-muted-foreground">Valor total das ordens não canceladas:</span><strong className="text-sm">{moeda(valorTotal)}</strong></div>
      </Card>

      <Dialog open={aberto} onOpenChange={setAberto}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader><DialogTitle>{editando ? "Editar ordem de serviço" : "Nova ordem de serviço"}</DialogTitle><DialogDescription>Preencha as informações da ordem.</DialogDescription></DialogHeader>
          <form onSubmit={salvar}>
            <div className="grid gap-4 py-4 sm:grid-cols-2">
              {[
                ["cliente", "Cliente", "Nome do cliente"],
                ["veiculo", "Veículo", "Modelo e placa"],
                ["servico", "Serviço", "Serviço realizado"],
              ].map(([campo, titulo, placeholder]) => (
                <div className="grid gap-2 sm:col-span-2" key={campo}><Label htmlFor={campo}>{titulo}</Label><Input id={campo} placeholder={placeholder} value={formulario[campo]} onChange={(e) => setFormulario({ ...formulario, [campo]: e.target.value })} /></div>
              ))}
              <div className="grid gap-2"><Label htmlFor="data">Data de abertura</Label><Input id="data" type="date" value={formulario.data} onChange={(e) => setFormulario({ ...formulario, data: e.target.value })} /></div>
              <div className="grid gap-2"><Label htmlFor="valor">Valor total (R$)</Label><Input id="valor" type="number" min="0.01" step="0.01" placeholder="0,00" value={formulario.valor} onChange={(e) => setFormulario({ ...formulario, valor: e.target.value })} /></div>
              <div className="grid gap-2 sm:col-span-2"><Label htmlFor="status">Status da ordem</Label><select id="status" value={formulario.status} onChange={(e) => setFormulario({ ...formulario, status: e.target.value })} className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"><option value="ABERTA">Aberta</option><option value="EM_ANDAMENTO">Em andamento</option><option value="CONCLUIDA">Concluída</option><option value="CANCELADA">Cancelada</option></select></div>
            </div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setAberto(false)}>Cancelar</Button><Button type="submit">{editando ? "Salvar alterações" : "Cadastrar ordem"}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}