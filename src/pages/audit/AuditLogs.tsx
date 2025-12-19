import { useState } from 'react';
import { Search, Filter, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useERPStore } from '@/store/mockData';

export default function AuditLogs() {
  const { auditLogs } = useERPStore();
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState<string>('all');

  const modules = [...new Set(auditLogs.map((log) => log.module))];

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.userName.toLowerCase().includes(search.toLowerCase());
    const matchesModule = moduleFilter === 'all' || log.module === moduleFilter;
    return matchesSearch && matchesModule;
  });

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('pt-BR'),
      time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const getModuleColor = (module: string) => {
    const colors: Record<string, string> = {
      Vendas: 'bg-blue-100 text-blue-700 border-blue-200',
      Estoque: 'bg-amber-100 text-amber-700 border-amber-200',
      Compras: 'bg-purple-100 text-purple-700 border-purple-200',
      Produção: 'bg-green-100 text-green-700 border-green-200',
      Financeiro: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      Produtos: 'bg-rose-100 text-rose-700 border-rose-200',
    };
    return colors[module] || 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Auditoria</h1>
        <p className="text-muted-foreground">Histórico de ações e alterações no sistema</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar ação, usuário ou detalhe..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={moduleFilter} onValueChange={setModuleFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Módulo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os módulos</SelectItem>
            {modules.map((module) => (
              <SelectItem key={module} value={module}>
                {module}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Timeline de Eventos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

            <div className="space-y-6">
              {filteredLogs.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum registro encontrado
                </p>
              ) : (
                filteredLogs.slice(0, 50).map((log, index) => {
                  const { date, time } = formatDate(log.timestamp);
                  return (
                    <div key={log.id} className="relative pl-10">
                      {/* Timeline dot */}
                      <div className="absolute left-2.5 w-3 h-3 rounded-full bg-primary border-2 border-background" />

                      <div className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge variant="outline" className={getModuleColor(log.module)}>
                            {log.module}
                          </Badge>
                          <span className="font-medium text-sm">{log.action}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{log.details}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>por {log.userName}</span>
                          <span>•</span>
                          <span>{date} às {time}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
