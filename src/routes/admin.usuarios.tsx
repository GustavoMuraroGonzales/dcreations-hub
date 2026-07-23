import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Users, ShieldCheck, ShieldPlus, ShieldMinus, Trash2, Crown } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { listUsers, setUserRole, deleteUser } from "@/lib/admin-users.functions";
import { useIsAdmin } from "@/lib/auth";

export const Route = createFileRoute("/admin/usuarios")({
  component: UsersPage,
});

function UsersPage() {
  const { user: currentUser } = useIsAdmin();
  const qc = useQueryClient();
  const listFn = useServerFn(listUsers);
  const setRoleFn = useServerFn(setUserRole);
  const deleteFn = useServerFn(deleteUser);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => listFn(),
  });

  const roleMutation = useMutation({
    mutationFn: (v: { userId: string; role: "admin" | "user"; grant: boolean }) =>
      setRoleFn({ data: v }),
    onSuccess: () => {
      toast.success("Permissão atualizada.");
      qc.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erro"),
  });

  const deleteMutation = useMutation({
    mutationFn: (userId: string) => deleteFn({ data: { userId } }),
    onSuccess: () => {
      toast.success("Usuário excluído.");
      setConfirmDelete(null);
      qc.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erro"),
  });

  return (
    <div>
      <div className="flex items-center gap-3">
        <Users className="h-6 w-6 text-primary" />
        <h1 className="font-display text-3xl font-bold">Usuários</h1>
      </div>
      <p className="mt-2 text-muted-foreground">
        Gerencie contas cadastradas e conceda ou revogue permissões de administrador.
      </p>

      {error && (
        <p className="mt-6 text-sm text-destructive">
          {error instanceof Error ? error.message : "Erro ao carregar"}
        </p>
      )}

      {isLoading ? (
        <p className="mt-8 text-muted-foreground">Carregando...</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-background">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Provedor</th>
                <th className="px-4 py-3">Criado em</th>
                <th className="px-4 py-3">Último acesso</th>
                <th className="px-4 py-3">Papéis</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((u) => {
                const isSuper = u.roles.includes("super_admin");
                const isAdmin = u.roles.includes("admin");
                const isSelf = currentUser?.id === u.id;
                const busy =
                  (roleMutation.isPending && roleMutation.variables?.userId === u.id) ||
                  (deleteMutation.isPending && deleteMutation.variables === u.id);
                return (
                  <tr key={u.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 font-medium">
                        {u.email}
                        {isSelf && (
                          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary">
                            você
                          </span>
                        )}
                      </div>
                      {!u.email_confirmed_at && (
                        <div className="text-xs text-amber-600">email não confirmado</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{u.provider}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(u.created_at).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {u.last_sign_in_at
                        ? new Date(u.last_sign_in_at).toLocaleString("pt-BR")
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {isSuper && (
                          <span className="inline-flex items-center gap-1 rounded border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-700">
                            <Crown className="h-3 w-3" /> super admin
                          </span>
                        )}
                        {isAdmin && (
                          <span className="inline-flex items-center gap-1 rounded border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                            <ShieldCheck className="h-3 w-3" /> admin
                          </span>
                        )}
                        {!isAdmin && !isSuper && (
                          <span className="rounded border border-border px-2 py-0.5 text-xs text-muted-foreground">
                            usuário
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        {isSuper ? (
                          <span className="text-xs italic text-muted-foreground">protegido</span>
                        ) : (
                          <>
                            {isAdmin ? (
                              <button
                                disabled={busy || isSelf}
                                onClick={() =>
                                  roleMutation.mutate({
                                    userId: u.id,
                                    role: "admin",
                                    grant: false,
                                  })
                                }
                                className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs hover:bg-muted disabled:opacity-50"
                                title={isSelf ? "Não é possível remover a si mesmo" : "Revogar admin"}
                              >
                                <ShieldMinus className="h-3 w-3" /> Revogar admin
                              </button>
                            ) : (
                              <button
                                disabled={busy}
                                onClick={() =>
                                  roleMutation.mutate({
                                    userId: u.id,
                                    role: "admin",
                                    grant: true,
                                  })
                                }
                                className="inline-flex items-center gap-1 rounded-md border border-primary/40 bg-primary/5 px-2 py-1 text-xs text-primary hover:bg-primary/10 disabled:opacity-50"
                              >
                                <ShieldPlus className="h-3 w-3" /> Tornar admin
                              </button>
                            )}
                            <button
                              disabled={busy || isSelf}
                              onClick={() => setConfirmDelete(u.id)}
                              className="inline-flex items-center gap-1 rounded-md border border-destructive/40 px-2 py-1 text-xs text-destructive hover:bg-destructive/10 disabled:opacity-50"
                            >
                              <Trash2 className="h-3 w-3" /> Excluir
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg border border-border bg-background p-6">
            <h2 className="font-display text-lg font-bold">Excluir usuário?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Esta ação é permanente. A conta e o acesso serão removidos.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="rounded-md border border-border px-3 py-2 text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={() => deleteMutation.mutate(confirmDelete)}
                disabled={deleteMutation.isPending}
                className="rounded-md bg-destructive px-3 py-2 text-sm font-semibold text-destructive-foreground disabled:opacity-60"
              >
                {deleteMutation.isPending ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
