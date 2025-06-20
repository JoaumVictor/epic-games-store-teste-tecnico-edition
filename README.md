# Loja de Jogos Completa (Fullstack com NestJS e React)

Este projeto é uma aplicação fullstack completa, composta por:

- **Backend NestJS**
- **Frontend React**
- **Banco de dados MongoDB**

Todos os serviços são orquestrados com Docker Compose para facilitar o desenvolvimento e a implantação.

## 🚀 Como Começar

Siga estas instruções para configurar e executar o projeto em sua máquina local.

### Pré-requisitos

Certifique-se de ter o Docker e o Docker Compose instalados:

- Docker Desktop (inclui o Docker Engine e o Compose)

### 📂 Estrutura do Projeto

```
├── backend/                  # Código-fonte do backend NestJS
│   └── Dockerfile            # Dockerfile para a imagem do backend
├── frontend/                 # Código-fonte do frontend React
│   └── Dockerfile            # Dockerfile para a imagem do frontend
├── docker-compose.yml        # Arquivo de configuração do Docker Compose
└── README.md                 # Este arquivo
```

### ⚙️ Configuração e Execução

#### 1. Clone o Repositório

```bash
git clone git@github.com:JoaumVictor/epic-games-store-teste-tecnico-edition.git
cd git@github.com:JoaumVictor/epic-games-store-teste-tecnico-edition.git
```

#### 2. Construa e Inicie os Serviços

```bash
docker-compose up --build -d
```

- `--build`: Reconstrói as imagens a partir dos Dockerfiles.
- `-d`: Roda os containers em segundo plano (detached).

#### 3. Verifique o Status dos Contêineres

```bash
docker-compose ps
```

### 🌐 Acesso à Aplicação

- **Backend (NestJS)**: [http://localhost:3000](http://localhost:3000)
- **Frontend (React)**: [http://localhost:3001](http://localhost:3001)
- **MongoDB**:

  - Interno (Docker): `mongodb://mongo:27017`
  - Externo (host): `mongodb://localhost:27018`

### ⚠️ Importante para o Frontend

Para que o frontend funcione perfeitamente, é necessário executar o comando:

```bash
npm run seed
```

a fim de semear o banco de dados e obter IDs mockados. Após isso, copie um ID válido e cole dentro do arquivo:

```
epic-games-store-teste-tecnico-edition\frontend\src\context\userContext\index.tsx
```

na constante:

```ts
const ID_MOCKADO = "SEU_ID_AQUI";
```

Sem isso, o frontend não funcionará corretamente.

### 🛑 Parando os Serviços

#### Parar e manter os dados:

```bash
docker-compose down
```

#### Parar e apagar volumes nomeados (incluindo dados):

```bash
docker-compose down -v
```

## 🤝 Contribuição

Sinta-se livre para abrir PRs, sugerir melhorias e contribuir para este projeto!
