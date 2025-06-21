import { useState, useEffect, useCallback } from 'react';
import db from '../lib/database.js';

// Hook para gerenciar produtos
export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = useCallback(() => {
    setLoading(true);
    try {
      const productList = db.getProducts();
      setProducts(productList);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addProduct = useCallback((productData) => {
    const newProduct = db.addProduct(productData);
    if (newProduct) {
      setProducts(prev => [...prev, newProduct]);
      return newProduct;
    }
    return null;
  }, []);

  const updateProduct = useCallback((productId, updates) => {
    const updatedProduct = db.updateProduct(productId, updates);
    if (updatedProduct) {
      setProducts(prev => prev.map(p => p.id === productId ? updatedProduct : p));
      return updatedProduct;
    }
    return null;
  }, []);

  const deleteProduct = useCallback((productId) => {
    const success = db.deleteProduct(productId);
    if (success) {
      setProducts(prev => prev.filter(p => p.id !== productId));
    }
    return success;
  }, []);

  const searchProducts = useCallback((query) => {
    return products.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
    );
  }, [products]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    refreshProducts: loadProducts
  };
};

// Hook para gerenciar listas de compras
export const useShoppingLists = () => {
  const [lists, setLists] = useState([]);
  const [currentList, setCurrentList] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadLists = useCallback(() => {
    setLoading(true);
    try {
      const shoppingLists = db.getShoppingLists();
      setLists(shoppingLists);
      
      // Se não há lista atual, pega a primeira ativa
      if (!currentList && shoppingLists.length > 0) {
        const activeList = shoppingLists.find(list => list.status === 'active') || shoppingLists[0];
        setCurrentList(activeList);
      }
    } catch (error) {
      console.error('Erro ao carregar listas:', error);
    } finally {
      setLoading(false);
    }
  }, [currentList]);

  const createList = useCallback((name) => {
    const newList = db.createShoppingList(name);
    if (newList) {
      setLists(prev => [...prev, newList]);
      setCurrentList(newList);
      return newList;
    }
    return null;
  }, []);

  const updateList = useCallback((listId, updates) => {
    const updatedList = db.updateShoppingList(listId, updates);
    if (updatedList) {
      setLists(prev => prev.map(l => l.id === listId ? updatedList : l));
      if (currentList && currentList.id === listId) {
        setCurrentList(updatedList);
      }
      return updatedList;
    }
    return null;
  }, [currentList]);

  const addItemToCurrentList = useCallback((item) => {
    if (!currentList) return null;
    
    const newItem = db.addItemToList(currentList.id, item);
    if (newItem) {
      const updatedList = db.getShoppingLists().find(l => l.id === currentList.id);
      setCurrentList(updatedList);
      setLists(prev => prev.map(l => l.id === currentList.id ? updatedList : l));
      return newItem;
    }
    return null;
  }, [currentList]);

  const updateListItem = useCallback((itemId, updates) => {
    if (!currentList) return null;
    
    const updatedItem = db.updateListItem(currentList.id, itemId, updates);
    if (updatedItem) {
      const updatedList = db.getShoppingLists().find(l => l.id === currentList.id);
      setCurrentList(updatedList);
      setLists(prev => prev.map(l => l.id === currentList.id ? updatedList : l));
      return updatedItem;
    }
    return null;
  }, [currentList]);

  const removeItemFromCurrentList = useCallback((itemId) => {
    if (!currentList) return false;
    
    const success = db.removeItemFromList(currentList.id, itemId);
    if (success) {
      const updatedList = db.getShoppingLists().find(l => l.id === currentList.id);
      setCurrentList(updatedList);
      setLists(prev => prev.map(l => l.id === currentList.id ? updatedList : l));
    }
    return success;
  }, [currentList]);

  const toggleItemCheck = useCallback((itemId) => {
    if (!currentList) return null;
    
    const item = currentList.items.find(i => i.id === itemId);
    if (item) {
      return updateListItem(itemId, { checked: !item.checked });
    }
    return null;
  }, [currentList, updateListItem]);

  const getListTotal = useCallback(() => {
    if (!currentList) return 0;
    return currentList.total || 0;
  }, [currentList]);

  const getCheckedTotal = useCallback(() => {
    if (!currentList) return 0;
    return currentList.items
      .filter(item => item.checked)
      .reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [currentList]);

  useEffect(() => {
    loadLists();
  }, [loadLists]);

  return {
    lists,
    currentList,
    loading,
    createList,
    updateList,
    setCurrentList,
    addItemToCurrentList,
    updateListItem,
    removeItemFromCurrentList,
    toggleItemCheck,
    getListTotal,
    getCheckedTotal,
    refreshLists: loadLists
  };
};

// Hook para gerenciar histórico de compras
export const usePurchaseHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = useCallback(() => {
    setLoading(true);
    try {
      const purchaseHistory = db.getPurchaseHistory();
      setHistory(purchaseHistory);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const savePurchase = useCallback((shoppingList, store = '') => {
    const purchase = db.savePurchase(shoppingList, store);
    if (purchase) {
      setHistory(prev => [purchase, ...prev]);
      return purchase;
    }
    return null;
  }, []);

  const getMonthlySpending = useCallback((year, month) => {
    return history
      .filter(purchase => {
        const purchaseDate = new Date(purchase.purchaseDate);
        return purchaseDate.getFullYear() === year && purchaseDate.getMonth() === month;
      })
      .reduce((total, purchase) => total + purchase.total, 0);
  }, [history]);

  const getSpendingByStore = useCallback(() => {
    const storeSpending = {};
    history.forEach(purchase => {
      const store = purchase.store || 'Não informado';
      storeSpending[store] = (storeSpending[store] || 0) + purchase.total;
    });
    return storeSpending;
  }, [history]);

  const getTopProducts = useCallback((limit = 10) => {
    const productCount = {};
    history.forEach(purchase => {
      purchase.items.forEach(item => {
        const key = item.name;
        if (!productCount[key]) {
          productCount[key] = {
            name: item.name,
            category: item.category,
            count: 0,
            totalSpent: 0,
            averagePrice: 0
          };
        }
        productCount[key].count += item.quantity;
        productCount[key].totalSpent += item.price * item.quantity;
      });
    });

    // Calcular preço médio
    Object.values(productCount).forEach(product => {
      product.averagePrice = product.totalSpent / product.count;
    });

    return Object.values(productCount)
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }, [history]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return {
    history,
    loading,
    savePurchase,
    getMonthlySpending,
    getSpendingByStore,
    getTopProducts,
    refreshHistory: loadHistory
  };
};

// Hook para comparação de preços
export const usePriceComparison = () => {
  const [comparisons, setComparisons] = useState([]);
  const [loading, setLoading] = useState(false);

  const getProductComparison = useCallback((productId) => {
    setLoading(true);
    try {
      const comparison = db.getProductPriceComparison(productId);
      return comparison;
    } catch (error) {
      console.error('Erro ao comparar preços:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllComparisons = useCallback(() => {
    setLoading(true);
    try {
      const products = db.getProducts();
      const allComparisons = products
        .map(product => db.getProductPriceComparison(product.id))
        .filter(comparison => comparison !== null);
      
      setComparisons(allComparisons);
      return allComparisons;
    } catch (error) {
      console.error('Erro ao buscar comparações:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getProductsWithPriceIncrease = useCallback(() => {
    return comparisons.filter(comp => comp.trend === 'increase');
  }, [comparisons]);

  const getProductsWithPriceDecrease = useCallback(() => {
    return comparisons.filter(comp => comp.trend === 'decrease');
  }, [comparisons]);

  return {
    comparisons,
    loading,
    getProductComparison,
    getAllComparisons,
    getProductsWithPriceIncrease,
    getProductsWithPriceDecrease
  };
};

// Hook para configurações
export const useSettings = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  const loadSettings = useCallback(() => {
    setLoading(true);
    try {
      const appSettings = db.getSettings();
      setSettings(appSettings);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSettings = useCallback((newSettings) => {
    const updatedSettings = db.updateSettings(newSettings);
    if (updatedSettings) {
      setSettings(updatedSettings);
      return updatedSettings;
    }
    return null;
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return {
    settings,
    loading,
    updateSettings,
    refreshSettings: loadSettings
  };
};

