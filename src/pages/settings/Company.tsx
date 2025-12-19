import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function CompanySettings() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Empresa</h1>
        <p className="text-muted-foreground">Dados básicos para notas e branding</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Razão social</Label>
              <Input placeholder="Vila Bella Flores LTDA" />
            </div>
            <div className="space-y-2">
              <Label>CNPJ</Label>
              <Input placeholder="00.000.000/0001-00" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Endereço</Label>
              <Input placeholder="Rua das Flores, 123 - São Paulo/SP" />
            </div>
          </div>
          <Button>Salvar</Button>
        </CardContent>
      </Card>
    </div>
  );
}
