import React, { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { 
  ShoppingCart, 
  Plus, 
  History, 
  TrendingUp, 
  Settings,
  Home,
  Menu,
  X
} from 'lucide-react';
import './App.css';

// Importar componentes das telas
import ShoppingListScreen from './components/ShoppingListScreen.jsx';
import AddProductScreen from './components/AddProductScreen.jsx';
import HistoryScreen from './components/HistoryScreen.jsx';
import PriceComparisonScreen from './components/PriceComparisonScreen.jsx';
import SettingsScreen from './components/SettingsScreen.jsx';

function App() {
  const [currentScreen, setCurrentScreen] = useState('shopping');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const screens = {
    shopping: { 
      component: ShoppingListScreen, 
      title: 'Lista de Compras', 
      icon: ShoppingCart 
    },
    add: { 
      component: AddProductScreen, 
      title: 'Adicionar Produto', 
      icon: Plus 
    },
    history: { 
      component: HistoryScreen, 
      title: 'Histórico', 
      icon: History 
    },
    comparison: { 
      component: PriceComparisonScreen, 
      title: 'Comparar Preços', 
      icon: TrendingUp 
    },
    settings: { 
      component: SettingsScreen, 
      title: 'Configurações', 
      icon: Settings 
    }
  };

  const CurrentScreenComponent = screens[currentScreen].component;

  const NavigationItem = ({ screenKey, screen, isActive, onClick }) => {
    const Icon = screen.icon;
    return (
      <button
        onClick={() => {
          onClick(screenKey);
          setIsMobileMenuOpen(false);
        }}
        className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${
          isActive 
            ? 'bg-primary text-primary-foreground' 
            : 'hover:bg-accent hover:text-accent-foreground'
        }`}
      >
        <Icon size={20} />
        <span className="font-medium">{screen.title}</span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Mobile */}
      <div className="lg:hidden bg-card border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingCart className="text-primary" size={24} />
          <h1 className="text-xl font-bold text-foreground">Smart Shopping</h1>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      <div className="flex">
        {/* Sidebar Desktop */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-card border-r border-border">
          <div className="flex items-center gap-2 p-6 border-b border-border">
            <ShoppingCart className="text-primary" size={28} />
            <h1 className="text-2xl font-bold text-foreground">Smart Shopping</h1>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            {Object.entries(screens).map(([key, screen]) => (
              <NavigationItem
                key={key}
                screenKey={key}
                screen={screen}
                isActive={currentScreen === key}
                onClick={setCurrentScreen}
              />
            ))}
          </nav>
          
          <div className="p-4 border-t border-border">
            <div className="text-sm text-muted-foreground text-center">
              Smart Shopping v1.0
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
            <div className="fixed inset-y-0 left-0 w-64 bg-card border-r border-border">
              <div className="flex items-center gap-2 p-6 border-b border-border">
                <ShoppingCart className="text-primary" size={28} />
                <h1 className="text-xl font-bold text-foreground">Smart Shopping</h1>
              </div>
              
              <nav className="flex-1 p-4 space-y-2">
                {Object.entries(screens).map(([key, screen]) => (
                  <NavigationItem
                    key={key}
                    screenKey={key}
                    screen={screen}
                    isActive={currentScreen === key}
                    onClick={setCurrentScreen}
                  />
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 lg:ml-64">
          <div className="p-4 lg:p-8">
            {/* Header Desktop */}
            <div className="hidden lg:block mb-8">
              <h2 className="text-3xl font-bold text-foreground">
                {screens[currentScreen].title}
              </h2>
              <p className="text-muted-foreground mt-2">
                Gerencie suas compras de forma inteligente
              </p>
            </div>

            {/* Screen Content */}
            <div className="max-w-7xl mx-auto">
              <CurrentScreenComponent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

