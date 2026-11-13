import { useState } from "react";
import {
  Package,
  Plus,
  Search,
  Pencil,
  Trash2,
  AlertTriangle,
  Boxes,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const formularioInicial = {
  nome: "",
  codigo: "",
  categoria: "",
  quantidade: "",
  quantidadeMinima: "",
  precoCompra: "",
  fornecedor: "",
};

export default function Estoque() {
  const [produtos, setProdutos] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [aberto, setAberto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formulario, setFormulario] = useState(formularioInicial);

  const produtosFiltrados = produtos.filter((produto) =>
    `${produto.nome} ${produto.codigo} ${produto.categoria}`
      .toLowerCase()
      .includes(pesquisa.toLowerCase())
  );

  const totalProdutos = produtos.length;

  const totalUnidades = produtos.reduce(
    (total, produto) => total + Number(produto.quantidade),
    0
  );

  const estoqueBaixo = produtos.filter(
    (produto) =>
      Number(produto.quantidade) <= Number(produto.quantidadeMinima)
  ).length;

  function abrirCadastro() {
    setEditando(null);
    setFormulario(formularioInicial);
    setAberto(true);
  }

  function editarProduto(produto) {
    setEditando(produto.id);
    setFormulario({
      nome: produto.nome,
      codigo: produto.codigo,
      categoria: produto.categoria,
      quantidade: produto.quantidade,
      quantidadeMinima: produto.quantidadeMinima,
      precoCompra: produto.precoCompra,
      fornecedor: produto.fornecedor,
    });
    setAberto(true);
  }

  function salvarProduto(event) {
    event.preventDefault();

    if (
      Number(formulario.quantidade) < 0 ||
      Number(formulario.quantidadeMinima) < 0 ||
      Number(formulario.precoCompra) < 0
    ) {
      return;
    }

    if (editando !== null) {
      setProdutos((anteriores) =>
        anteriores.map((produto) =>
          produto.id === editando
            ? { ...formulario, id: editando }
            : produto
        )
      );
    } else {
      setProdutos((anteriores) => [
        ...anteriores,
        {
          ...formulario,
          id: Date.now(),
        },
      ]);
    }

    setAberto(false);
    setFormulario(formularioInicial);
    setEditando(null);
  }

  function excluirProduto(id) {
    setProdutos((anteriores) =>
      anteriores.filter((produto) => produto.id !== id)
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Estoque</h2>
          <p className="text-sm text-muted-foreground">
            Gerencie peças, produtos e quantidades disponíveis.
          </p>
        </div>

        <Button onClick={abrirCadastro}>
          <Plus className="mr-2 h-4 w-4" />
          Novo produto
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Produtos cadastrados
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProdutos}</div>
            <p className="text-xs text-muted-foreground">
              Tipos de produtos no estoque
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Unidades disponíveis
            </CardTitle>
            <Boxes className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUnidades}</div>
            <p className="text-xs text-muted-foreground">
              Quantidade total de unidades
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Estoque baixo
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estoqueBaixo}</div>
            <p className="text-xs text-muted-foreground">
              Produtos no limite ou abaixo do mínimo
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <CardTitle>Produtos</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Consulte e gerencie os produtos cadastrados.
              </p>
            </div>

            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Pesquisar produto..."
                value={pesquisa}
                onChange={(event) => setPesquisa(event.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Preço de compra</TableHead>
                  <TableHead>Situação</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {produtosFiltrados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Package className="h-8 w-8 text-muted-foreground" />
                        <p className="font-medium">
                          {pesquisa
                            ? "Nenhum produto encontrado."
                            : "Nenhum produto cadastrado."}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {pesquisa
                            ? "Tente pesquisar por outro termo."
                            : "Clique em Novo produto para começar."}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  produtosFiltrados.map((produto) => {
                    const baixo =
                      Number(produto.quantidade) <=
                      Number(produto.quantidadeMinima);

                    return (
                      <TableRow key={produto.id}>
                        <TableCell className="font-medium">
                          {produto.nome}
                        </TableCell>
                        <TableCell>{produto.codigo}</TableCell>
                        <TableCell>{produto.categoria}</TableCell>
                        <TableCell>{produto.quantidade}</TableCell>
                        <TableCell>
                          {Number(produto.precoCompra).toLocaleString(
                            "pt-BR",
                            {
                              style: "currency",
                              currency: "BRL",
                            }
                          )}
                        </TableCell>
                        <TableCell>
                          {baixo ? (
                            <Badge variant="destructive">Estoque baixo</Badge>
                          ) : (
                            <Badge variant="secondary">Disponível</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => editarProduto(produto)}
                              aria-label="Editar produto"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => excluirProduto(produto.id)}
                              aria-label="Excluir produto"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={aberto} onOpenChange={setAberto}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {editando !== null ? "Editar produto" : "Cadastrar produto"}
            </DialogTitle>
            <DialogDescription>
              Preencha as informações do produto para o controle de estoque.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={salvarProduto} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do produto</Label>
                <Input
                  id="nome"
                  required
                  value={formulario.nome}
                  onChange={(event) =>
                    setFormulario({ ...formulario, nome: event.target.value })
                  }
                  placeholder="Ex.: Óleo de motor"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="codigo">Código</Label>
                <Input
                  id="codigo"
                  required
                  value={formulario.codigo}
                  onChange={(event) =>
                    setFormulario({ ...formulario, codigo: event.target.value })
                  }
                  placeholder="Código do produto"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Input
                  id="categoria"
                  required
                  value={formulario.categoria}
                  onChange={(event) =>
                    setFormulario({
                      ...formulario,
                      categoria: event.target.value,
                    })
                  }
                  placeholder="Ex.: Lubrificantes"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fornecedor">Fornecedor</Label>
                <Input
                  id="fornecedor"
                  value={formulario.fornecedor}
                  onChange={(event) =>
                    setFormulario({
                      ...formulario,
                      fornecedor: event.target.value,
                    })
                  }
                  placeholder="Nome do fornecedor"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantidade">Quantidade disponível</Label>
                <Input
                  id="quantidade"
                  type="number"
                  min="0"
                  required
                  value={formulario.quantidade}
                  onChange={(event) =>
                    setFormulario({
                      ...formulario,
                      quantidade: event.target.value,
                    })
                  }
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantidadeMinima">Quantidade mínima</Label>
                <Input
                  id="quantidadeMinima"
                  type="number"
                  min="0"
                  required
                  value={formulario.quantidadeMinima}
                  onChange={(event) =>
                    setFormulario({
                      ...formulario,
                      quantidadeMinima: event.target.value,
                    })
                  }
                  placeholder="0"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="precoCompra">Preço de compra (R$)</Label>
                <Input
                  id="precoCompra"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={formulario.precoCompra}
                  onChange={(event) =>
                    setFormulario({
                      ...formulario,
                      precoCompra: event.target.value,
                    })
                  }
                  placeholder="0,00"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setAberto(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {editando !== null ? "Salvar alterações" : "Cadastrar produto"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}