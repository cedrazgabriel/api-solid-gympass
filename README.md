# Sobre a aplicação

Gympass style app.
Uma aplicação backend, utilizando os conceitos de SOLID com Node JS + Fastify, que simula a experiência do aplicativo Gympass, um aplicativo construído para usuários se conectarem a academias parceiras.

 ## Tecnologias

 Esse projeto foi desenvolvido com as seguintes tecnologias:

 - [Node.js](https://nodejs.org/en/) 
 - [Fastify](https://fastify.dev/)
 - [Prisma](https://www.prisma.io/)
 - [Zod](https://zod.dev/)
 - [Vitest](https://vitest.dev/)
 - [Typescript](https://www.typescriptlang.org/)
 - [Docker](https://www.docker.com/)


## Setup do projeto

Adicionar docker compose up (docker compose up -d) para subir o banco e o docker compose stop para parar o compose.

## RFs (Requisitos funcionais)

- [x] Deve ser possível se cadastrar;
- [x] Deve ser possível se autenticar;
- [x] Deve ser possível obter o perfil de um usuário logado;
- [x] Deve ser possível obter o número de check-ins realizados pelo usuário logado;
- [x] Deve ser possível o usuário obter seu histórico de check-ins;
- [x] Deve ser possível o usuário buscar academias próximas (até 10 km);
- [x] Deve ser possível o usuário buscar academias pelo nome;
- [x] Deve ser possível o usuário realizar check-in em uma academia;
- [x] Deve ser possível validar o check-in de um usuário;
- [x] Deve ser possível cadastrar uma academia;

## RNs (Regras de negócio)

- [x] O usuário não deve poder se cadastrar com um e-mail duplicado;
- [x] O usuário não pode fazer 2 ou mais check-ins no mesmo dia;
- [x] O usuário não pode fazer check-in se não estiver perto (100m) da academia;
- [x] O check-in só pode ser validado após 20 minutos após ser criado;
- [x] O check-in só pode ser validado por administradores;
- [x] A academia só pode ser cadastrada por administradores;

## RNFs (Requisitos não-funcionais)

- [x] A senha do usuário precisa estar criptografada;
- [x] Os dados da aplicação precisam estar persistidos em um banco de dados PostgreSQL;
- [x] Todas listas de dados precisam estar páginadas com 20 itens por página;
- [x] O usuário deve ser identificado por um JWT (JSON Web Token);