# 🎮 Epic Games Store - Teste Técnico Edition (Backend)

Bem-vindo ao backend do projeto **Epic Games Store - Teste Técnico Edition**!  
Este serviço foi desenvolvido com **NestJS**, um framework progressivo de Node.js, e utiliza **MongoDB** como banco de dados, tudo orquestrado via **Docker** para um ambiente de desenvolvimento e deploy consistente.

---

## 🚀 Visão Geral

Este backend simula as funcionalidades essenciais de uma loja de jogos, incluindo gerenciamento de jogos, usuários e histórico de transações.

### Recursos Principais:

- **Gerenciamento de Jogos (CRUD):** Adicione, visualize, atualize e remova títulos de jogos com detalhes como nome, descrição, preço, capa, banner, desconto, gêneros e mais.
- **Gerenciamento de Usuários:** Base para autenticação e dados de usuário.
- **Histórico de Transações:** Registra quais jogos foram comprados por qual usuário, data, valor e desconto aplicado.
- **Dockerização:** Ambiente de desenvolvimento e produção empacotado e isolado, garantindo fácil configuração e portabilidade.

---

## 🛠️ Tecnologias Utilizadas

- **NestJS:** Framework Node.js para construção de aplicações escaláveis e eficientes.
- **MongoDB:** Banco de dados NoSQL de documentos, flexível e performático.
- **Mongoose:** Biblioteca para modelagem de objetos MongoDB para ambiente Node.js, fácil de usar com NestJS.
- **Docker:** Plataforma para desenvolvimento, envio e execução de aplicativos usando containers.
- **TypeScript:** Superconjunto de JavaScript que adiciona tipagem estática.
- **class-validator:** Biblioteca para validação de objetos utilizando decoradores.

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas:

- **Git**
- **Node.js (v18 ou superior)**
- **Docker Desktop**

---

## 📦 Como Executar o Projeto

### 1. Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/epic-games-store-teste-tecnico-edition.git
cd epic-games-store-teste-tecnico-edition
```

### 2. Instalar as Dependências

```bash
cd backend
npm install
npm install @nestjs/mongoose mongoose @nestjs/config class-validator class-transformer
```

### 3. Iniciar com Docker Compose

```bash
cd .. # Volta para a pasta raiz
docker-compose up --build
```

O backend estará acessível em `http://localhost:3000`.

---

## ⚙️ Variáveis de Ambiente

As principais variáveis utilizadas são:

- `MONGO_URI`: URL de conexão com MongoDB (`mongodb://mongodb:27017/game_store`)
- `PORT`: Porta da aplicação NestJS (padrão: `3000`)

---

## 📍 Endpoints da API

### 1. Módulo de Jogos (`/games`) 🎮

| Método | Rota       | Descrição                          |
| ------ | ---------- | ---------------------------------- |
| POST   | /games     | Cria um novo jogo                  |
| GET    | /games     | Retorna todos os jogos             |
| GET    | /games/:id | Retorna um jogo pelo ID            |
| PUT    | /games/:id | Atualiza um jogo existente pelo ID |
| DELETE | /games/:id | Remove um jogo pelo ID             |

#### Exemplo de Payload (POST ou PUT)

```json
{
  "name": "The Witcher 3: Wild Hunt",
  "description": "Um RPG de mundo aberto aclamado.",
  "cover": "https://example.com/witcher3_cover.jpg",
  "banner": "https://example.com/witcher3_banner.jpg",
  "price": 59.99,
  "discount": 15,
  "genre": ["RPG", "Aventura"],
  "releaseDate": "2015-05-19T00:00:00.000Z",
  "developer": "CD Projekt Red",
  "publisher": "CD Projekt",
  "platforms": ["PC", "PS4", "Xbox One", "Nintendo Switch"],
  "rating": 5,
  "isFeatured": true
}
```

---

### 2. Módulo de Usuários (`/users`) 🧑‍🤝‍🧑

| Método | Rota   | Descrição                 |
| ------ | ------ | ------------------------- |
| GET    | /users | Retorna todos os usuários |

> ⚠️ Este módulo está preparado para expansão. Os endpoints de CRUD completos e autenticação ainda não foram implementados.

---

### 3. Módulo de Transações (`/transactions`) 💸

| Método | Rota          | Descrição                   |
| ------ | ------------- | --------------------------- |
| POST   | /transactions | Registra uma nova transação |
| GET    | /transactions | Retorna todas as transações |

#### Exemplo de Payload (POST /transactions)

```json
{
  "game": "60c72b2f9b1d8c001c8e4d21",
  "user": "60c72b2f9b1d8c001c8e4d22",
  "amount": 49.99,
  "discountApplied": 10
}
```

---

## 💡 Próximos Passos e Melhorias Futuras

- **Autenticação e Autorização:** Implementar JWT.
- **Testes:** Unitários, integração e end-to-end.
- **Paginação e Filtros:** Para jogos, usuários e transações.
- **Validação de Entradas:** Regras de negócio mais complexas.
- **Log:** Sistema de log robusto.
- **Documentação da API:** Usar Swagger para documentação interativa.

---

Sinta-se à vontade para explorar, modificar e expandir este projeto!  
Se tiver qualquer dúvida ou precisar de ajuda, é só chamar. 😉
