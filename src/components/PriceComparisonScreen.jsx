import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Calendar,
  Store,
  Package
} from 'lucide-react';
import { usePriceComparison, useProducts } from '../hooks/useDatabase.js';

const PriceComparisonScreen = () => {
  const { 
    comparisons, 
    getAllComparisons, 
    getProductsWithPriceIncrease, 
    getProductsWithPriceDecrease 
  } = usePriceComparison();
  
  const { products } = useProducts();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTrend, setFilterTrend] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('percentage');

  useEffect(() => {
    getAllComparisons();
  }, [getAllComparisons]);

  // Filtrar comparações
  const filteredComparisons = comparisons.filter(comparison => {
    const matchesSearch = comparison.product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTrend = filterTrend === 'all' || comparison.trend === filterTrend;
    const matchesCategory = selectedCategory === 'all' || comparison.product.category === selectedCategory;
    
    return matchesSearch && matchesTrend && matchesCategory;
  });

  // Ordenar comparações
  const sortedComparisons = [...filteredComparisons].sort((a, b) => {
    switch (sortBy) {
      case 'percentage':
        return Math.abs(b.percentageChange) - Math.abs(a.percentageChange);
      case 'difference':
        return Math.abs(b.difference) - Math.abs(a.difference);
      case 'name':
        return a.product.name.localeCompare(b.product.name);
      case 'price':
        return b.currentPrice - a.currentPrice;
      default:
        return 0;
    }
  });

  // Estatísticas
  const priceIncreases = getProductsWithPriceIncrease();
  const priceDecreases = getProductsWithPriceDecrease();
  const stableProducts = comparisons.filter(comp => comp.trend === 'stable');
  
  const averageIncrease = priceIncreases.length > 0 
    ? priceIncreases.reduce((sum, comp) => sum + comp.percentageChange, 0) / priceIncreases.length 
    : 0;
    
  const averageDecrease = priceDecreases.length > 0 
    ? Math.abs(priceDecreases.reduce((sum, comp) => sum + comp.percentageChange, 0) / priceDecreases.length)
    : 0;

  // Obter categorias únicas
  const categories = [...new Set(products.map(product => product.category))];

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'increase':
        return <TrendingUp size={16} className="text-red-600" />;
      case 'decrease':
        return <TrendingDown size={16} className="text-green-600" />;
      default:
        return <Minus size={16} className="text-muted-foreground" />;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'increase':
        return 'text-red-600';
      case 'decrease':
        return 'text-green-600';
      default:
        return 'text-muted-foreground';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      {/* Estatísticas de Tendências */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Produtos Analisados</p>
                <p className="text-2xl font-bold text-foreground">{comparisons.length}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Preços Aumentaram</p>
                <p className="text-2xl font-bold text-red-600">{priceIncreases.length}</p>
                {averageIncrease > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Média: +{averageIncrease.toFixed(1)}%
                  </p>
                )}
              </div>
              <TrendingUp className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Preços Diminuíram</p>
                <p className="text-2xl font-bold text-green-600">{priceDecreases.length}</p>
                {averageDecrease > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Média: -{averageDecrease.toFixed(1)}%
                  </p>
                )}
              </div>
              <TrendingDown className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Preços Estáveis</p>
                <p className="text-2xl font-bold text-muted-foreground">{stableProducts.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Busca */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter size={20} />
            Filtros e Ordenação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Buscar Produto</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar produtos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Tendência</label>
              <select
                value={filterTrend}
                onChange={(e) => setFilterTrend(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="all">Todas as tendências</option>
                <option value="increase">Preços aumentaram</option>
                <option value="decrease">Preços diminuíram</option>
                <option value="stable">Preços estáveis</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Categoria</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="all">Todas as categorias</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Ordenar por</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="percentage">Maior variação %</option>
                <option value="difference">Maior diferença R$</option>
                <option value="name">Nome do produto</option>
                <option value="price">Preço atual</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <Button 
                onClick={getAllComparisons}
                className="w-full"
              >
                Atualizar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alertas de Preços */}
      {(priceIncreases.length > 0 || priceDecreases.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {priceIncreases.length > 0 && (
            <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                  <AlertTriangle size={20} />
                  Alertas de Aumento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {priceIncreases.slice(0, 3).map(comparison => (
                    <div key={comparison.product.id} className="flex items-center justify-between text-sm">
                      <span className="font-medium">{comparison.product.name}</span>
                      <span className="text-red-600 font-bold">
                        +{comparison.percentageChange.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                  {priceIncreases.length > 3 && (
                    <p className="text-xs text-muted-foreground">
                      +{priceIncreases.length - 3} outros produtos
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {priceDecreases.length > 0 && (
            <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <CheckCircle size={20} />
                  Oportunidades de Economia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {priceDecreases.slice(0, 3).map(comparison => (
                    <div key={comparison.product.id} className="flex items-center justify-between text-sm">
                      <span className="font-medium">{comparison.product.name}</span>
                      <span className="text-green-600 font-bold">
                        {comparison.percentageChange.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                  {priceDecreases.length > 3 && (
                    <p className="text-xs text-muted-foreground">
                      +{priceDecreases.length - 3} outros produtos
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Lista de Comparações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Comparação de Preços ({sortedComparisons.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sortedComparisons.length === 0 ? (
            <div className="text-center py-8">
              <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchQuery ? 'Nenhum produto encontrado' : 'Nenhuma comparação disponível'}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {searchQuery 
                  ? 'Tente buscar por outro termo' 
                  : 'Adicione produtos e registre compras para ver comparações de preços'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedComparisons.map(comparison => (
                <div 
                  key={comparison.product.id} 
                  className="flex items-center gap-4 p-4 border border-border rounded-lg bg-background hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-foreground">{comparison.product.name}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {comparison.product.category}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Preço Atual</p>
                        <p className="font-bold text-lg text-foreground">
                          R$ {comparison.currentPrice.toFixed(2)}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-muted-foreground">Preço Anterior</p>
                        <p className="font-medium text-foreground">
                          R$ {comparison.previousPrice.toFixed(2)}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-muted-foreground">Variação</p>
                        <div className="flex items-center gap-2">
                          {getTrendIcon(comparison.trend)}
                          <span className={`font-bold ${getTrendColor(comparison.trend)}`}>
                            {comparison.percentageChange > 0 ? '+' : ''}
                            {comparison.percentageChange.toFixed(1)}%
                          </span>
                          <span className={`text-sm ${getTrendColor(comparison.trend)}`}>
                            (R$ {comparison.difference > 0 ? '+' : ''}
                            {comparison.difference.toFixed(2)})
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Package size={12} />
                        {comparison.product.priceHistory.length} registros de preço
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        Última atualização: {formatDate(comparison.product.updatedAt)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getTrendColor(comparison.trend)}`}>
                      {comparison.trend === 'increase' ? '↗' : 
                       comparison.trend === 'decrease' ? '↘' : '→'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PriceComparisonScreen;

