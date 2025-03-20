import { Student } from "./entities/student.entity";
import { StudentsService } from "./students.service";

export const studentMock = {
    id: "1",
    name: "Wellington Silva",
    email: "wellingtonsilva@gmail.com",
    password: "123@well",
    type: 1,
    isDisabled: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    exercises: []
} as Student;

export const studentServiceMock = {
    provide: StudentsService,
    useValue: {
        list: jest.fn().mockResolvedValue([studentMock]),
        getById: jest.fn().mockResolvedValue(studentMock),
        create: jest.fn().mockResolvedValue(studentMock),
        findByEmail: jest.fn().mockResolvedValue(studentMock)
    }
};