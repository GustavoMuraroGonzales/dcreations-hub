import { Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { EMAIL, INSTAGRAM, whatsappLink } from "@/lib/contact";
import { useIsAdmin } from "@/lib/auth";
import mark from "@/assets/gonza3dlab-mark.png.asset.json";

export function Footer() {
  const { isAdmin, user } = useIsAdmin();
  return (
    <footer className="mt-24 border-t border-border bg-muted/30">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4 md:px-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 font-display text-xl font-bold tracking-tight">
            <img src={mark.url} alt="Gonza3DLab" width={36} height={36} className="h-9 w-auto" />
            <span>Gonza<span className="text-primary">3D</span>Lab</span>
          </div>

          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            Impressão 3D sob demanda: miniaturas, peças técnicas, personalizados e protótipos com qualidade e precisão.
          </p>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">Navegar</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li><Link to="/catalogo" className="transition-colors hover:text-primary">Catálogo</Link></li>
            <li><Link to="/servicos" className="transition-colors hover:text-primary">Serviços</Link></li>
            <li><Link to="/sobre" className="transition-colors hover:text-primary">Sobre</Link></li>
            <li><Link to="/contato" className="transition-colors hover:text-primary">Contato</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">Contato</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li><a href={whatsappLink("Olá! Vim pelo site.")} className="transition-colors hover:text-primary">WhatsApp</a></li>
            <li><a href={`mailto:${EMAIL}`} className="transition-colors hover:text-primary">{EMAIL}</a></li>
            <li><a href={INSTAGRAM} className="transition-colors hover:text-primary">Instagram</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        <div>© {new Date().getFullYear()} Gonza3DLab. Todos os direitos reservados.</div>
        <div className="mt-2">
          {isAdmin ? (
            <Link to="/admin" className="inline-flex items-center gap-1 transition-colors hover:text-primary">
              <Lock className="h-3 w-3" /> Painel admin
            </Link>
          ) : !user ? (
            <Link to="/auth" className="inline-flex items-center gap-1 transition-colors hover:text-primary">
              <Lock className="h-3 w-3" /> Acesso admin
            </Link>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
