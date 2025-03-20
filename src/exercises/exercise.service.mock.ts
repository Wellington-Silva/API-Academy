import { Exercise } from "./entities/exercise.entity";

export const exerciseOneMock = {
    id: "1",
    name: "Supino reto",
    description: "Exercício para peitoral",
    muscleGroup: "Peito",
    isDisabled: false,
    completed: false,
    student: {
        id: "1",
        name: "Wellington Silva",
        email: "wellingtonsilva@gmail.com",
        password: "123@well",
        type: 1,
        isDisabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        exercises: []
    },
    instructor: {
        id: "1",
        name: "Fabrício Pachalok",
        email: "fabriciopachalok@gmail.com",
        password: "123@fabricio",
        type: 1,
        isDisabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        exercises: []
    },
    createdAt: new Date(),
    updatedAt: new Date()
} as Exercise;

export const exerciseTwoMock = {
    id: "2",
    name: "Supino inclinado",
    description: "Exercício para peitoral",
    muscleGroup: "Peito",
    isDisabled: false,
    completed: false,
    student: {
        id: "1",
        name: "Wellington Silva",
        email: "wellingtonsilva@gmail.com",
        password: "123@well",
        type: 1,
        isDisabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        exercises: []
    },
    instructor: {
        id: "1",
        name: "Wellington Silva",
        email: "wellingtonsilva@gmail.com",
        password: "123@well",
        type: 1,
        isDisabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        exercises: []
    },
    createdAt: new Date(),
    updatedAt: new Date()
} as Exercise;