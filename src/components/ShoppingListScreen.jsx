import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Checkbox } from '@/components/ui/checkbox.jsx';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  ShoppingBag, 
  Calculator,
  Search,
  Filter,
  Check,
  X
} from 'lucide-react';
import { useShoppingLists, useProducts } from '../hooks/useDatabase.js';

const ShoppingListScreen = () => {
  const { 
    currentList, 
    addItemToCurrentList, 
    updateListItem, 
    removeItemFromCurrentList, 
    toggleItemCheck,
    getListTotal,
    getCheckedTotal,
    createList
  } = useShoppingLists();
  
  const { products, searchProducts } = useProducts();
  
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('1');
  const [newItemCategory, setNewItemCategory] = useState('Geral');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');

  // Criar lista inicial se não existir
  useEffect(() => {
    if (!currentList) {
      createList('Minha Lista de Compras');
    }
  }, [currentList, createList]);

  const handleAddItem = () => {
    if (!newItemName.trim()) return;

    const item = {
      name: newItemName.trim(),
      price: parseFloat(newItemPrice) || 0,
      quantity: parseInt(newItemQuantity) || 1,
      category: newItemCategory
    };

    addItemToCurrentList(item);
    
    // Limpar formulário
    setNewItemName('');
    setNewItemPrice('');
    setNewItemQuantity('1');
    setNewItemCategory('Geral');
    setShowAddForm(false);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setNewItemName(item.name);
    setNewItemPrice(item.price.toString());
    setNewItemQuantity(item.quantity.toString());
    setNewItemCategory(item.category);
    setShowAddForm(true);
  };

  const handleUpdateItem = () => {
    if (!editingItem || !newItemName.trim()) return;

    updateListItem(editingItem.id, {
      name: newItemName.trim(),
      price: parseFloat(newItemPrice) || 0,
      quantity: parseInt(newItemQuantity) || 1,
      category: newItemCategory
    });

    // Limpar formulário
    setNewItemName('');
    setNewItemPrice('');
    setNewItemQuantity('1');
    setNewItemCategory('Geral');
    setShowAddForm(false);
    setEditingItem(null);
  };

  const handleCancelEdit = () => {
    setNewItemName('');
    setNewItemPrice('');
    setNewItemQuantity('1');
    setNewItemCategory('Geral');
    setShowAddForm(false);
    setEditingItem(null);
  };

  const handleProductSuggestion = (product) => {
    setNewItemName(product.name);
    setNewItemPrice(product.lastPrice.toString());
    setNewItemCategory(product.category);
  };

  const filteredItems = currentList?.items?.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const categories = [...new Set(currentList?.items?.map(item => item.category) || [])];
  const suggestedProducts = searchQuery ? searchProducts(searchQuery).slice(0, 5) : [];

  const totalValue = getListTotal();
  const checkedValue = getCheckedTotal();
  const remainingValue = totalValue - checkedValue;

  if (!currentList) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Carregando lista de compras...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumo da Lista */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total da Lista</p>
                <p className="text-2xl font-bold text-foreground">
                  R$ {totalValue.toFixed(2)}
                </p>
              </div>
              <Calculator className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Já Comprado</p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {checkedValue.toFixed(2)}
                </p>
              </div>
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Restante</p>
                <p className="text-2xl font-bold text-orange-600">
                  R$ {remainingValue.toFixed(2)}
                </p>
              </div>
              <ShoppingBag className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controles */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
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
        
        <div className="flex gap-2">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
          >
            <option value="all">Todas as categorias</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <Button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Adicionar
          </Button>
        </div>
      </div>

      {/* Formulário de Adicionar/Editar */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus size={20} />
              {editingItem ? 'Editar Produto' : 'Adicionar Produto'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nome do Produto</label>
                <Input
                  placeholder="Ex: Arroz, Feijão, Leite..."
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                />
                
                {/* Sugestões de produtos */}
                {suggestedProducts.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-muted-foreground">Sugestões:</p>
                    {suggestedProducts.map(product => (
                      <button
                        key={product.id}
                        onClick={() => handleProductSuggestion(product)}
                        className="block w-full text-left px-2 py-1 text-sm bg-accent hover:bg-accent/80 rounded"
                      >
                        {product.name} - R$ {product.lastPrice.toFixed(2)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Categoria</label>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value)}
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
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Quantidade</label>
                <Input
                  type="number"
                  min="1"
                  value={newItemQuantity}
                  onChange={(e) => setNewItemQuantity(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Preço (R$)</label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={newItemPrice}
                  onChange={(e) => setNewItemPrice(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={editingItem ? handleUpdateItem : handleAddItem}
                className="flex-1"
              >
                {editingItem ? 'Atualizar' : 'Adicionar'}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleCancelEdit}
              >
                <X size={16} />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de Produtos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Produtos ({filteredItems.length})</span>
            <Badge variant="outline">
              {currentList.items?.filter(item => item.checked).length || 0} comprados
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredItems.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchQuery ? 'Nenhum produto encontrado' : 'Sua lista está vazia'}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {searchQuery ? 'Tente buscar por outro termo' : 'Adicione produtos para começar'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredItems.map(item => (
                <div 
                  key={item.id} 
                  className={`flex items-center gap-3 p-3 border border-border rounded-lg ${
                    item.checked ? 'bg-muted/50' : 'bg-background'
                  }`}
                >
                  <Checkbox
                    checked={item.checked}
                    onCheckedChange={() => toggleItemCheck(item.id)}
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className={`font-medium ${item.checked ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {item.name}
                      </h4>
                      <Badge variant="secondary" className="text-xs">
                        {item.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span>Qtd: {item.quantity}</span>
                      <span>Preço: R$ {item.price.toFixed(2)}</span>
                      <span className="font-medium">
                        Total: R$ {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditItem(item)}
                    >
                      <Edit3 size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItemFromCurrentList(item.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 size={16} />
                    </Button>
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

export default ShoppingListScreen;

