├── .gitignore
├── .prettierrc
├── README.md
├── eslint.config.mjs
├── nest-cli.json
├── package-lock.json
├── package.json
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
├── tsconfig.build.json
└── tsconfig.json

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```