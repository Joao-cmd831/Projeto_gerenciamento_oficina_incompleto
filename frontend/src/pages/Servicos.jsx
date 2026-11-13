import { useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, Wrench, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const formularioInicial = { nome: "", descricao: "", preco: "", duracao: "" };
const moeda = (valor) => Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function Servicos() {
  const [servicos, setServicos] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [aberto, setAberto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formulario, setFormulario] = useState(formularioInicial);

  const filtrados = useMemo(() => {
    const termo = pesquisa.toLowerCase();
    return servicos.filter((item) => [item.nome, item.descricao, item.duracao].some((valor) => valor.toLowerCase().includes(termo)));
  }, [servicos, pesquisa]);

  const precoMedio = servicos.length ? servicos.reduce((total, item) => total + Number(item.preco), 0) / servicos.length : 0;

  function abrirCadastro() {
    setEditando(null);
    setFormulario(formularioInicial);
    setAberto(true);
  }

  function abrirEdicao(item) {
    setEditando(item);
    setFormulario({ nome: item.nome, descricao: item.descricao, preco: String(item.preco), duracao: item.duracao });
    setAberto(true);
  }

  function salvar(event) {
    event.preventDefault();
    const dados = { nome: formulario.nome.trim(), descricao: formulario.descricao.trim(), preco: Number(formulario.preco), duracao: formulario.duracao.trim() };
    if (!dados.nome || !dados.descricao || !formulario.preco || !dados.duracao || !Number.isFinite(dados.preco) || dados.preco <= 0) return alert("Preencha todos os campos com valores válidos.");

    if (editando) {
      setServicos((lista) => lista.map((item) => item.id === editando.id ? { ...item, ...dados } : item));
    } else {
      setServicos((lista) => [...lista, { id: Math.max(0, ...lista.map((item) => item.id)) + 1, ...dados }]);
    }
    setAberto(false);
    setFormulario(formularioInicial);
    setEditando(null);
  }

  function excluir(id) {
    if (window.confirm("Deseja excluir este serviço?")) setServicos((lista) => lista.filter((item) => item.id !== id));
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div><h2 className="text-2xl font-bold tracking-tight">Serviços</h2><p className="text-sm text-muted-foreground">Gerencie os serviços oferecidos pela oficina.</p></div>
        <Button onClick={abrirCadastro}><Plus className="mr-2 size-4" />Novo serviço</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Total de serviços</CardTitle><Wrench className="size-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{servicos.length}</div><p className="text-xs text-muted-foreground">Serviços cadastrados</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Preço médio</CardTitle><DollarSign className="size-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{moeda(precoMedio)}</div><p className="text-xs text-muted-foreground">Média dos serviços cadastrados</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm font-medium">Resultados encontrados</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{filtrados.length}</div><p className="text-xs text-muted-foreground">Conforme a pesquisa</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Serviços cadastrados</CardTitle><CardDescription>Consulte preços e tempos estimados.</CardDescription>
          <div className="relative pt-2"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Pesquisar serviço..." value={pesquisa} onChange={(e) => setPesquisa(e.target.value)} className="pl-9" /></div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow><TableHead>Serviço</TableHead><TableHead>Descrição</TableHead><TableHead>Preço</TableHead><TableHead>Duração</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader>
              <TableBody>
                {filtrados.length ? filtrados.map((item) => (
                  <TableRow key={item.id}><TableCell className="font-medium">{item.nome}</TableCell><TableCell>{item.descricao}</TableCell><TableCell>{moeda(item.preco)}</TableCell><TableCell>{item.duracao} min</TableCell><TableCell><div className="flex justify-end gap-2"><Button variant="outline" size="icon" onClick={() => abrirEdicao(item)} aria-label="Editar serviço"><Pencil className="size-4" /></Button><Button variant="outline" size="icon" onClick={() => excluir(item.id)} aria-label="Excluir serviço"><Trash2 className="size-4" /></Button></div></TableCell></TableRow>
                )) : <TableRow><TableCell colSpan={5} className="h-28 text-center text-muted-foreground">{pesquisa ? "Nenhum serviço encontrado." : "Nenhum serviço cadastrado. Clique em Novo serviço para começar."}</TableCell></TableRow>}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={aberto} onOpenChange={setAberto}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader><DialogTitle>{editando ? "Editar serviço" : "Cadastrar serviço"}</DialogTitle><DialogDescription>Informe os dados do serviço.</DialogDescription></DialogHeader>
          <form onSubmit={salvar}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2"><Label htmlFor="nome">Nome do serviço</Label><Input id="nome" placeholder="Nome do serviço" value={formulario.nome} onChange={(e) => setFormulario({ ...formulario, nome: e.target.value })} /></div>
              <div className="grid gap-2"><Label htmlFor="descricao">Descrição</Label><Input id="descricao" placeholder="Descrição do serviço" value={formulario.descricao} onChange={(e) => setFormulario({ ...formulario, descricao: e.target.value })} /></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2"><Label htmlFor="preco">Preço (R$)</Label><Input id="preco" type="number" min="0.01" step="0.01" placeholder="0,00" value={formulario.preco} onChange={(e) => setFormulario({ ...formulario, preco: e.target.value })} /></div>
                <div className="grid gap-2"><Label htmlFor="duracao">Duração (minutos)</Label><Input id="duracao" type="number" min="1" placeholder="Ex.: 60" value={formulario.duracao} onChange={(e) => setFormulario({ ...formulario, duracao: e.target.value })} /></div>
              </div>
            </div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setAberto(false)}>Cancelar</Button><Button type="submit">{editando ? "Salvar alterações" : "Cadastrar serviço"}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}