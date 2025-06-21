// Sistema de banco de dados local usando localStorage
class LocalDatabase {
  constructor() {
    this.KEYS = {
      PRODUCTS: 'shopping_products',
      SHOPPING_LISTS: 'shopping_lists',
      PURCHASE_HISTORY: 'purchase_history',
      SETTINGS: 'app_settings'
    };
    this.initializeDatabase();
  }

  // Inicializar banco de dados com estruturas padrão
  initializeDatabase() {
    if (!localStorage.getItem(this.KEYS.PRODUCTS)) {
      localStorage.setItem(this.KEYS.PRODUCTS, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.KEYS.SHOPPING_LISTS)) {
      localStorage.setItem(this.KEYS.SHOPPING_LISTS, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.KEYS.PURCHASE_HISTORY)) {
      localStorage.setItem(this.KEYS.PURCHASE_HISTORY, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.KEYS.SETTINGS)) {
      localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify({
        currency: 'R$',
        theme: 'light',
        notifications: true
      }));
    }
  }

  // Operações para produtos
  getProducts() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.PRODUCTS)) || [];
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      return [];
    }
  }

  addProduct(product) {
    try {
      const products = this.getProducts();
      const newProduct = {
        id: Date.now().toString(),
        name: product.name,
        category: product.category || 'Geral',
        lastPrice: product.price || 0,
        priceHistory: [{
          price: product.price || 0,
          date: new Date().toISOString(),
          store: product.store || ''
        }],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      products.push(newProduct);
      localStorage.setItem(this.KEYS.PRODUCTS, JSON.stringify(products));
      return newProduct;
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      return null;
    }
  }

  updateProduct(productId, updates) {
    try {
      const products = this.getProducts();
      const productIndex = products.findIndex(p => p.id === productId);
      if (productIndex !== -1) {
        products[productIndex] = {
          ...products[productIndex],
          ...updates,
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem(this.KEYS.PRODUCTS, JSON.stringify(products));
        return products[productIndex];
      }
      return null;
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      return null;
    }
  }

  deleteProduct(productId) {
    try {
      const products = this.getProducts();
      const filteredProducts = products.filter(p => p.id !== productId);
      localStorage.setItem(this.KEYS.PRODUCTS, JSON.stringify(filteredProducts));
      return true;
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      return false;
    }
  }

  // Operações para listas de compras
  getShoppingLists() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.SHOPPING_LISTS)) || [];
    } catch (error) {
      console.error('Erro ao buscar listas:', error);
      return [];
    }
  }

  createShoppingList(name) {
    try {
      const lists = this.getShoppingLists();
      const newList = {
        id: Date.now().toString(),
        name: name || `Lista ${lists.length + 1}`,
        items: [],
        total: 0,
        status: 'active', // active, completed, archived
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      lists.push(newList);
      localStorage.setItem(this.KEYS.SHOPPING_LISTS, JSON.stringify(lists));
      return newList;
    } catch (error) {
      console.error('Erro ao criar lista:', error);
      return null;
    }
  }

  updateShoppingList(listId, updates) {
    try {
      const lists = this.getShoppingLists();
      const listIndex = lists.findIndex(l => l.id === listId);
      if (listIndex !== -1) {
        lists[listIndex] = {
          ...lists[listIndex],
          ...updates,
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem(this.KEYS.SHOPPING_LISTS, JSON.stringify(lists));
        return lists[listIndex];
      }
      return null;
    } catch (error) {
      console.error('Erro ao atualizar lista:', error);
      return null;
    }
  }

  addItemToList(listId, item) {
    try {
      const lists = this.getShoppingLists();
      const listIndex = lists.findIndex(l => l.id === listId);
      if (listIndex !== -1) {
        const newItem = {
          id: Date.now().toString(),
          productId: item.productId || null,
          name: item.name,
          quantity: item.quantity || 1,
          price: item.price || 0,
          category: item.category || 'Geral',
          checked: false,
          addedAt: new Date().toISOString()
        };
        lists[listIndex].items.push(newItem);
        lists[listIndex].total = this.calculateListTotal(lists[listIndex].items);
        lists[listIndex].updatedAt = new Date().toISOString();
        localStorage.setItem(this.KEYS.SHOPPING_LISTS, JSON.stringify(lists));
        return newItem;
      }
      return null;
    } catch (error) {
      console.error('Erro ao adicionar item à lista:', error);
      return null;
    }
  }

  updateListItem(listId, itemId, updates) {
    try {
      const lists = this.getShoppingLists();
      const listIndex = lists.findIndex(l => l.id === listId);
      if (listIndex !== -1) {
        const itemIndex = lists[listIndex].items.findIndex(i => i.id === itemId);
        if (itemIndex !== -1) {
          lists[listIndex].items[itemIndex] = {
            ...lists[listIndex].items[itemIndex],
            ...updates
          };
          lists[listIndex].total = this.calculateListTotal(lists[listIndex].items);
          lists[listIndex].updatedAt = new Date().toISOString();
          localStorage.setItem(this.KEYS.SHOPPING_LISTS, JSON.stringify(lists));
          return lists[listIndex].items[itemIndex];
        }
      }
      return null;
    } catch (error) {
      console.error('Erro ao atualizar item da lista:', error);
      return null;
    }
  }

  removeItemFromList(listId, itemId) {
    try {
      const lists = this.getShoppingLists();
      const listIndex = lists.findIndex(l => l.id === listId);
      if (listIndex !== -1) {
        lists[listIndex].items = lists[listIndex].items.filter(i => i.id !== itemId);
        lists[listIndex].total = this.calculateListTotal(lists[listIndex].items);
        lists[listIndex].updatedAt = new Date().toISOString();
        localStorage.setItem(this.KEYS.SHOPPING_LISTS, JSON.stringify(lists));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao remover item da lista:', error);
      return false;
    }
  }

  calculateListTotal(items) {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Operações para histórico de compras
  getPurchaseHistory() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.PURCHASE_HISTORY)) || [];
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      return [];
    }
  }

  savePurchase(shoppingList, store = '') {
    try {
      const history = this.getPurchaseHistory();
      const purchase = {
        id: Date.now().toString(),
        listId: shoppingList.id,
        listName: shoppingList.name,
        items: shoppingList.items.filter(item => item.checked),
        total: this.calculateListTotal(shoppingList.items.filter(item => item.checked)),
        store: store,
        purchaseDate: new Date().toISOString()
      };
      history.unshift(purchase); // Adiciona no início para mostrar mais recentes primeiro
      localStorage.setItem(this.KEYS.PURCHASE_HISTORY, JSON.stringify(history));
      
      // Atualizar histórico de preços dos produtos
      this.updateProductPriceHistory(purchase.items, store);
      
      return purchase;
    } catch (error) {
      console.error('Erro ao salvar compra:', error);
      return null;
    }
  }

  updateProductPriceHistory(items, store) {
    try {
      const products = this.getProducts();
      items.forEach(item => {
        if (item.productId) {
          const productIndex = products.findIndex(p => p.id === item.productId);
          if (productIndex !== -1) {
            products[productIndex].priceHistory.push({
              price: item.price,
              date: new Date().toISOString(),
              store: store
            });
            products[productIndex].lastPrice = item.price;
            products[productIndex].updatedAt = new Date().toISOString();
          }
        }
      });
      localStorage.setItem(this.KEYS.PRODUCTS, JSON.stringify(products));
    } catch (error) {
      console.error('Erro ao atualizar histórico de preços:', error);
    }
  }

  // Operações de comparação de preços
  getProductPriceComparison(productId) {
    try {
      const products = this.getProducts();
      const product = products.find(p => p.id === productId);
      if (product && product.priceHistory.length > 1) {
        const sortedHistory = product.priceHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
        const currentPrice = sortedHistory[0].price;
        const previousPrice = sortedHistory[1].price;
        const difference = currentPrice - previousPrice;
        const percentageChange = ((difference / previousPrice) * 100).toFixed(2);
        
        return {
          product: product,
          currentPrice: currentPrice,
          previousPrice: previousPrice,
          difference: difference,
          percentageChange: parseFloat(percentageChange),
          trend: difference > 0 ? 'increase' : difference < 0 ? 'decrease' : 'stable'
        };
      }
      return null;
    } catch (error) {
      console.error('Erro ao comparar preços:', error);
      return null;
    }
  }

  // Operações de configurações
  getSettings() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.SETTINGS)) || {};
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
      return {};
    }
  }

  updateSettings(newSettings) {
    try {
      const currentSettings = this.getSettings();
      const updatedSettings = { ...currentSettings, ...newSettings };
      localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(updatedSettings));
      return updatedSettings;
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
      return null;
    }
  }

  // Operações de backup e restauração
  exportData() {
    try {
      return {
        products: this.getProducts(),
        shoppingLists: this.getShoppingLists(),
        purchaseHistory: this.getPurchaseHistory(),
        settings: this.getSettings(),
        exportDate: new Date().toISOString()
      };
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      return null;
    }
  }

  importData(data) {
    try {
      if (data.products) {
        localStorage.setItem(this.KEYS.PRODUCTS, JSON.stringify(data.products));
      }
      if (data.shoppingLists) {
        localStorage.setItem(this.KEYS.SHOPPING_LISTS, JSON.stringify(data.shoppingLists));
      }
      if (data.purchaseHistory) {
        localStorage.setItem(this.KEYS.PURCHASE_HISTORY, JSON.stringify(data.purchaseHistory));
      }
      if (data.settings) {
        localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(data.settings));
      }
      return true;
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      return false;
    }
  }

  // Limpar todos os dados
  clearAllData() {
    try {
      Object.values(this.KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      this.initializeDatabase();
      return true;
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
      return false;
    }
  }
}

// Instância singleton do banco de dados
const db = new LocalDatabase();

export default db;

