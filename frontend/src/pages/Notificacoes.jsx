import { Bell, Mail, Clock, Settings2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

export default function Notificacoes() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Notificações</h2>
        <p className="text-sm text-muted-foreground">
          Acompanhe os avisos e comunicações do sistema.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="rounded-lg bg-muted p-3">
            <Bell className="h-6 w-6" />
          </div>

          <div className="space-y-1">
            <CardTitle>Central de notificações</CardTitle>
            <CardDescription>
              Área destinada ao gerenciamento de avisos do sistema.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed px-6 py-12 text-center">
            <Mail className="mb-4 h-10 w-10 text-muted-foreground" />

            <h3 className="text-lg font-semibold">
              Integração de e-mail planejada
            </h3>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Esta funcionalidade será integrada posteriormente a um serviço
              externo para envio de notificações por e-mail, como avisos de
              agendamentos, atualizações e outros eventos importantes.
            </p>

            <Badge variant="secondary" className="mt-4">
              Em desenvolvimento
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-base">Envio por e-mail</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Envio automático de mensagens quando ocorrerem eventos
              importantes no sistema.
            </p>
            <Badge variant="outline" className="mt-3">
              Pendente de integração
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-base">Eventos do sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Futuramente, os avisos poderão ser disparados por agendamentos,
              ordens de serviço e outras operações.
            </p>
            <Badge variant="outline" className="mt-3">
              Planejado
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}