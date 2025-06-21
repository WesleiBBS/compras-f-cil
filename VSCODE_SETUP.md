# Como Abrir o Projeto no VS Code

## Passo a Passo

### 1. Abrir o VS Code
- Abra o Visual Studio Code no seu computador

### 2. Abrir a Pasta do Projeto
- No VS Code, vá em **File > Open Folder** (ou Ctrl+K, Ctrl+O)
- Navegue até a pasta `shopping-pwa` 
- Selecione a pasta e clique em "Selecionar Pasta"

### 3. Instalar Extensões Recomendadas
Para uma melhor experiência de desenvolvimento, instale estas extensões:

- **ES7+ React/Redux/React-Native snippets** - Snippets para React
- **Tailwind CSS IntelliSense** - Autocomplete para Tailwind
- **Prettier - Code formatter** - Formatação automática de código
- **Auto Rename Tag** - Renomeia tags HTML automaticamente
- **Bracket Pair Colorizer** - Coloriza parênteses e chaves
- **GitLens** - Melhor integração com Git

### 4. Abrir o Terminal Integrado
- Pressione **Ctrl+`** (ou View > Terminal)
- O terminal será aberto na pasta do projeto

### 5. Instalar Dependências
No terminal, execute:
```bash
npm install
```

### 6. Executar o Projeto
Após a instalação das dependências, execute:
```bash
npm run dev
```

### 7. Acessar o Aplicativo
- O aplicativo estará disponível em: http://localhost:5173
- Abra este endereço no seu navegador

## Estrutura de Arquivos no VS Code

```
shopping-pwa/
├── 📁 public/              # Arquivos públicos (manifest, service worker)
├── 📁 src/                 # Código fonte principal
│   ├── 📁 components/      # Componentes React
│   ├── 📁 hooks/          # Hooks personalizados
│   ├── 📁 lib/            # Bibliotecas e utilitários
│   ├── 📄 App.jsx         # Componente principal
│   └── 📄 main.jsx        # Ponto de entrada
├── 📄 package.json        # Dependências do projeto
├── 📄 README.md           # Documentação completa
└── 📄 vite.config.js      # Configuração do Vite
```

## Comandos Úteis

### Desenvolvimento
```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Cria build de produção
npm run preview      # Visualiza build de produção
```

### Formatação de Código
```bash
npm run lint         # Verifica problemas no código
npm run format       # Formata código automaticamente
```

## Dicas para Desenvolvimento

### 1. Hot Reload
- O projeto usa Vite com hot reload
- Salve qualquer arquivo e veja as mudanças instantaneamente no navegador

### 2. Estrutura de Componentes
- Cada tela é um componente separado em `src/components/`
- Os hooks estão organizados em `src/hooks/`
- O banco de dados local está em `src/lib/database.js`

### 3. Estilização
- O projeto usa Tailwind CSS
- Classes utilitárias para estilização rápida
- Componentes UI pré-construídos em `src/components/ui/`

### 4. Debugging
- Use o console do navegador (F12) para debug
- React DevTools é recomendado para desenvolvimento React
- Vite oferece source maps para debugging

## Personalizações Comuns

### Alterar Cores do Tema
Edite o arquivo `src/App.css` e modifique as variáveis CSS:
```css
:root {
  --primary: sua-cor-aqui;
  --background: sua-cor-aqui;
}
```

### Adicionar Nova Tela
1. Crie um novo arquivo em `src/components/`
2. Adicione a importação em `App.jsx`
3. Adicione a nova tela no objeto `screens`

### Modificar Banco de Dados
- Edite `src/lib/database.js` para adicionar novas funcionalidades
- Crie novos hooks em `src/hooks/` para gerenciar os dados

## Problemas Comuns

### Erro de Dependências
```bash
# Limpe o cache e reinstale
rm -rf node_modules package-lock.json
npm install
```

### Porta em Uso
```bash
# Use uma porta diferente
npm run dev -- --port 3000
```

### Problemas de Cache
```bash
# Limpe o cache do Vite
npm run dev -- --force
```

## Próximos Passos

1. **Explore o código** - Comece pelo `App.jsx` e navegue pelos componentes
2. **Teste as funcionalidades** - Execute o projeto e teste todas as telas
3. **Personalize** - Modifique cores, textos e funcionalidades conforme necessário
4. **Adicione recursos** - Use a documentação para adicionar novas funcionalidades

## Suporte

Se encontrar problemas:
1. Consulte o `README.md` para documentação completa
2. Verifique o console do navegador para erros
3. Use as ferramentas de desenvolvedor do VS Code
4. Consulte a documentação oficial do React e Vite

**Bom desenvolvimento! 🚀**

