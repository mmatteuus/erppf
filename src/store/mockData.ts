// Vila Bella ERP - Mock Data Store
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export type ProductType = 'flower' | 'gift' | 'basket' | 'addon' | 'service';
export type OrderStatus = 'new' | 'separation' | 'production' | 'ready' | 'in_route' | 'delivered' | 'cancelled' | 'failed';
export type PurchaseStatus = 'draft' | 'pending_approval' | 'approved' | 'received' | 'invoiced';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  tags: string[];
  address: string;
  city: string;
  importantDates: { label: string; date: string }[];
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  type: ProductType;
  category: string;
  description: string;
  price: number;
  cost: number;
  margin: number;
  stock: number;
  minStock: number;
  image: string;
  isPerishable: boolean;
  variations?: { name: string; price: number }[];
  crossSell?: string[];
}

export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  batch: string;
  quantity: number;
  expiryDate?: string;
  warehouse: string;
  location: string;
  lastUpdated: string;
}

export interface Vendor {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  category: string;
  sla: string;
  rating: number;
}

export interface SalesOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  items: { productId: string; productName: string; quantity: number; price: number }[];
  total: number;
  status: OrderStatus;
  deliveryDate: string;
  deliveryWindow: 'morning' | 'afternoon' | 'evening';
  deliveryAddress: string;
  cardMessage?: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  vendorId: string;
  vendorName: string;
  items: { productId: string; productName: string; quantity: number; unitCost: number }[];
  total: number;
  status: PurchaseStatus;
  expectedDate: string;
  createdAt: string;
}

