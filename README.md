# Smart Shopping - Lista de Compras Inteligente

## Documentação Completa do Projeto

**Versão:** 1.0.0  
**Autor:** Manus AI  
**Data:** 21 de Junho de 2025  
**Tecnologias:** React, Vite, Tailwind CSS, PWA

---

## Índice

1. [Visão Geral](#visão-geral)
2. [Funcionalidades](#funcionalidades)
3. [Arquitetura do Sistema](#arquitetura-do-sistema)
4. [Instalação e Configuração](#instalação-e-configuração)
5. [Guia de Uso](#guia-de-uso)
6. [Estrutura do Projeto](#estrutura-do-projeto)
7. [Banco de Dados Local](#banco-de-dados-local)
8. [PWA e Funcionalidades Offline](#pwa-e-funcionalidades-offline)
9. [Desenvolvimento e Personalização](#desenvolvimento-e-personalização)
10. [Troubleshooting](#troubleshooting)

---

## Visão Geral

O **Smart Shopping** é um aplicativo web progressivo (PWA) desenvolvido para revolucionar a forma como você gerencia suas compras. Criado com tecnologias modernas como React, Vite e Tailwind CSS, o aplicativo oferece uma experiência completa e intuitiva para o controle de gastos e comparação de preços.

### Principais Características

O aplicativo foi projetado com foco na usabilidade e eficiência, oferecendo uma interface elegante e responsiva que funciona perfeitamente tanto em dispositivos móveis quanto em desktops. Todas as informações são armazenadas localmente no navegador, garantindo privacidade total dos dados e funcionamento offline.

### Público-Alvo

O Smart Shopping é ideal para:
- Famílias que desejam controlar melhor seus gastos com compras
- Pessoas que fazem compras regulares e querem comparar preços
- Usuários que buscam organização e planejamento financeiro
- Qualquer pessoa interessada em otimizar suas compras

---

## Funcionalidades

### 1. Gerenciamento de Listas de Compras

O aplicativo permite criar e gerenciar listas de compras de forma intuitiva. Você pode adicionar produtos com informações detalhadas como nome, categoria, quantidade e preço. O sistema calcula automaticamente o valor total da lista e mostra quanto já foi comprado versus o que ainda resta.

**Recursos da Lista:**
- Adição rápida de produtos com sugestões automáticas
- Categorização automática de produtos
- Cálculo em tempo real do valor total
- Marcação de itens como comprados
- Edição e remoção de itens
- Busca e filtros por categoria

### 2. Cadastro de Produtos

O sistema permite cadastrar produtos em um banco de dados local para facilitar futuras compras e comparações de preços. Cada produto mantém um histórico completo de preços e lojas onde foi comprado.

**Informações do Produto:**
- Nome e categoria
- Histórico de preços
- Lojas onde foi comprado
- Data da última atualização
- Preço médio calculado automaticamente

### 3. Histórico de Compras

Todas as compras realizadas são automaticamente salvas no histórico, permitindo análises detalhadas dos gastos ao longo do tempo.

**Análises Disponíveis:**
- Total gasto por período
- Gastos por loja/mercado
- Produtos mais comprados
- Ticket médio das compras
- Filtros por data, loja e categoria
- Exportação de dados

### 4. Comparação de Preços

O aplicativo analisa automaticamente o histórico de preços dos produtos e identifica tendências de aumento ou diminuição, ajudando você a tomar decisões mais inteligentes.

**Recursos de Comparação:**
- Identificação de produtos com preços em alta
- Alertas de oportunidades de economia
- Análise de variação percentual
- Histórico gráfico de preços
- Comparação entre diferentes lojas

### 5. Configurações e Backup

O sistema oferece opções completas de configuração e backup para garantir que seus dados estejam sempre seguros.

**Opções Disponíveis:**
- Configuração de moeda
- Tema claro/escuro
- Notificações de preços
- Exportação completa de dados
- Importação de backup
- Limpeza de dados

---

## Arquitetura do Sistema

### Frontend

O aplicativo utiliza React como biblioteca principal, proporcionando uma interface de usuário moderna e reativa. O Vite é usado como bundler para desenvolvimento rápido e builds otimizados.

**Tecnologias Utilizadas:**
- **React 18+**: Biblioteca para construção da interface
- **Vite**: Build tool e servidor de desenvolvimento
- **Tailwind CSS**: Framework CSS utilitário
- **Shadcn/UI**: Componentes de interface pré-construídos
- **Lucide Icons**: Biblioteca de ícones
- **Framer Motion**: Animações e transições

### Armazenamento de Dados

O sistema utiliza o localStorage do navegador para armazenar todos os dados, garantindo funcionamento offline e privacidade total.

**Estrutura de Dados:**
- Produtos cadastrados
- Listas de compras
- Histórico de compras
- Configurações do usuário

### PWA (Progressive Web App)

O aplicativo é configurado como PWA, permitindo instalação no dispositivo e funcionamento offline.

**Recursos PWA:**
- Manifest.json configurado
- Service Worker para cache
- Funcionamento offline
- Instalação no dispositivo
- Notificações push (opcional)

---

## Instalação e Configuração

### Pré-requisitos

Para executar o projeto localmente, você precisa ter instalado:
- Node.js (versão 16 ou superior)
- npm ou yarn
- Git (opcional)

### Passos de Instalação

1. **Clone ou baixe o projeto:**
   ```bash
   # Se usando Git
   git clone [URL_DO_REPOSITORIO]
   cd shopping-pwa
   
   # Ou extraia o arquivo ZIP baixado
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Execute o servidor de desenvolvimento:**
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

4. **Acesse o aplicativo:**
   Abra seu navegador e acesse `http://localhost:5173`

### Build para Produção

Para criar uma versão otimizada para produção:

```bash
npm run build
# ou
yarn build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

---

## Guia de Uso

### Primeira Utilização

Ao abrir o aplicativo pela primeira vez, você será direcionado para a tela de Lista de Compras. O sistema criará automaticamente uma lista inicial chamada "Minha Lista de Compras".

### Adicionando Produtos à Lista

1. **Na tela principal (Lista de Compras):**
   - Clique no botão "Adicionar" no canto superior direito
   - Preencha o nome do produto
   - Selecione a categoria apropriada
   - Defina a quantidade (padrão: 1)
   - Insira o preço estimado
   - Clique em "Adicionar"

2. **Sugestões Automáticas:**
   - Ao digitar o nome do produto, o sistema mostrará sugestões baseadas em produtos já cadastrados
   - Clique em uma sugestão para preencher automaticamente os campos

### Gerenciando a Lista

- **Marcar como comprado:** Clique na checkbox ao lado do produto
- **Editar produto:** Clique no ícone de edição
- **Remover produto:** Clique no ícone de lixeira
- **Buscar produtos:** Use a barra de busca no topo
- **Filtrar por categoria:** Use o seletor de categoria

### Cadastrando Produtos

1. **Acesse a tela "Adicionar Produto"**
2. **Preencha as informações:**
   - Nome do produto
   - Categoria
   - Preço atual
   - Loja/mercado onde foi comprado
3. **Clique em "Adicionar Produto"**

### Visualizando o Histórico

1. **Acesse a tela "Histórico"**
2. **Use os filtros disponíveis:**
   - Busca por texto
   - Filtro por mês/ano
   - Filtro por loja
3. **Visualize as estatísticas:**
   - Total gasto
   - Número de compras
   - Ticket médio
   - Gastos do mês atual

### Comparando Preços

1. **Acesse a tela "Comparar Preços"**
2. **Visualize as tendências:**
   - Produtos com preços em alta (vermelho)
   - Produtos com preços em baixa (verde)
   - Produtos com preços estáveis (cinza)
3. **Use os filtros para análises específicas**

### Configurações e Backup

1. **Acesse a tela "Configurações"**
2. **Configure suas preferências:**
   - Moeda (Real, Dólar, Euro)
   - Tema (Claro/Escuro)
   - Notificações
3. **Gerencie seus dados:**
   - Exportar backup: Baixa um arquivo JSON com todos os dados
   - Importar backup: Restaura dados de um arquivo de backup
   - Limpar dados: Remove todos os dados (irreversível)

---

## Estrutura do Projeto

```
shopping-pwa/
├── public/
│   ├── manifest.json          # Configuração PWA
│   ├── sw.js                  # Service Worker
│   └── favicon.ico            # Ícone do aplicativo
├── src/
│   ├── components/            # Componentes React
│   │   ├── ui/               # Componentes de interface (shadcn/ui)
│   │   ├── ShoppingListScreen.jsx
│   │   ├── AddProductScreen.jsx
│   │   ├── HistoryScreen.jsx
│   │   ├── PriceComparisonScreen.jsx
│   │   └── SettingsScreen.jsx
│   ├── hooks/                # Hooks personalizados
│   │   └── useDatabase.js    # Hooks para gerenciar dados
│   ├── lib/                  # Bibliotecas e utilitários
│   │   └── database.js       # Sistema de banco de dados local
│   ├── App.jsx               # Componente principal
│   ├── App.css               # Estilos principais
│   ├── main.jsx              # Ponto de entrada
│   └── index.css             # Estilos globais
├── package.json              # Dependências e scripts
├── vite.config.js            # Configuração do Vite
├── tailwind.config.js        # Configuração do Tailwind
└── README.md                 # Documentação básica
```

### Componentes Principais

**App.jsx**: Componente raiz que gerencia a navegação entre telas e o layout principal.

**ShoppingListScreen.jsx**: Tela principal para gerenciar listas de compras.

**AddProductScreen.jsx**: Tela para cadastrar novos produtos no banco de dados.

**HistoryScreen.jsx**: Tela para visualizar histórico de compras e estatísticas.

**PriceComparisonScreen.jsx**: Tela para comparar preços e identificar tendências.

**SettingsScreen.jsx**: Tela de configurações, backup e gerenciamento de dados.

### Hooks Personalizados

**useProducts**: Gerencia operações CRUD de produtos.

**useShoppingLists**: Gerencia listas de compras e itens.

**usePurchaseHistory**: Gerencia histórico de compras e estatísticas.

**usePriceComparison**: Gerencia comparações de preços.

**useSettings**: Gerencia configurações do aplicativo.

---

## Banco de Dados Local

### Estrutura de Dados

O sistema utiliza localStorage para armazenar dados em formato JSON. A estrutura é organizada em quatro principais coleções:

#### 1. Produtos (shopping_products)
```json
{
  "id": "timestamp_string",
  "name": "Nome do Produto",
  "category": "Categoria",
  "lastPrice": 0.00,
  "priceHistory": [
    {
      "price": 0.00,
      "date": "ISO_DATE_STRING",
      "store": "Nome da Loja"
    }
  ],
  "createdAt": "ISO_DATE_STRING",
  "updatedAt": "ISO_DATE_STRING"
}
```

#### 2. Listas de Compras (shopping_lists)
```json
{
  "id": "timestamp_string",
  "name": "Nome da Lista",
  "items": [
    {
      "id": "timestamp_string",
      "productId": "id_do_produto_ou_null",
      "name": "Nome do Item",
      "quantity": 1,
      "price": 0.00,
      "category": "Categoria",
      "checked": false,
      "addedAt": "ISO_DATE_STRING"
    }
  ],
  "total": 0.00,
  "status": "active|completed|archived",
  "createdAt": "ISO_DATE_STRING",
  "updatedAt": "ISO_DATE_STRING"
}
```

#### 3. Histórico de Compras (purchase_history)
```json
{
  "id": "timestamp_string",
  "listId": "id_da_lista",
  "listName": "Nome da Lista",
  "items": [], // Array de itens comprados
  "total": 0.00,
  "store": "Nome da Loja",
  "purchaseDate": "ISO_DATE_STRING"
}
```

#### 4. Configurações (app_settings)
```json
{
  "currency": "R$",
  "theme": "light|dark",
  "notifications": true
}
```

### Operações de Dados

O sistema oferece uma API completa para manipulação de dados:

**Produtos:**
- `getProducts()`: Buscar todos os produtos
- `addProduct(data)`: Adicionar novo produto
- `updateProduct(id, data)`: Atualizar produto
- `deleteProduct(id)`: Remover produto

**Listas:**
- `getShoppingLists()`: Buscar todas as listas
- `createShoppingList(name)`: Criar nova lista
- `addItemToList(listId, item)`: Adicionar item à lista
- `updateListItem(listId, itemId, data)`: Atualizar item
- `removeItemFromList(listId, itemId)`: Remover item

**Histórico:**
- `getPurchaseHistory()`: Buscar histórico
- `savePurchase(list, store)`: Salvar compra
- `getMonthlySpending(year, month)`: Gastos mensais

### Backup e Restauração

O sistema oferece funcionalidades completas de backup:

**Exportação:**
- Gera arquivo JSON com todos os dados
- Inclui timestamp da exportação
- Mantém estrutura original dos dados

**Importação:**
- Valida estrutura do arquivo
- Substitui dados existentes
- Mantém integridade referencial

---

## PWA e Funcionalidades Offline

### Configuração PWA

O aplicativo está configurado como Progressive Web App com as seguintes características:

**Manifest.json:**
- Nome e descrição do aplicativo
- Ícones em múltiplas resoluções
- Configuração de display standalone
- Tema e cores personalizadas
- Screenshots para app stores

**Service Worker:**
- Cache de recursos estáticos
- Funcionamento offline
- Sincronização em background
- Suporte a notificações push

### Instalação no Dispositivo

O aplicativo pode ser instalado diretamente no dispositivo:

**Desktop:**
1. Abra o aplicativo no Chrome/Edge
2. Clique no ícone de instalação na barra de endereços
3. Confirme a instalação

**Mobile:**
1. Abra o aplicativo no navegador
2. Acesse o menu do navegador
3. Selecione "Adicionar à tela inicial"

### Funcionamento Offline

Quando offline, o aplicativo:
- Mantém todas as funcionalidades principais
- Armazena dados localmente
- Sincroniza quando a conexão retorna
- Exibe indicadores de status de conexão

---

## Desenvolvimento e Personalização

### Adicionando Novas Funcionalidades

Para adicionar novas funcionalidades ao aplicativo:

1. **Crie novos componentes** na pasta `src/components/`
2. **Adicione hooks personalizados** em `src/hooks/`
3. **Estenda o banco de dados** em `src/lib/database.js`
4. **Atualize a navegação** em `App.jsx`

### Personalizando o Design

O aplicativo utiliza Tailwind CSS para estilização:

**Cores:**
- Modifique as variáveis CSS em `App.css`
- Use classes Tailwind para componentes específicos

**Componentes:**
- Os componentes UI estão em `src/components/ui/`
- Baseados na biblioteca shadcn/ui
- Totalmente customizáveis

### Configurando Notificações

Para habilitar notificações push:

1. **Configure um servidor de notificações**
2. **Atualize o service worker** com as chaves de API
3. **Implemente a lógica de inscrição** nos componentes

### Integrações Externas

O aplicativo pode ser estendido com:
- APIs de comparação de preços
- Integração com e-commerce
- Sincronização em nuvem
- Análises avançadas

---

## Troubleshooting

### Problemas Comuns

**1. Aplicativo não carrega:**
- Verifique se o Node.js está instalado
- Execute `npm install` para instalar dependências
- Verifique se a porta 5173 está disponível

**2. Dados não são salvos:**
- Verifique se o localStorage está habilitado no navegador
- Limpe o cache do navegador
- Verifique se há espaço suficiente no localStorage

**3. PWA não instala:**
- Verifique se o manifest.json está acessível
- Confirme se o service worker está registrado
- Use HTTPS em produção

**4. Funcionalidades offline não funcionam:**
- Verifique se o service worker está ativo
- Confirme se os recursos estão sendo cacheados
- Teste em modo incógnito

### Logs e Debugging

Para debugar problemas:

1. **Abra as ferramentas de desenvolvedor** (F12)
2. **Verifique o console** para erros JavaScript
3. **Analise a aba Application** para PWA e storage
4. **Use a aba Network** para verificar requisições

### Suporte e Comunidade

Para obter ajuda:
- Consulte a documentação oficial do React
- Verifique a documentação do Tailwind CSS
- Acesse a comunidade shadcn/ui
- Consulte guias de PWA do Google

---

## Conclusão

O Smart Shopping representa uma solução completa e moderna para gerenciamento de compras pessoais. Com sua arquitetura robusta, interface intuitiva e funcionalidades avançadas, o aplicativo oferece uma experiência superior para controle de gastos e comparação de preços.

A implementação como PWA garante que o aplicativo funcione perfeitamente em qualquer dispositivo, com ou sem conexão à internet, proporcionando máxima flexibilidade e conveniência para os usuários.

O código é totalmente open-source e pode ser personalizado conforme suas necessidades específicas, tornando-o uma base sólida para projetos mais complexos ou especializados.

---

**Desenvolvido com ❤️ por Manus AI**  
**Versão 1.0.0 - Junho 2025**

