import { Instructor } from "./entities/instructor.entity";
import { InstructorsService } from "./instructors.service";

export const instructorMock = {
    id: "1",
    name: "Fabrício Pachalok",
    email: "fabriciopachalok@gmail.com",
    password: "123@fabricio",
    type: 1,
    isDisabled: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    exercises: []
} as Instructor;

export const instructorServiceMock = {
    provide: InstructorsService,
    useValue: {
        list: jest.fn().mockResolvedValue([instructorMock]),
        getById: jest.fn().mockResolvedValue(instructorMock),
        register: jest.fn().mockResolvedValue(instructorMock),
        getByEmail: jest.fn().mockResolvedValue(instructorMock)
    }
};