export interface WorkOrder {
  id: string;
  orderNumber: string;
  productId: string;
  productName: string;
  quantity: number;
  status: 'pending' | 'in_progress' | 'quality_check' | 'completed';
  salesOrderId?: string;
  bom: { itemId: string; itemName: string; quantity: number }[];
  assignedTo: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface Delivery {
  id: string;
  salesOrderId: string;
  driverId: string;
  driverName: string;
  status: 'scheduled' | 'in_route' | 'delivered' | 'failed';
  scheduledTime: string;
  address: string;
  notes?: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'sales' | 'inventory' | 'finance' | 'delivery' | 'production';
  department: string;
  phone: string;
  hiredAt: string;
  isActive: boolean;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  module: string;
  details: string;
  timestamp: string;
}

export interface Invoice {
  id: string;
  number: string;
  type: 'receivable' | 'payable';
  entityId: string;
  entityName: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  createdAt: string;
}

// Initial Mock Data
const generateId = () => Math.random().toString(36).substr(2, 9);

const mockCustomers: Customer[] = [
  { id: '1', name: 'Maria Silva', email: 'maria@email.com', phone: '(11) 99999-1111', tags: ['VIP', 'Corporativo'], address: 'Rua das Flores, 123', city: 'São Paulo', importantDates: [{ label: 'Aniversário', date: '1985-03-15' }], createdAt: '2024-01-15' },
  { id: '2', name: 'João Santos', email: 'joao@email.com', phone: '(11) 99999-2222', tags: ['Recorrente'], address: 'Av. Brasil, 456', city: 'São Paulo', importantDates: [{ label: 'Casamento', date: '2020-06-20' }], createdAt: '2024-02-10' },
  { id: '3', name: 'Ana Costa', email: 'ana@email.com', phone: '(11) 99999-3333', tags: ['Novo'], address: 'Rua Augusta, 789', city: 'São Paulo', importantDates: [], createdAt: '2024-03-05' },
  { id: '4', name: 'Carlos Oliveira', email: 'carlos@empresa.com', phone: '(11) 99999-4444', tags: ['Corporativo', 'VIP'], address: 'Av. Paulista, 1000', city: 'São Paulo', importantDates: [], createdAt: '2024-01-20' },
  { id: '5', name: 'Fernanda Lima', email: 'fernanda@email.com', phone: '(11) 99999-5555', tags: ['Recorrente'], address: 'Rua Oscar Freire, 200', city: 'São Paulo', importantDates: [{ label: 'Aniversário', date: '1990-09-12' }], createdAt: '2024-02-28' },
];

const mockProducts: Product[] = [
  { id: '1', name: 'Buquê de Rosas Vermelhas', type: 'flower', category: 'Buquês', description: '12 rosas vermelhas premium', price: 149.90, cost: 45.00, margin: 70, stock: 25, minStock: 10, image: '/placeholder.svg', isPerishable: true, crossSell: ['7', '8'] },
  { id: '2', name: 'Arranjo Tropical', type: 'flower', category: 'Arranjos', description: 'Mix de flores tropicais', price: 189.90, cost: 55.00, margin: 71, stock: 15, minStock: 5, image: '/placeholder.svg', isPerishable: true },
  { id: '3', name: 'Orquídea Phalaenopsis', type: 'flower', category: 'Plantas', description: 'Orquídea branca em vaso', price: 129.90, cost: 40.00, margin: 69, stock: 20, minStock: 8, image: '/placeholder.svg', isPerishable: true },
  { id: '4', name: 'Cesta Café da Manhã Especial', type: 'basket', category: 'Cestas', description: 'Café, pães, frutas e doces', price: 259.90, cost: 85.00, margin: 67, stock: 10, minStock: 5, image: '/placeholder.svg', isPerishable: true },
  { id: '5', name: 'Cesta Romântica', type: 'basket', category: 'Cestas', description: 'Café da manhã com champagne', price: 349.90, cost: 120.00, margin: 66, stock: 8, minStock: 3, image: '/placeholder.svg', isPerishable: true },
  { id: '6', name: 'Kit Chocolate Premium', type: 'gift', category: 'Presentes', description: 'Caixa com 20 bombons artesanais', price: 89.90, cost: 35.00, margin: 61, stock: 30, minStock: 15, image: '/placeholder.svg', isPerishable: false },
  { id: '7', name: 'Pelúcia Urso Grande', type: 'gift', category: 'Pelúcias', description: 'Urso de pelúcia 50cm', price: 79.90, cost: 25.00, margin: 69, stock: 18, minStock: 8, image: '/placeholder.svg', isPerishable: false },
  { id: '8', name: 'Balão Metalizado Coração', type: 'addon', category: 'Adicionais', description: 'Balão metalizado formato coração', price: 29.90, cost: 8.00, margin: 73, stock: 50, minStock: 20, image: '/placeholder.svg', isPerishable: false },
  { id: '9', name: 'Cartão Premium Personalizado', type: 'service', category: 'Serviços', description: 'Cartão com caligrafia especial', price: 19.90, cost: 5.00, margin: 75, stock: 100, minStock: 30, image: '/placeholder.svg', isPerishable: false },
  { id: '10', name: 'Entrega Expressa', type: 'service', category: 'Serviços', description: 'Entrega em até 2 horas', price: 39.90, cost: 15.00, margin: 62, stock: 999, minStock: 0, image: '/placeholder.svg', isPerishable: false },
  { id: '11', name: 'Buquê de Girassóis', type: 'flower', category: 'Buquês', description: '6 girassóis com folhagens', price: 119.90, cost: 35.00, margin: 71, stock: 12, minStock: 5, image: '/placeholder.svg', isPerishable: true },
  { id: '12', name: 'Arranjo de Mesa', type: 'flower', category: 'Arranjos', description: 'Arranjo baixo para centro de mesa', price: 159.90, cost: 50.00, margin: 69, stock: 8, minStock: 4, image: '/placeholder.svg', isPerishable: true },
];

const mockVendors: Vendor[] = [
  { id: '1', name: 'Flores do Campo Ltda', contact: 'Roberto Alves', email: 'vendas@floresdocampo.com', phone: '(11) 3333-1111', category: 'Flores', sla: '24h', rating: 4.8 },
  { id: '2', name: 'Chocolates Artesanais SA', contact: 'Patrícia Mendes', email: 'comercial@chocoart.com', phone: '(11) 3333-2222', category: 'Alimentos', sla: '48h', rating: 4.5 },
  { id: '3', name: 'Embalagens Express', contact: 'Marcos Lima', email: 'vendas@embalaexpress.com', phone: '(11) 3333-3333', category: 'Embalagens', sla: '72h', rating: 4.2 },
  { id: '4', name: 'Distribuidora Café Fino', contact: 'Luciana Torres', email: 'vendas@cafefino.com', phone: '(11) 3333-4444', category: 'Alimentos', sla: '24h', rating: 4.7 },
];

const mockSalesOrders: SalesOrder[] = [
  { id: '1', orderNumber: 'VB-2024-001', customerId: '1', customerName: 'Maria Silva', items: [{ productId: '1', productName: 'Buquê de Rosas Vermelhas', quantity: 1, price: 149.90 }, { productId: '8', productName: 'Balão Metalizado Coração', quantity: 2, price: 29.90 }], total: 209.70, status: 'delivered', deliveryDate: '2024-12-15', deliveryWindow: 'morning', deliveryAddress: 'Rua das Flores, 123', cardMessage: 'Com amor, sempre.', paymentStatus: 'paid', createdAt: '2024-12-14T10:00:00', updatedAt: '2024-12-15T11:30:00' },
  { id: '2', orderNumber: 'VB-2024-002', customerId: '2', customerName: 'João Santos', items: [{ productId: '4', productName: 'Cesta Café da Manhã Especial', quantity: 1, price: 259.90 }], total: 259.90, status: 'in_route', deliveryDate: '2024-12-19', deliveryWindow: 'morning', deliveryAddress: 'Av. Brasil, 456', paymentStatus: 'paid', createdAt: '2024-12-18T09:00:00', updatedAt: '2024-12-19T07:00:00' },
  { id: '3', orderNumber: 'VB-2024-003', customerId: '3', customerName: 'Ana Costa', items: [{ productId: '3', productName: 'Orquídea Phalaenopsis', quantity: 1, price: 129.90 }, { productId: '6', productName: 'Kit Chocolate Premium', quantity: 1, price: 89.90 }], total: 219.80, status: 'production', deliveryDate: '2024-12-20', deliveryWindow: 'afternoon', deliveryAddress: 'Rua Augusta, 789', cardMessage: 'Feliz aniversário!', paymentStatus: 'paid', createdAt: '2024-12-18T14:00:00', updatedAt: '2024-12-18T16:00:00' },
  { id: '4', orderNumber: 'VB-2024-004', customerId: '4', customerName: 'Carlos Oliveira', items: [{ productId: '2', productName: 'Arranjo Tropical', quantity: 5, price: 189.90 }], total: 949.50, status: 'new', deliveryDate: '2024-12-21', deliveryWindow: 'morning', deliveryAddress: 'Av. Paulista, 1000', paymentStatus: 'pending', createdAt: '2024-12-19T08:00:00', updatedAt: '2024-12-19T08:00:00' },
  { id: '5', orderNumber: 'VB-2024-005', customerId: '5', customerName: 'Fernanda Lima', items: [{ productId: '5', productName: 'Cesta Romântica', quantity: 1, price: 349.90 }, { productId: '7', productName: 'Pelúcia Urso Grande', quantity: 1, price: 79.90 }], total: 429.80, status: 'ready', deliveryDate: '2024-12-19', deliveryWindow: 'evening', deliveryAddress: 'Rua Oscar Freire, 200', cardMessage: 'Te amo!', paymentStatus: 'paid', createdAt: '2024-12-18T16:00:00', updatedAt: '2024-12-19T14:00:00' },
];

const mockInventoryItems: InventoryItem[] = [
  { id: '1', productId: '1', productName: 'Rosas Vermelhas', batch: 'LOT-2024-1215', quantity: 120, expiryDate: '2024-12-22', warehouse: 'Principal', location: 'A-01', lastUpdated: '2024-12-15' },
  { id: '2', productId: '2', productName: 'Flores Tropicais Mix', batch: 'LOT-2024-1216', quantity: 45, expiryDate: '2024-12-23', warehouse: 'Principal', location: 'A-02', lastUpdated: '2024-12-16' },
  { id: '3', productId: '3', productName: 'Orquídeas Brancas', batch: 'LOT-2024-1210', quantity: 20, expiryDate: '2024-12-30', warehouse: 'Principal', location: 'B-01', lastUpdated: '2024-12-10' },
  { id: '4', productId: '6', productName: 'Chocolates Artesanais', batch: 'LOT-2024-1201', quantity: 50, expiryDate: '2025-03-01', warehouse: 'Principal', location: 'C-01', lastUpdated: '2024-12-01' },
  { id: '5', productId: '7', productName: 'Pelúcia Urso Grande', batch: 'LOT-2024-1101', quantity: 18, warehouse: 'Principal', location: 'D-01', lastUpdated: '2024-11-01' },
  { id: '6', productId: '8', productName: 'Balões Metalizados', batch: 'LOT-2024-1115', quantity: 50, warehouse: 'Principal', location: 'D-02', lastUpdated: '2024-11-15' },
];

const mockPurchaseOrders: PurchaseOrder[] = [
  { id: '1', orderNumber: 'PC-2024-001', vendorId: '1', vendorName: 'Flores do Campo Ltda', items: [{ productId: '1', productName: 'Rosas Vermelhas (dúzia)', quantity: 20, unitCost: 35.00 }], total: 700.00, status: 'approved', expectedDate: '2024-12-20', createdAt: '2024-12-17' },
  { id: '2', orderNumber: 'PC-2024-002', vendorId: '2', vendorName: 'Chocolates Artesanais SA', items: [{ productId: '6', productName: 'Kit Chocolate Premium', quantity: 30, unitCost: 35.00 }], total: 1050.00, status: 'pending_approval', expectedDate: '2024-12-22', createdAt: '2024-12-18' },
  { id: '3', orderNumber: 'PC-2024-003', vendorId: '4', vendorName: 'Distribuidora Café Fino', items: [{ productId: '4', productName: 'Insumos Cesta Café', quantity: 15, unitCost: 60.00 }], total: 900.00, status: 'received', expectedDate: '2024-12-18', createdAt: '2024-12-16' },
];

const mockWorkOrders: WorkOrder[] = [
  { id: '1', orderNumber: 'OP-2024-001', productId: '1', productName: 'Buquê de Rosas Vermelhas', quantity: 5, status: 'completed', salesOrderId: '1', bom: [{ itemId: '1', itemName: 'Rosas Vermelhas', quantity: 60 }, { itemId: 'fita', itemName: 'Fita de Cetim', quantity: 5 }], assignedTo: 'Carla', startedAt: '2024-12-15T08:00:00', completedAt: '2024-12-15T10:00:00', createdAt: '2024-12-14' },
  { id: '2', orderNumber: 'OP-2024-002', productId: '4', productName: 'Cesta Café da Manhã Especial', quantity: 2, status: 'in_progress', salesOrderId: '2', bom: [{ itemId: 'cafe', itemName: 'Café Especial', quantity: 2 }, { itemId: 'paes', itemName: 'Pães Artesanais', quantity: 6 }], assignedTo: 'Roberto', startedAt: '2024-12-19T06:00:00', createdAt: '2024-12-18' },
  { id: '3', orderNumber: 'OP-2024-003', productId: '3', productName: 'Orquídea Phalaenopsis', quantity: 1, status: 'pending', salesOrderId: '3', bom: [{ itemId: '3', itemName: 'Orquídea', quantity: 1 }, { itemId: 'vaso', itemName: 'Vaso Decorativo', quantity: 1 }], assignedTo: 'Ana', createdAt: '2024-12-18' },
];

const mockEmployees: Employee[] = [
  { id: '1', name: 'Admin Sistema', email: 'admin@vilabella.com', role: 'admin', department: 'TI', phone: '(11) 99999-0000', hiredAt: '2020-01-01', isActive: true },
  { id: '2', name: 'Carla Florista', email: 'carla@vilabella.com', role: 'production', department: 'Produção', phone: '(11) 99999-0001', hiredAt: '2021-03-15', isActive: true },
  { id: '3', name: 'Roberto Cesta', email: 'roberto@vilabella.com', role: 'production', department: 'Produção', phone: '(11) 99999-0002', hiredAt: '2022-06-01', isActive: true },
  { id: '4', name: 'Ana Vendas', email: 'ana@vilabella.com', role: 'sales', department: 'Comercial', phone: '(11) 99999-0003', hiredAt: '2021-09-10', isActive: true },
  { id: '5', name: 'Pedro Entregador', email: 'pedro@vilabella.com', role: 'delivery', department: 'Logística', phone: '(11) 99999-0004', hiredAt: '2023-01-20', isActive: true },
  { id: '6', name: 'Marina Financeiro', email: 'marina@vilabella.com', role: 'finance', department: 'Financeiro', phone: '(11) 99999-0005', hiredAt: '2020-08-01', isActive: true },
];

const mockDeliveries: Delivery[] = [
  { id: '1', salesOrderId: '2', driverId: '5', driverName: 'Pedro Entregador', status: 'in_route', scheduledTime: '2024-12-19T08:00:00', address: 'Av. Brasil, 456', notes: 'Apartamento 501' },
  { id: '2', salesOrderId: '5', driverId: '5', driverName: 'Pedro Entregador', status: 'scheduled', scheduledTime: '2024-12-19T18:00:00', address: 'Rua Oscar Freire, 200' },
];

const mockInvoices: Invoice[] = [
  { id: '1', number: 'NF-2024-001', type: 'receivable', entityId: '1', entityName: 'Maria Silva', amount: 209.70, dueDate: '2024-12-20', status: 'paid', createdAt: '2024-12-15' },
  { id: '2', number: 'NF-2024-002', type: 'receivable', entityId: '2', entityName: 'João Santos', amount: 259.90, dueDate: '2024-12-25', status: 'pending', createdAt: '2024-12-18' },
  { id: '3', number: 'NF-2024-003', type: 'payable', entityId: '1', entityName: 'Flores do Campo Ltda', amount: 700.00, dueDate: '2024-12-27', status: 'pending', createdAt: '2024-12-17' },
  { id: '4', number: 'NF-2024-004', type: 'receivable', entityId: '4', entityName: 'Carlos Oliveira', amount: 949.50, dueDate: '2024-12-28', status: 'pending', createdAt: '2024-12-19' },
];

const generateAuditLogs = (): AuditLog[] => {
  const actions = [
    { action: 'Criou pedido', module: 'Vendas', details: 'Pedido VB-2024-001 criado' },
    { action: 'Atualizou estoque', module: 'Estoque', details: 'Entrada de 120 rosas vermelhas' },
    { action: 'Aprovou compra', module: 'Compras', details: 'PC-2024-001 aprovado' },
    { action: 'Concluiu produção', module: 'Produção', details: 'OP-2024-001 finalizada' },
    { action: 'Baixou pagamento', module: 'Financeiro', details: 'Recebimento de R$ 209,70' },
    { action: 'Cadastrou cliente', module: 'Vendas', details: 'Cliente Maria Silva cadastrado' },
    { action: 'Alterou preço', module: 'Produtos', details: 'Buquê de Rosas: R$ 149,90' },
    { action: 'Registrou perda', module: 'Estoque', details: '5 unidades descartadas' },
  ];

  const logs: AuditLog[] = [];
  for (let i = 0; i < 50; i++) {
    const action = actions[Math.floor(Math.random() * actions.length)];
    const employee = mockEmployees[Math.floor(Math.random() * mockEmployees.length)];
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    
    logs.push({
      id: generateId(),
      userId: employee.id,
      userName: employee.name,
      action: action.action,
      module: action.module,
      details: action.details,
      timestamp: date.toISOString(),
    });
  }
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// Store Interface
interface ERPStore {
  customers: Customer[];
  products: Product[];
  inventoryItems: InventoryItem[];
  vendors: Vendor[];
  salesOrders: SalesOrder[];
  purchaseOrders: PurchaseOrder[];
  workOrders: WorkOrder[];
  employees: Employee[];
  deliveries: Delivery[];
  invoices: Invoice[];
  auditLogs: AuditLog[];
  
  // Actions
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => void;
  addSalesOrder: (order: Omit<SalesOrder, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateInventory: (itemId: string, quantity: number) => void;
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
  approvePurchaseOrder: (orderId: string) => void;
  completeWorkOrder: (orderId: string) => void;
}

export const useERPStore = create<ERPStore>()(
  persist(
    (set, get) => ({
      customers: mockCustomers,
      products: mockProducts,
      inventoryItems: mockInventoryItems,
      vendors: mockVendors,
      salesOrders: mockSalesOrders,
      purchaseOrders: mockPurchaseOrders,
      workOrders: mockWorkOrders,
      employees: mockEmployees,
      deliveries: mockDeliveries,
      invoices: mockInvoices,
      auditLogs: generateAuditLogs(),

      addCustomer: (customer) => {
        const newCustomer: Customer = {
          ...customer,
          id: generateId(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ customers: [...state.customers, newCustomer] }));
        get().addAuditLog({ userId: '1', userName: 'Admin', action: 'Cadastrou cliente', module: 'Vendas', details: `Cliente ${customer.name} cadastrado` });
      },

      addSalesOrder: (order) => {
        const orderCount = get().salesOrders.length + 1;
        const newOrder: SalesOrder = {
          ...order,
          id: generateId(),
          orderNumber: `VB-2024-${String(orderCount).padStart(3, '0')}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ salesOrders: [...state.salesOrders, newOrder] }));
        get().addAuditLog({ userId: '1', userName: 'Admin', action: 'Criou pedido', module: 'Vendas', details: `Pedido ${newOrder.orderNumber} criado` });
      },

      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          salesOrders: state.salesOrders.map((order) =>
            order.id === orderId ? { ...order, status, updatedAt: new Date().toISOString() } : order
          ),
        }));
        const order = get().salesOrders.find((o) => o.id === orderId);
        if (order) {
          get().addAuditLog({ userId: '1', userName: 'Admin', action: 'Atualizou status', module: 'Vendas', details: `Pedido ${order.orderNumber} → ${status}` });
        }
      },

      addProduct: (product) => {
        const newProduct: Product = { ...product, id: generateId() };
        set((state) => ({ products: [...state.products, newProduct] }));
      },

      updateInventory: (itemId, quantity) => {
        set((state) => ({
          inventoryItems: state.inventoryItems.map((item) =>
            item.id === itemId ? { ...item, quantity, lastUpdated: new Date().toISOString().split('T')[0] } : item
          ),
        }));
      },

      addAuditLog: (log) => {
        const newLog: AuditLog = { ...log, id: generateId(), timestamp: new Date().toISOString() };
        set((state) => ({ auditLogs: [newLog, ...state.auditLogs] }));
      },

      approvePurchaseOrder: (orderId) => {
        set((state) => ({
          purchaseOrders: state.purchaseOrders.map((order) =>
            order.id === orderId ? { ...order, status: 'approved' } : order
          ),
        }));
        const order = get().purchaseOrders.find((o) => o.id === orderId);
        if (order) {
          get().addAuditLog({ userId: '1', userName: 'Admin', action: 'Aprovou compra', module: 'Compras', details: `${order.orderNumber} aprovado` });
        }
      },

      completeWorkOrder: (orderId) => {
        set((state) => ({
          workOrders: state.workOrders.map((order) =>
            order.id === orderId ? { ...order, status: 'completed', completedAt: new Date().toISOString() } : order
          ),
        }));
      },
    }),
    {
      name: 'vila-bella-erp-storage',
    }
  )
);
