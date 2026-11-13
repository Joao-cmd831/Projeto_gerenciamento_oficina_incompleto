
import { Outlet, useLocation } from "react-router";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "./AppSidebar";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/clientes": "Clientes",
  "/veiculos": "Veículos",
  "/servicos": "Serviços",
  "/agendamentos": "Agendamentos",
  "/ordens-servico": "Ordens de Serviço",
  "/estoque": "Estoque",
  "/notificacoes": "Notificações",
};

export function AppLayout() {
  const location = useLocation();

  const pageTitle =
    pageTitles[location.pathname] || "Oficina Web";

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b px-4 md:px-6">

          <div className="flex items-center gap-3">
            <SidebarTrigger />

            <Separator
              orientation="vertical"
              className="h-6"
            />

            <div className="flex flex-col">
              <h1 className="text-sm font-semibold">
                {pageTitle}
              </h1>

              <p className="text-xs text-muted-foreground">
                Oficina Web
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-muted-foreground sm:block">
              Sistema de gerenciamento
            </span>
          </div>

        </header>

        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
