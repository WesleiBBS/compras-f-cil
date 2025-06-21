import React, { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { 
  Plus, 
  Package, 
  Search,
  Edit3,
  Trash2,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { useProducts } from '../hooks/useDatabase.js';

const AddProductScreen = () => {
  const { products, addProduct, updateProduct, deleteProduct, searchProducts } = useProducts();
  
  const [productName, setProductName] = useState('');
  const [productCategory, setProductCategory] = useState('Geral');
  const [productPrice, setProductPrice] = useState('');
  const [productStore, setProductStore] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);

  const handleAddProduct = () => {
    if (!productName.trim()) return;

    const productData = {
      name: productName.trim(),
      category: productCategory,
      price: parseFloat(productPrice) || 0,
      store: productStore.trim()
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      setEditingProduct(null);
    } else {
      addProduct(productData);
    }

    // Limpar formulário
    setProductName('');
    setProductCategory('Geral');
    setProductPrice('');
    setProductStore('');
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductName(product.name);
    setProductCategory(product.category);
    setProductPrice(product.lastPrice.toString());
    setProductStore(product.priceHistory[product.priceHistory.length - 1]?.store || '');
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setProductName('');
    setProductCategory('Geral');
    setProductPrice('');
    setProductStore('');
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      deleteProduct(productId);
    }
  };

  const filteredProducts = searchQuery ? searchProducts(searchQuery) : products;

  const categories = [...new Set(products.map(product => product.category))];

  const getPriceChange = (product) => {
    if (product.priceHistory.length < 2) return null;
    
    const sortedHistory = product.priceHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
    const currentPrice = sortedHistory[0].price;
    const previousPrice = sortedHistory[1].price;
    const change = currentPrice - previousPrice;
    const percentage = ((change / previousPrice) * 100).toFixed(1);
    
    return {
      change,
      percentage: parseFloat(percentage),
      trend: change > 0 ? 'increase' : change < 0 ? 'decrease' : 'stable'
    };
  };

  return (
    <div className="space-y-6">
      {/* Formulário de Adicionar/Editar Produto */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package size={20} />
            {editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nome do Produto</label>
              <Input
                placeholder="Ex: Arroz Integral 1kg"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Categoria</label>
              <select
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="Geral">Geral</option>
                <option value="Alimentação">Alimentação</option>
                <option value="Limpeza">Limpeza</option>
                <option value="Higiene">Higiene</option>
                <option value="Bebidas">Bebidas</option>
                <option value="Carnes">Carnes</option>
                <option value="Laticínios">Laticínios</option>
                <option value="Frutas">Frutas</option>
                <option value="Verduras">Verduras</option>
                <option value="Padaria">Padaria</option>
                <option value="Congelados">Congelados</option>
                <option value="Doces">Doces</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Preço Atual (R$)</label>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Loja/Mercado</label>
              <Input
                placeholder="Ex: Supermercado ABC"
                value={productStore}
                onChange={(e) => setProductStore(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleAddProduct}
              className="flex-1"
              disabled={!productName.trim()}
            >
              <Plus size={16} className="mr-2" />
              {editingProduct ? 'Atualizar Produto' : 'Adicionar Produto'}
            </Button>
            {editingProduct && (
              <Button 
                variant="outline" 
                onClick={handleCancelEdit}
              >
                Cancelar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Busca e Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar produtos cadastrados..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Lista de Produtos Cadastrados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Produtos Cadastrados ({filteredProducts.length})</span>
            <Badge variant="outline">
              {categories.length} categorias
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchQuery ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {searchQuery ? 'Tente buscar por outro termo' : 'Adicione produtos para começar a comparar preços'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredProducts.map(product => {
                const priceChange = getPriceChange(product);
                return (
                  <div 
                    key={product.id} 
                    className="flex items-center gap-3 p-4 border border-border rounded-lg bg-background hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-foreground">{product.name}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {product.category}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="font-medium text-lg text-foreground">
                          R$ {product.lastPrice.toFixed(2)}
                        </span>
                        
                        {priceChange && (
                          <div className={`flex items-center gap-1 ${
                            priceChange.trend === 'increase' ? 'text-red-600' : 
                            priceChange.trend === 'decrease' ? 'text-green-600' : 
                            'text-muted-foreground'
                          }`}>
                            {priceChange.trend === 'increase' ? (
                              <TrendingUp size={14} />
                            ) : priceChange.trend === 'decrease' ? (
                              <TrendingDown size={14} />
                            ) : (
                              <Minus size={14} />
                            )}
                            <span className="text-xs">
                              {priceChange.percentage > 0 ? '+' : ''}{priceChange.percentage}%
                            </span>
                          </div>
                        )}
                        
                        <span>{product.priceHistory.length} preço(s) registrado(s)</span>
                        
                        {product.priceHistory[product.priceHistory.length - 1]?.store && (
                          <span>
                            Última compra: {product.priceHistory[product.priceHistory.length - 1].store}
                          </span>
                        )}
                      </div>
                      
                      <div className="text-xs text-muted-foreground mt-1">
                        Atualizado em: {new Date(product.updatedAt).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditProduct(product)}
                        className="text-primary hover:text-primary"
                      >
                        <Edit3 size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Estatísticas Rápidas */}
      {products.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total de Produtos</p>
                  <p className="text-2xl font-bold text-foreground">{products.length}</p>
                </div>
                <Package className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Categorias</p>
                  <p className="text-2xl font-bold text-foreground">{categories.length}</p>
                </div>
                <Badge className="h-8 w-8 rounded-full flex items-center justify-center">
                  {categories.length}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Preço Médio</p>
                  <p className="text-2xl font-bold text-foreground">
                    R$ {(products.reduce((sum, p) => sum + p.lastPrice, 0) / products.length).toFixed(2)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AddProductScreen;

