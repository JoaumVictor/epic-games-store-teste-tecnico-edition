# Frontend da Loja de Jogos (React com Craco e TypeScript)

Este diretório contém o código-fonte da aplicação frontend construída com React, utilizando Craco para configuração personalizada e TypeScript para tipagem estática. O projeto é otimizado com Tailwind CSS para estilização rápida e responsiva.

## 🚀 Tecnologias Utilizadas

- **React**: Biblioteca JavaScript para construção de interfaces de usuário.
- **TypeScript**: Superconjunto tipado de JavaScript.
- **Craco**: Ferramenta para configurar aplicativos Create React App sem ejetar.
- **Tailwind CSS**: Framework CSS utility-first para estilização rápida.
- **Axios**: Cliente HTTP baseado em Promises para o navegador e Node.js.
- **Framer Motion**: Biblioteca para animações em React.
- **Headless UI**: Componentes de UI sem estilo para maior flexibilidade.
- **React Router DOM**: Biblioteca para roteamento declarativo no React.
- **Yup**: Validação de schema para formulários.
- **Formik**: Solução para gerenciamento de estados de formulários.

## 📦 Como Começar

Siga estas instruções para configurar e executar o frontend em seu ambiente de desenvolvimento.

### Pré-requisitos

Certifique-se de ter o Node.js e o npm (ou Yarn) instalados em sua máquina.

- Node.js (versão LTS recomendada)
- npm (geralmente vem com o Node.js) ou Yarn

### Instalação

Navegue até o diretório do frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
# ou
yarn install
```

### Execução

Para iniciar o servidor de desenvolvimento do frontend:

```bash
npm start
# ou
yarn start
```

O aplicativo estará acessível em `http://localhost:3001` (ou na próxima porta disponível se a 3001 estiver em uso).

## ⚠ Considerações Importantes

Este frontend depende de um serviço de backend rodando (normalmente em `http://localhost:3000`). Certifique-se de que seu backend esteja ativo para que a aplicação funcione corretamente. Se você estiver usando o `docker-compose.yml` da raiz do projeto, ele cuidará da inicialização do backend.

As requisições da API são feitas através da instância do Axios configurada em `src/api/index.ts`. Se o seu backend estiver em um endereço diferente, você precisará ajustar a base URL lá.

Sinta-se à vontade para explorar e contribuir com o desenvolvimento deste frontend!
