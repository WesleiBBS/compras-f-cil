import React, { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { 
  History, 
  Calendar, 
  ShoppingBag,
  Store,
  TrendingUp,
  Filter,
  Search,
  Download,
  Eye,
  BarChart3
} from 'lucide-react';
import { usePurchaseHistory } from '../hooks/useDatabase.js';

const HistoryScreen = () => {
  const { 
    history, 
    getMonthlySpending, 
    getSpendingByStore, 
    getTopProducts 
  } = usePurchaseHistory();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedStore, setSelectedStore] = useState('all');
  const [expandedPurchase, setExpandedPurchase] = useState(null);

  // Filtrar histórico
  const filteredHistory = history.filter(purchase => {
    const purchaseDate = new Date(purchase.purchaseDate);
    const matchesSearch = purchase.listName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         purchase.store.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         purchase.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesMonth = selectedMonth === -1 || purchaseDate.getMonth() === selectedMonth;
    const matchesYear = purchaseDate.getFullYear() === selectedYear;
    const matchesStore = selectedStore === 'all' || purchase.store === selectedStore;
    
    return matchesSearch && matchesMonth && matchesYear && matchesStore;
  });

  // Estatísticas
  const monthlySpending = getMonthlySpending(selectedYear, selectedMonth);
  const spendingByStore = getSpendingByStore();
  const topProducts = getTopProducts(5);
  const totalSpent = history.reduce((sum, purchase) => sum + purchase.total, 0);
  const averagePurchase = history.length > 0 ? totalSpent / history.length : 0;

  // Obter lojas únicas
  const stores = [...new Set(history.map(purchase => purchase.store).filter(store => store))];

  // Meses para o filtro
  const months = [
    { value: -1, label: 'Todos os meses' },
    { value: 0, label: 'Janeiro' },
    { value: 1, label: 'Fevereiro' },
    { value: 2, label: 'Março' },
    { value: 3, label: 'Abril' },
    { value: 4, label: 'Maio' },
    { value: 5, label: 'Junho' },
    { value: 6, label: 'Julho' },
    { value: 7, label: 'Agosto' },
    { value: 8, label: 'Setembro' },
    { value: 9, label: 'Outubro' },
    { value: 10, label: 'Novembro' },
    { value: 11, label: 'Dezembro' }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportData = () => {
    const dataStr = JSON.stringify(filteredHistory, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `historico-compras-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Gasto</p>
                <p className="text-2xl font-bold text-foreground">
                  R$ {totalSpent.toFixed(2)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Compras Realizadas</p>
                <p className="text-2xl font-bold text-foreground">{history.length}</p>
              </div>
              <ShoppingBag className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ticket Médio</p>
                <p className="text-2xl font-bold text-foreground">
                  R$ {averagePurchase.toFixed(2)}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Este Mês</p>
                <p className="text-2xl font-bold text-foreground">
                  R$ {monthlySpending.toFixed(2)}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter size={20} />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar compras..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Mês</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                {months.map(month => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Ano</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value={2024}>2024</option>
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Loja</label>
              <select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="all">Todas as lojas</option>
                {stores.map(store => (
                  <option key={store} value={store}>{store}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <Button onClick={exportData} variant="outline" className="flex items-center gap-2">
              <Download size={16} />
              Exportar Dados
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Produtos Mais Comprados */}
      {topProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 size={20} />
              Produtos Mais Comprados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{product.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Comprado {product.count}x</span>
                      <span>Total gasto: R$ {product.totalSpent.toFixed(2)}</span>
                      <span>Preço médio: R$ {product.averagePrice.toFixed(2)}</span>
                    </div>
                  </div>
                  <Badge variant="secondary">{product.category}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Histórico de Compras */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <History size={20} />
              Histórico de Compras ({filteredHistory.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredHistory.length === 0 ? (
            <div className="text-center py-8">
              <History className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchQuery ? 'Nenhuma compra encontrada' : 'Nenhuma compra registrada'}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {searchQuery ? 'Tente buscar por outro termo' : 'Suas compras aparecerão aqui'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredHistory.map(purchase => (
                <div key={purchase.id} className="border border-border rounded-lg">
                  <div 
                    className="flex items-center gap-3 p-4 cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => setExpandedPurchase(
                      expandedPurchase === purchase.id ? null : purchase.id
                    )}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-foreground">{purchase.listName}</h4>
                        {purchase.store && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Store size={12} />
                            {purchase.store}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {formatDate(purchase.purchaseDate)}
                        </span>
                        <span>{purchase.items.length} itens</span>
                        <span className="font-medium text-lg text-foreground">
                          R$ {purchase.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    
                    <Button variant="ghost" size="sm">
                      <Eye size={16} />
                    </Button>
                  </div>
                  
                  {expandedPurchase === purchase.id && (
                    <div className="border-t border-border p-4 bg-muted/20">
                      <h5 className="font-medium mb-3">Itens Comprados:</h5>
                      <div className="space-y-2">
                        {purchase.items.map((item, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{item.name}</span>
                              <Badge variant="secondary" className="text-xs">
                                {item.category}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-muted-foreground">
                              <span>Qtd: {item.quantity}</span>
                              <span>R$ {item.price.toFixed(2)}</span>
                              <span className="font-medium text-foreground">
                                R$ {(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HistoryScreen;

