import { Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { EMAIL, INSTAGRAM, whatsappLink } from "@/lib/contact";
import { useIsAdmin } from "@/lib/auth";

export function Footer() {
  const { isAdmin, user } = useIsAdmin();
  return (
    <footer className="mt-24 border-t border-border bg-graphite text-graphite-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4 md:px-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 font-display text-xl font-bold">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">G</span>
            <span>Gonza<span className="text-primary">3D</span>Lab</span>
          </div>
          <p className="mt-4 max-w-md text-sm text-graphite-foreground/70">
            Impressão 3D sob demanda: miniaturas, peças técnicas, personalizados e protótipos com qualidade e precisão.
          </p>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider">Navegar</h4>
          <ul className="mt-4 space-y-2 text-sm text-graphite-foreground/70">
            <li><Link to="/catalogo" className="hover:text-primary">Catálogo</Link></li>
            <li><Link to="/servicos" className="hover:text-primary">Serviços</Link></li>
            <li><Link to="/sobre" className="hover:text-primary">Sobre</Link></li>
            <li><Link to="/contato" className="hover:text-primary">Contato</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider">Contato</h4>
          <ul className="mt-4 space-y-2 text-sm text-graphite-foreground/70">
            <li><a href={whatsappLink("Olá! Vim pelo site.")} className="hover:text-primary">WhatsApp</a></li>
            <li><a href={`mailto:${EMAIL}`} className="hover:text-primary">{EMAIL}</a></li>
            <li><a href={INSTAGRAM} className="hover:text-primary">Instagram</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-graphite-foreground/50">
        <div>© {new Date().getFullYear()} Gonza3DLab. Todos os direitos reservados.</div>
        <div className="mt-2">
          {isAdmin ? (
            <Link to="/admin" className="inline-flex items-center gap-1 hover:text-primary">
              <Lock className="h-3 w-3" /> Painel admin
            </Link>
          ) : !user ? (
            <Link to="/auth" className="inline-flex items-center gap-1 hover:text-primary">
              <Lock className="h-3 w-3" /> Acesso admin
            </Link>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
