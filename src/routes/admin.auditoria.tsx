import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Shield, Filter } from "lucide-react";

export const Route = createFileRoute("/admin/auditoria")({
  component: AuditLogs,
});

type AuditLog = {
  id: string;
  action: string;
  table_name: string;
  record_id: string | null;
  actor_id: string | null;
  old_data: unknown;
  new_data: unknown;
  created_at: string;
};

async function fetchAuditLogs(table: string | null): Promise<AuditLog[]> {
  let q = supabase
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
  if (table) q = q.eq("table_name", table);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as AuditLog[];
}

const TABLES = [
  { value: "", label: "Todas" },
  { value: "user_roles", label: "Permissões" },
  { value: "products", label: "Produtos" },
  { value: "categories", label: "Categorias" },
];

const ACTION_BADGE: Record<string, string> = {
  INSERT: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  UPDATE: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  DELETE: "bg-destructive/10 text-destructive border-destructive/20",
};

function AuditLogs() {
  const [table, setTable] = useState<string>("");
  const [openId, setOpenId] = useState<string | null>(null);
  const { data: logs = [], isLoading, error } = useQuery({
    queryKey: ["audit-logs", table],
    queryFn: () => fetchAuditLogs(table || null),
  });

  return (
    <div>
      <div className="flex items-center gap-3">
        <Shield className="h-6 w-6 text-primary" />
        <h1 className="font-display text-3xl font-bold">Auditoria</h1>
      </div>
      <p className="mt-2 text-muted-foreground">
        Registro de ações sensíveis: mudanças de permissões, produtos e categorias.
      </p>

      <div className="mt-6 flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <select
          value={table}
          onChange={(e) => setTable(e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-2 text-sm"
        >
          {TABLES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="mt-6 text-sm text-destructive">
          {error instanceof Error ? error.message : "Erro ao carregar"}
        </p>
      )}

      {isLoading ? (
        <p className="mt-8 text-muted-foreground">Carregando...</p>
      ) : logs.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-border p-12 text-center text-muted-foreground">
          Nenhum registro ainda.
        </div>
      ) : (
        <div className="mt-6 divide-y divide-border rounded-lg border border-border bg-background">
          {logs.map((log) => {
            const open = openId === log.id;
            return (
              <div key={log.id} className="p-3">
                <button
                  onClick={() => setOpenId(open ? null : log.id)}
                  className="flex w-full items-center gap-3 text-left"
                >
                  <span
                    className={`inline-flex rounded-md border px-2 py-0.5 text-xs font-semibold ${
                      ACTION_BADGE[log.action] ?? "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {log.action}
                  </span>
                  <span className="text-sm font-medium">{log.table_name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {log.record_id}
                  </span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {new Date(log.created_at).toLocaleString("pt-BR")}
                  </span>
                </button>
                {open && (
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <div>
                      <div className="mb-1 text-xs font-semibold text-muted-foreground">
                        Antes
                      </div>
                      <pre className="max-h-64 overflow-auto rounded-md bg-muted p-2 text-xs">
                        {log.old_data ? JSON.stringify(log.old_data, null, 2) : "—"}
                      </pre>
                    </div>
                    <div>
                      <div className="mb-1 text-xs font-semibold text-muted-foreground">
                        Depois
                      </div>
                      <pre className="max-h-64 overflow-auto rounded-md bg-muted p-2 text-xs">
                        {log.new_data ? JSON.stringify(log.new_data, null, 2) : "—"}
                      </pre>
                    </div>
                    <div className="md:col-span-2 text-xs text-muted-foreground">
                      Autor: {log.actor_id ?? "sistema"}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
