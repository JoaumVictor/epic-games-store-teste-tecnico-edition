        # Dockerfile para a aplicação NestJS
        # Usamos uma imagem base leve do Node.js
        FROM node:18-alpine

        # Define o diretório de trabalho dentro do container
        WORKDIR /app

        # Copia os arquivos package.json e package-lock.json para instalar as dependências
        # Isso é feito primeiro para aproveitar o cache do Docker (se as dependências não mudarem)
        COPY package*.json ./

        # Instala as dependências do projeto
        # `--force` pode ser útil se houver problemas de compatibilidade, mas use com cautela.
        # Nativos preferem `npm install` sem `--force`
        RUN npm install

        # Copia todo o código-fonte da aplicação para o container
        COPY . .

        # Constrói a aplicação NestJS (transpila TypeScript para JavaScript)
        RUN npm run build

        # Expõe a porta em que a aplicação NestJS vai rodar
        EXPOSE 3000

        # Comando para iniciar a aplicação quando o container for executado
        # Usa `node dist/main` porque o `npm run start` dentro do container pode ter problemas
        # com caminhos e variáveis de ambiente ao invés de usar o binário.
        # 'start:prod' é geralmente o comando para produção que já usa o JS transpilado.
        CMD [ "npm", "run", "start:prod" ]
        