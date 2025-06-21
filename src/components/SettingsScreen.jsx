import React, { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Switch } from '@/components/ui/switch.jsx';
import { 
  Settings, 
  Download, 
  Upload, 
  Trash2, 
  Moon, 
  Sun, 
  Bell,
  Database,
  FileText,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';
import { useSettings } from '../hooks/useDatabase.js';
import db from '../lib/database.js';

const SettingsScreen = () => {
  const { settings, updateSettings } = useSettings();
  
  const [exportStatus, setExportStatus] = useState('');
  const [importStatus, setImportStatus] = useState('');
  const [clearDataStatus, setClearDataStatus] = useState('');

  const handleSettingChange = (key, value) => {
    updateSettings({ [key]: value });
  };

  const handleExportData = () => {
    try {
      const data = db.exportData();
      if (data) {
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `smart-shopping-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        
        setExportStatus('success');
        setTimeout(() => setExportStatus(''), 3000);
      }
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      setExportStatus('error');
      setTimeout(() => setExportStatus(''), 3000);
    }
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        const success = db.importData(data);
        
        if (success) {
          setImportStatus('success');
          setTimeout(() => {
            setImportStatus('');
            window.location.reload(); // Recarregar para atualizar os dados
          }, 2000);
        } else {
          setImportStatus('error');
          setTimeout(() => setImportStatus(''), 3000);
        }
      } catch (error) {
        console.error('Erro ao importar dados:', error);
        setImportStatus('error');
        setTimeout(() => setImportStatus(''), 3000);
      }
    };
    reader.readAsText(file);
    
    // Limpar o input
    event.target.value = '';
  };

  const handleClearAllData = () => {
    const confirmed = window.confirm(
      'ATENÇÃO: Esta ação irá apagar TODOS os seus dados (produtos, listas, histórico). Esta ação não pode ser desfeita. Tem certeza que deseja continuar?'
    );
    
    if (confirmed) {
      const doubleConfirmed = window.confirm(
        'Última confirmação: Todos os dados serão perdidos permanentemente. Confirma a exclusão?'
      );
      
      if (doubleConfirmed) {
        try {
          const success = db.clearAllData();
          if (success) {
            setClearDataStatus('success');
            setTimeout(() => {
              setClearDataStatus('');
              window.location.reload();
            }, 2000);
          } else {
            setClearDataStatus('error');
            setTimeout(() => setClearDataStatus(''), 3000);
          }
        } catch (error) {
          console.error('Erro ao limpar dados:', error);
          setClearDataStatus('error');
          setTimeout(() => setClearDataStatus(''), 3000);
        }
      }
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusMessage = (status, type) => {
    if (!status) return '';
    
    const messages = {
      export: {
        success: 'Dados exportados com sucesso!',
        error: 'Erro ao exportar dados. Tente novamente.'
      },
      import: {
        success: 'Dados importados com sucesso! Recarregando...',
        error: 'Erro ao importar dados. Verifique o arquivo.'
      },
      clear: {
        success: 'Dados limpos com sucesso! Recarregando...',
        error: 'Erro ao limpar dados. Tente novamente.'
      }
    };
    
    return messages[type][status] || '';
  };

  return (
    <div className="space-y-6">
      {/* Configurações Gerais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings size={20} />
            Configurações Gerais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">Moeda</h4>
              <p className="text-sm text-muted-foreground">
                Moeda utilizada para exibir preços
              </p>
            </div>
            <select
              value={settings.currency || 'R$'}
              onChange={(e) => handleSettingChange('currency', e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              <option value="R$">Real (R$)</option>
              <option value="US$">Dólar (US$)</option>
              <option value="€">Euro (€)</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">Tema</h4>
              <p className="text-sm text-muted-foreground">
                Escolha entre tema claro ou escuro
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Sun size={16} className="text-muted-foreground" />
              <Switch
                checked={settings.theme === 'dark'}
                onCheckedChange={(checked) => 
                  handleSettingChange('theme', checked ? 'dark' : 'light')
                }
              />
              <Moon size={16} className="text-muted-foreground" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">Notificações</h4>
              <p className="text-sm text-muted-foreground">
                Receber alertas sobre mudanças de preços
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-muted-foreground" />
              <Switch
                checked={settings.notifications !== false}
                onCheckedChange={(checked) => 
                  handleSettingChange('notifications', checked)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Backup e Restauração */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database size={20} />
            Backup e Restauração
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-foreground mb-2">Exportar Dados</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Faça backup de todos os seus dados (produtos, listas, histórico)
              </p>
              <Button 
                onClick={handleExportData}
                className="w-full flex items-center gap-2"
                variant="outline"
              >
                <Download size={16} />
                Exportar Backup
              </Button>
              {exportStatus && (
                <div className="flex items-center gap-2 mt-2 text-sm">
                  {getStatusIcon(exportStatus)}
                  <span className={exportStatus === 'success' ? 'text-green-600' : 'text-red-600'}>
                    {getStatusMessage(exportStatus, 'export')}
                  </span>
                </div>
              )}
            </div>

            <div>
              <h4 className="font-medium text-foreground mb-2">Importar Dados</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Restaure seus dados a partir de um arquivo de backup
              </p>
              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button 
                  className="w-full flex items-center gap-2"
                  variant="outline"
                >
                  <Upload size={16} />
                  Importar Backup
                </Button>
              </div>
              {importStatus && (
                <div className="flex items-center gap-2 mt-2 text-sm">
                  {getStatusIcon(importStatus)}
                  <span className={importStatus === 'success' ? 'text-green-600' : 'text-red-600'}>
                    {getStatusMessage(importStatus, 'import')}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-800 dark:text-blue-200">
                  Dica sobre Backup
                </p>
                <p className="text-blue-700 dark:text-blue-300 mt-1">
                  Recomendamos fazer backup regularmente dos seus dados. 
                  O arquivo exportado contém todos os produtos, listas e histórico de compras.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gerenciamento de Dados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash2 size={20} />
            Gerenciamento de Dados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border border-red-200 bg-red-50 dark:bg-red-950/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-800 dark:text-red-200">
                  Zona de Perigo
                </h4>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1 mb-3">
                  As ações abaixo são irreversíveis. Certifique-se de ter um backup antes de prosseguir.
                </p>
                
                <Button 
                  onClick={handleClearAllData}
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Limpar Todos os Dados
                </Button>
                
                {clearDataStatus && (
                  <div className="flex items-center gap-2 mt-2 text-sm">
                    {getStatusIcon(clearDataStatus)}
                    <span className={clearDataStatus === 'success' ? 'text-green-600' : 'text-red-600'}>
                      {getStatusMessage(clearDataStatus, 'clear')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações do App */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info size={20} />
            Sobre o Aplicativo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-foreground">Smart Shopping</h4>
              <p className="text-muted-foreground">Versão 1.0.0</p>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground">Desenvolvido com</h4>
              <p className="text-muted-foreground">React + Vite + Tailwind CSS</p>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground">Armazenamento</h4>
              <p className="text-muted-foreground">Local Storage (navegador)</p>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground">Compatibilidade</h4>
              <p className="text-muted-foreground">PWA - Funciona offline</p>
            </div>
          </div>
          
          <div className="border-t border-border pt-4">
            <h4 className="font-medium text-foreground mb-2">Funcionalidades</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Criação e gerenciamento de listas de compras</li>
              <li>• Cadastro de produtos com histórico de preços</li>
              <li>• Comparação de preços entre compras</li>
              <li>• Histórico completo de compras realizadas</li>
              <li>• Backup e restauração de dados</li>
              <li>• Interface responsiva para mobile e desktop</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsScreen;

