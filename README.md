API-Academy é uma API RESTful desenvolvida com NestJS e TypeScript, voltada para o gerenciamento de academias. O projeto foi estruturado com foco em boas práticas de desenvolvimento, arquitetura modular e testes automatizados. Ele oferece uma base sólida para aplicações escaláveis, com autenticação JWT, organização por módulos (como alunos, instrutores e exercícios), e integração com bancos de dados relacionais usando TypeORM.

---

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)  
- [Funcionalidades](#funcionalidades)  
- [Tecnologias Utilizadas](#tecnologias-utilizadas)  
- [Instalação e Uso](#instalação-e-uso)  
- [Estrutura do Repositório](#estrutura-do-repositório)  
- [Contribuição](#contribuição)  

---

## ⚙️ Funcionalidades

- ✅ Endpoints CRUD exemplares (GET, POST, PUT, DELETE) para instrutor.
- ✅ Endpoints CRUD exemplares para aluno.  
- ✅ Testes unitários

---

## 🧰 Tecnologias Utilizadas

- Nest.JS
- Typescript  
- PostgreSQL + TypeORM
- JWT para autenticação

---

## 🚀 Instalação e Uso

```bash
# Clone o repositório
git clone https://github.com/Wellington-Silva/API-Academy.git

# Acesse o diretório do projeto
cd API-Academy

# Restaure as dependências
npm install

# Para rodar em desenvolvimento
$ npm run start

# Para rodar em modo de observação (watch mode)
$ npm run start:dev

# Para rodar em produção
$ npm run start:prod
```

---

## 🗂️ Estrutura do Repositório

```bash
├── src
    ├── app.controller.spec.ts
    ├── app.controller.ts
    ├── app.module.ts
    ├── app.service.ts
    ├── auth
    │   ├── auth.controller.ts
    │   ├── auth.module.ts
    │   ├── auth.service.ts
    │   ├── custom-request.ts
    │   ├── jwt-auth.guard.ts
    │   ├── jwt.strategy.ts
    │   └── repositories
    │   │   └── auth.reposity.ts
    ├── config
    │   └── ormconfig.ts
    ├── exercises
    │   ├── entities
    │   │   └── exercise.entity.ts
    │   ├── exercise.controller.ts
    │   ├── exercise.module.ts
    │   └── exercise.service.ts
    ├── global.d.ts
    ├── instructors
    │   ├── entities
    │   │   └── instructor.entity.ts
    │   ├── instructors.controller.spec.ts
    │   ├── instructors.controller.ts
    │   ├── instructors.module.ts
    │   ├── instructors.service.spec.ts
    │   ├── instructors.service.ts
    │   └── repositories
    │   │   └── instructors.repository.ts
    ├── main.ts
    └── students
    │   ├── entities
    │       └── student.entity.ts
    │   ├── repositories
    │       └── students.repository.ts
    │   ├── students.controller.spec.ts
    │   ├── students.controller.ts
    │   ├── students.module.ts
    │   ├── students.service.spec.ts
    │   └── students.service.ts
├── test
    ├── app.e2e-spec.ts
    └── jest-e2e.json
├── .env
├── .gitignore
├── .prettierrc
├── README.md
├── eslint.config.mjs
├── nest-cli.json
├── package-lock.json
├── package.json
├── tsconfig.build.json
└── tsconfig.json
```

---

## 📬 Contato
Wellington Silva   
📧 Email: wellingtonsilva112000@gmail.com  
🔗 GitHub: [@Wellington-Silva](https://github.com/Wellington-Silva)