
import {
  Users,
  CarFront,
  Wrench,
  CalendarDays,
  ClipboardList,
  Package,
  TrendingUp,
  Clock,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const indicadores = [
  {
    titulo: "Total de clientes",
    valor: "—",
    descricao: "Clientes cadastrados",
    icon: Users,
  },
  {
    titulo: "Veículos cadastrados",
    valor: "—",
    descricao: "Veículos registrados",
    icon: CarFront,
  },
  {
    titulo: "Serviços disponíveis",
    valor: "—",
    descricao: "Serviços da oficina",
    icon: Wrench,
  },
  {
    titulo: "Agendamentos",
    valor: "—",
    descricao: "Agendamentos registrados",
    icon: CalendarDays,
  },
];

const atalhos = [
  {
    titulo: "Clientes",
    descricao: "Gerenciar clientes cadastrados",
    icon: Users,
    url: "/clientes",
  },
  {
    titulo: "Veículos",
    descricao: "Consultar veículos registrados",
    icon: CarFront,
    url: "/veiculos",
  },
  {
    titulo: "Ordens de serviço",
    descricao: "Acompanhar ordens de serviço",
    icon: ClipboardList,
    url: "/ordens-servico",
  },
  {
    titulo: "Estoque",
    descricao: "Gerenciar peças e produtos",
    icon: Package,
    url: "/estoque",
  },
];

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-8">

      {/* Cabeçalho */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard
        </h1>

        <p className="text-muted-foreground">
          Visão geral e gerenciamento da sua oficina.
        </p>
      </div>

      {/* Indicadores */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">
            Visão geral
          </h2>

          <p className="text-sm text-muted-foreground">
            Indicadores principais da oficina.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {indicadores.map((item) => {
            const Icon = item.icon;

            return (
              <Card key={item.titulo}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardDescription>
                    {item.titulo}
                  </CardDescription>

                  <Icon className="size-5 text-muted-foreground" />
                </CardHeader>

                <CardContent>
                  <div className="text-2xl font-bold">
                    {item.valor}
                  </div>

                  <p className="text-xs text-muted-foreground mt-1">
                    {item.descricao}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Atalhos e atividades */}
      <div className="grid gap-4 xl:grid-cols-2">

        <Card>
          <CardHeader>
            <CardTitle>Acesso rápido</CardTitle>

            <CardDescription>
              Acesse os principais módulos do sistema.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-3 sm:grid-cols-2">
            {atalhos.map((item) => {
              const Icon = item.icon;

              return (
                <a
                  key={item.url}
                  href={item.url}
                  className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-muted"
                >
                  <div className="rounded-md bg-muted p-2">
                    <Icon className="size-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="font-medium text-sm">
                      {item.titulo}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {item.descricao}
                    </p>
                  </div>
                </a>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atividade da oficina</CardTitle>

            <CardDescription>
              Acompanhamento das movimentações recentes.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
              <div className="rounded-full bg-muted p-4">
                <Clock className="size-7 text-muted-foreground" />
              </div>

              <div>
                <p className="font-medium">
                  Nenhuma atividade disponível
                </p>

                <p className="text-sm text-muted-foreground">
                  As movimentações aparecerão aqui quando o sistema
                  estiver conectado ao backend.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Rodapé informativo */}
      <div className="flex items-center gap-2 border-t pt-4 text-sm text-muted-foreground">
        <TrendingUp className="size-4" />
        <span>
          Painel de gerenciamento da Oficina Web.
        </span>
      </div>

    </div>
  );
}
