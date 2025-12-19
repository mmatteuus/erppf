import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function Branding() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Branding</h1>
        <p className="text-muted-foreground">Logo, cores e assinatura</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Identidade</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>URL do logo</Label>
            <Input placeholder="/logo.png" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Cor primária</Label>
              <Input type="color" defaultValue="#e11d48" />
            </div>
            <div className="space-y-2">
              <Label>Cor de fundo</Label>
              <Input type="color" defaultValue="#ffffff" />
            </div>
          </div>
          <Button>Salvar</Button>
        </CardContent>
      </Card>
    </div>
  );
}
