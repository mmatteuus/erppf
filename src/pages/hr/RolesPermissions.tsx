import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';

const roles = [
  { name: 'Admin', permissions: ['Tudo', 'Configurações', 'Financeiro'] },
  { name: 'Vendas', permissions: ['Pedidos', 'Clientes', 'Assinaturas'] },
  { name: 'Estoque', permissions: ['Inventário', 'Reabastecimento', 'Lotes'] },
];

export default function RolesPermissions() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Papéis & Permissões</h1>
          <p className="text-muted-foreground">Controles básicos para demo</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {roles.map((role) => (
          <Card key={role.name} className="card-hover">
            <CardHeader className="flex items-center gap-2 pb-2">
              <Shield className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">{role.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {role.permissions.map((perm) => (
                <Badge key={perm} variant="outline">
                  {perm}
                </Badge>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
