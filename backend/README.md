# 🎮 Epic Games Store - Teste Técnico Edition (Backend)

Bem-vindo ao backend do projeto **Epic Games Store - Teste Técnico Edition**!  
Este serviço foi desenvolvido com **NestJS**, um framework progressivo para Node.js, e utiliza **MongoDB** como banco de dados. Toda a aplicação está orquestrada via **Docker** para garantir um ambiente consistente e portátil de desenvolvimento e produção.

---

## 🚀 Visão Geral

Este backend simula as funcionalidades essenciais de uma loja de jogos, incluindo o gerenciamento de jogos, usuários e histórico de transações.

### Recursos Principais:

- **Gerenciamento de Jogos (CRUD):** Adicione, visualize, atualize e remova jogos com detalhes como nome, descrição, preço, capa, banner, desconto, gêneros, entre outros.
- **Gerenciamento de Usuários:** Endpoints para visualização e futura expansão para autenticação e gerenciamento completo.
- **Histórico de Transações:** Registro das compras realizadas, com informações sobre usuário, jogo, valor e desconto aplicado.
- **Dockerização:** Ambiente isolado para desenvolvimento e produção, facilitando configuração e deploy.

---

## 🛠️ Tecnologias Utilizadas

- **NestJS:** Framework para construção de aplicações Node.js escaláveis e eficientes.
- **MongoDB:** Banco de dados NoSQL orientado a documentos, flexível e performático.
- **Mongoose:** Biblioteca para modelagem dos dados MongoDB no ambiente Node.js.
- **Docker:** Plataforma para criação, deploy e execução de containers.
- **TypeScript:** Superset do JavaScript com tipagem estática.
- **class-validator:** Biblioteca para validação de dados através de decoradores.

---

## 📋 Pré-requisitos

Antes de iniciar, certifique-se de que possui as seguintes ferramentas instaladas:

- **Git**
- **Node.js (v18 ou superior)**
- **Docker Desktop**

---

## 📦 Como Executar o Projeto

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/epic-games-store-teste-tecnico-edition.git
cd epic-games-store-teste-tecnico-edition
```

### 2. Instale as dependências

```bash
cd backend
npm install
```

### 3. Execute com Docker Compose

```bash
cd .. # Voltar para a raiz do projeto
docker-compose up --build
```

O backend estará disponível em `http://localhost:3000`.

---

## ⚙️ Variáveis de Ambiente

As variáveis principais são:

- `MONGO_URI`: URL de conexão com o MongoDB (exemplo: `mongodb://mongodb:27017/game_store`)
- `PORT`: Porta em que a aplicação NestJS será executada (padrão: `3000`)

---

## 📚 Documentação da API

Para facilitar o uso e entendimento de todas as rotas disponíveis, suas entradas (payloads) e respostas, basta rodar a aplicação e acessar a documentação interativa gerada pelo Swagger.

A documentação está disponível em:

```
  http://localhost:3000/api
```

Lá você poderá explorar todas as rotas, ver os parâmetros esperados, os exemplos de request e response, e testar as chamadas diretamente pelo navegador.

---

## 💡 Próximos Passos e Melhorias Futuras

- **Autenticação e Autorização:** Implementar JWT.
- **Testes:** Unitários, integração e end-to-end.
- **Paginação e Filtros:** Para jogos, usuários e transações.
- **Validação de Entradas:** Regras de negócio mais complexas.

---

Sinta-se à vontade para explorar, modificar e expandir este projeto! 😉
