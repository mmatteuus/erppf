import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Package, Eye, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useERPStore, ProductType } from '@/store/mockData';
import { toast } from '@/hooks/use-toast';

const typeLabels: Record<ProductType, string> = {
  flower: 'Flor',
  gift: 'Presente',
  basket: 'Cesta',
  addon: 'Adicional',
  service: 'Serviço',
};

const typeColors: Record<ProductType, string> = {
  flower: 'bg-rose-100 text-rose-700 border-rose-200',
  gift: 'bg-purple-100 text-purple-700 border-purple-200',
  basket: 'bg-amber-100 text-amber-700 border-amber-200',
  addon: 'bg-blue-100 text-blue-700 border-blue-200',
  service: 'bg-slate-100 text-slate-700 border-slate-200',
};

export default function ProductsCatalog() {
  const navigate = useNavigate();
  const { products } = useERPStore();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const categories = [...new Set(products.map((p) => p.category))];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || product.type === typeFilter;
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesType && matchesCategory;
  });

  const handleDelete = (productId: string) => {
    toast({
      title: 'Produto removido',
      description: 'O produto foi removido do catálogo.',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Catálogo de Produtos</h1>
          <p className="text-muted-foreground">Gerencie flores, presentes, cestas e serviços</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Produto
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {(['flower', 'gift', 'basket', 'addon', 'service'] as ProductType[]).map((type) => (
          <Card key={type} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setTypeFilter(type)}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${typeColors[type].replace('text-', 'bg-').split(' ')[0]}`}>
                  <Package className={`h-5 w-5 ${typeColors[type].split(' ')[1]}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {products.filter((p) => p.type === type).length}
                  </p>
                  <p className="text-xs text-muted-foreground">{typeLabels[type]}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar produtos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="flower">Flores</SelectItem>
            <SelectItem value="gift">Presentes</SelectItem>
            <SelectItem value="basket">Cestas</SelectItem>
            <SelectItem value="addon">Adicionais</SelectItem>
            <SelectItem value="service">Serviços</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas categorias</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            Nenhum produto encontrado
          </div>
        ) : (
          filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden card-hover">
              <div className="aspect-square bg-muted relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <Badge variant="outline" className={`absolute top-2 left-2 ${typeColors[product.type]}`}>
                  {typeLabels[product.type]}
                </Badge>
                {product.isPerishable && (
                  <Badge variant="outline" className="absolute top-2 right-2 badge-warning">
                    Perecível
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{product.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{product.description}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        Ver Detalhes
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold">
                      R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Custo: R$ {product.cost.toFixed(2)} | Margem: {product.margin}%
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={product.stock > product.minStock ? 'badge-success' : 'badge-danger'}
                  >
                    {product.stock} un.
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
