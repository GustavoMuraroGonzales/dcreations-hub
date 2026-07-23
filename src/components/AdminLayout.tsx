import { Link, useNavigate, Outlet } from "@tanstack/react-router";
import { useEffect } from "react";
import { useIsAdmin } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, Package, Tag, LogOut, ExternalLink, Shield, Users } from "lucide-react";
import { toast } from "sonner";

export function AdminLayout() {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useIsAdmin();

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    toast.success("Você saiu.");
    navigate({ to: "/" });
  }

  if (loading) {
    return <div className="grid min-h-screen place-items-center text-muted-foreground">Carregando...</div>;
  }
  if (!user) return null;
  if (!isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center px-4 text-center">
        <div>
          <h1 className="font-display text-2xl font-bold">Acesso restrito</h1>
          <p className="mt-2 text-muted-foreground">Sua conta não tem permissão de administrador.</p>
          <button onClick={handleSignOut} className="mt-6 rounded-md border border-border px-4 py-2">
            Sair
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <aside className="fixed inset-y-0 left-0 hidden w-56 border-r border-border bg-background md:block">
        <div className="p-4">
          <Link to="/" className="font-display text-lg font-bold">
            Gonza<span className="text-primary">3D</span>Lab
          </Link>
          <div className="mt-1 text-xs text-muted-foreground">Painel admin</div>
        </div>
        <nav className="flex flex-col gap-1 p-2 text-sm">
          <NavItem to="/admin" icon={LayoutDashboard} label="Início" exact />
          <NavItem to="/admin/produtos" icon={Package} label="Produtos" />
          <NavItem to="/admin/categorias" icon={Tag} label="Categorias" />
          <NavItem to="/admin/usuarios" icon={Users} label="Usuários" />
          <NavItem to="/admin/auditoria" icon={Shield} label="Auditoria" />
        </nav>
        <div className="absolute bottom-0 left-0 right-0 space-y-1 border-t border-border p-2 text-sm">
          <Link to="/" className="flex items-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted">
            <ExternalLink className="h-4 w-4" /> Ver site
          </Link>
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted"
          >
            <LogOut className="h-4 w-4" /> Sair
          </button>
        </div>
      </aside>

      <div className="md:pl-56">
        <div className="md:hidden border-b border-border bg-background px-4 py-3 flex items-center justify-between">
          <Link to="/admin" className="font-display font-bold">Admin</Link>
          <div className="flex gap-2 text-xs">
            <Link to="/admin/produtos" className="rounded border border-border px-2 py-1">Produtos</Link>
            <Link to="/admin/categorias" className="rounded border border-border px-2 py-1">Categorias</Link>
            <button onClick={handleSignOut} className="rounded border border-border px-2 py-1">Sair</button>
          </div>
        </div>
        <main className="mx-auto max-w-6xl p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function NavItem({
  to,
  icon: Icon,
  label,
  exact,
}: {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  exact?: boolean;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted"
      activeProps={{ className: "bg-primary/10 text-primary" }}
      activeOptions={{ exact }}
    >
      <Icon className="h-4 w-4" /> {label}
    </Link>
  );
}
