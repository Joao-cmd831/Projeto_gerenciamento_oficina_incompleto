import { NavLink, useLocation, useNavigate } from "react-router";

import {
  LayoutDashboard,
  Users,
  CarFront,
  Wrench,
  CalendarDays,
  ClipboardList,
  Package,
  Bell,
  LogOut,
  UserRound,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Clientes",
    url: "/clientes",
    icon: Users,
  },
  {
    title: "Veículos",
    url: "/veiculos",
    icon: CarFront,
  },
  {
    title: "Serviços",
    url: "/servicos",
    icon: Wrench,
  },
  {
    title: "Agendamentos",
    url: "/agendamentos",
    icon: CalendarDays,
  },
  {
    title: "Ordens de Serviço",
    url: "/ordens-servico",
    icon: ClipboardList,
  },
  {
    title: "Estoque",
    url: "/estoque",
    icon: Package,
  },
  {
    title: "Notificações",
    url: "/notificacoes",
    icon: Bell,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const { usuario, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2 overflow-hidden">
          <Wrench className="size-6 shrink-0" />

          <span className="font-bold text-lg whitespace-nowrap group-data-[collapsible=icon]:hidden">
            Oficina Web
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            Menu principal
          </SidebarGroupLabel>

          <SidebarMenu>
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    render={<NavLink to={item.url} />}
                    isActive={location.pathname === item.url}
                    tooltip={item.title}
                  >
                    <Icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="border-t p-3 space-y-3">
          <div className="flex items-center gap-2 overflow-hidden">
            <UserRound className="size-5 shrink-0" />

            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="text-sm font-medium truncate">
                {usuario?.nome || "Usuário"}
              </p>

              <p className="text-xs text-muted-foreground">
                {usuario?.tipo || "Conta"}
              </p>
            </div>
          </div>

          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleLogout}
                tooltip="Sair"
              >
                <LogOut />
                <span>Sair</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <div className="px-1 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
            Sistema de gerenciamento
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
