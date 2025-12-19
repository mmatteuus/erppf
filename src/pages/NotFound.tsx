import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-muted px-4">
      <div className="text-4xl font-bold">404</div>
      <p className="text-muted-foreground text-center">
        Rota nao encontrada. Verifique o menu ou volte ao PDV.
      </p>
      <div className="flex gap-2">
        <Button asChild>
          <Link to="/pdv/sell">Ir para PDV</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/reports">Relatorios</Link>
        </Button>
      </div>
    </div>
  );
}
