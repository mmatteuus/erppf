import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, ShoppingCart, User, Truck, CreditCard, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useERPStore } from '@/store/mockData';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

const steps = [
  { id: 1, title: 'Cliente', icon: User },
  { id: 2, title: 'Produtos', icon: ShoppingCart },
  { id: 3, title: 'Entrega', icon: Truck },
  { id: 4, title: 'Pagamento', icon: CreditCard },
  { id: 5, title: 'Revisão', icon: FileText },
];

export default function NewSalesOrder() {
  const navigate = useNavigate();
  const { customers, products, addSalesOrder } = useERPStore();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form state
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [cardMessage, setCardMessage] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryWindow, setDeliveryWindow] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [isPaid, setIsPaid] = useState(false);

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);
  const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const addProduct = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const existing = orderItems.find((item) => item.productId === productId);
    if (existing) {
      setOrderItems(
        orderItems.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setOrderItems([
        ...orderItems,
        { productId, productName: product.name, quantity: 1, price: product.price },
      ]);
    }
  };

  const removeProduct = (productId: string) => {
    setOrderItems(orderItems.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeProduct(productId);
      return;
    }
    setOrderItems(
      orderItems.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!selectedCustomerId;
      case 2:
        return orderItems.length > 0;
      case 3:
        return !!deliveryDate && !!deliveryAddress;
      case 4:
        return !!paymentMethod;
      default:
        return true;
    }
  };

  const handleSubmit = () => {
    addSalesOrder({
      customerId: selectedCustomerId,
      customerName: selectedCustomer?.name || '',
      items: orderItems,
      total,
      status: 'new',
      deliveryDate,
      deliveryWindow,
      deliveryAddress,
      cardMessage: cardMessage || undefined,
      paymentStatus: isPaid ? 'paid' : 'pending',
    });

    toast({
      title: 'Pedido criado!',
      description: 'O pedido foi criado com sucesso.',
    });

    navigate('/sales/orders');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/sales/orders')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Novo Pedido</h1>
          <p className="text-muted-foreground">Crie um novo pedido de venda</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                  currentStep === step.id
                    ? 'bg-primary text-primary-foreground'
                    : currentStep > step.id
                    ? 'bg-success text-success-foreground'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {currentStep > step.id ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>
              <span
                className={cn(
                  'text-xs mt-1 hidden sm:block',
                  currentStep === step.id ? 'text-primary font-medium' : 'text-muted-foreground'
                )}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'h-0.5 w-8 sm:w-16 mx-2',
                  currentStep > step.id ? 'bg-success' : 'bg-muted'
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
          <CardDescription>
            {currentStep === 1 && 'Selecione o cliente para este pedido'}
            {currentStep === 2 && 'Adicione os produtos ao pedido'}
            {currentStep === 3 && 'Configure a entrega'}
            {currentStep === 4 && 'Defina a forma de pagamento'}
            {currentStep === 5 && 'Revise e confirme o pedido'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Step 1: Customer */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Cliente</Label>
                <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name} - {customer.phone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedCustomer && (
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="font-medium">{selectedCustomer.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedCustomer.email}</p>
                  <p className="text-sm text-muted-foreground">{selectedCustomer.phone}</p>
                  <p className="text-sm text-muted-foreground mt-2">{selectedCustomer.address}</p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Products */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Adicionar Produto</Label>
                <Select onValueChange={addProduct}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um produto" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} - R$ {product.price.toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {orderItems.length > 0 && (
                <div className="space-y-2">
                  <Label>Itens do Pedido</Label>
                  <div className="space-y-2">
                    {orderItems.map((item) => (
                      <div
                        key={item.productId}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.productName}</p>
                          <p className="text-xs text-muted-foreground">
                            R$ {item.price.toFixed(2)} cada
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between pt-4 border-t">
                    <span className="font-medium">Total</span>
                    <span className="font-bold text-lg">
                      R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Mensagem do Cartão (opcional)</Label>
                <Textarea
                  value={cardMessage}
                  onChange={(e) => setCardMessage(e.target.value)}
                  placeholder="Escreva uma mensagem para o cartão..."
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Step 3: Delivery */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Data de Entrega</Label>
                <Input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Horário</Label>
                <Select
                  value={deliveryWindow}
                  onValueChange={(v) =>
                    setDeliveryWindow(v as "morning" | "afternoon" | "evening")
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Manhã (8h - 12h)</SelectItem>
                    <SelectItem value="afternoon">Tarde (12h - 18h)</SelectItem>
                    <SelectItem value="evening">Noite (18h - 21h)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Endereço de Entrega</Label>
                <Textarea
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Endereço completo..."
                  rows={3}
                />
                {selectedCustomer && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeliveryAddress(selectedCustomer.address)}
                  >
                    Usar endereço do cliente
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Payment */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Forma de Pagamento</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pix">PIX</SelectItem>
                    <SelectItem value="credit">Cartão de Crédito</SelectItem>
                    <SelectItem value="debit">Cartão de Débito</SelectItem>
                    <SelectItem value="cash">Dinheiro</SelectItem>
                    <SelectItem value="invoice">Faturado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPaid"
                  checked={isPaid}
                  onCheckedChange={(checked) => setIsPaid(checked as boolean)}
                />
                <Label htmlFor="isPaid">Pagamento confirmado</Label>
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Cliente</p>
                  <p className="font-medium">{selectedCustomer?.name}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="font-bold text-lg">
                    R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Data de Entrega</p>
                  <p className="font-medium">
                    {deliveryDate && new Date(deliveryDate + 'T12:00:00').toLocaleDateString('pt-BR')}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {deliveryWindow === 'morning'
                      ? 'Manhã'
                      : deliveryWindow === 'afternoon'
                      ? 'Tarde'
                      : 'Noite'}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Pagamento</p>
                  <p className="font-medium capitalize">{paymentMethod}</p>
                  <p className="text-xs text-muted-foreground">
                    {isPaid ? 'Pago' : 'Pendente'}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground mb-2">Itens</p>
                {orderItems.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm py-1">
                    <span>
                      {item.quantity}x {item.productName}
                    </span>
                    <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {cardMessage && (
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Mensagem do Cartão</p>
                  <p className="text-sm italic">"{cardMessage}"</p>
                </div>
              )}

              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Endereço de Entrega</p>
                <p className="text-sm">{deliveryAddress}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between max-w-2xl mx-auto">
        <Button
          variant="outline"
          onClick={() => setCurrentStep((s) => s - 1)}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        {currentStep < 5 ? (
          <Button onClick={() => setCurrentStep((s) => s + 1)} disabled={!canProceed()}>
            Próximo
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} className="gap-2">
            <Check className="h-4 w-4" />
            Criar Pedido
          </Button>
        )}
      </div>
    </div>
  );
}
