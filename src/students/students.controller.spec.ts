import { ExecutionContext } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StudentsController } from './students.controller';
import { studentMock, studentServiceMock } from "./student.service.mock"

describe('StudentsController', () => {
    let studentsController: StudentsController;

    beforeAll(async () => {

        const mockAuthService = {
            validateUser: jest.fn().mockResolvedValue(true),
        };

        const mockJwtAuthGuard = {
            canActivate: jest.fn().mockImplementation((context: ExecutionContext) => {
                return true;
            }),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [StudentsController],
            providers: [
                studentServiceMock,
                { provide: AuthService, useValue: mockAuthService },
            ],
        })
            .overrideGuard(JwtAuthGuard)
            .useValue(mockJwtAuthGuard)
            .compile();

        studentsController = module.get<StudentsController>(StudentsController);
    });

    it('should be defined', () => {
        expect(studentsController).toBeDefined();
    });

    it ('should get student', async ()=> {
        const result = await studentsController.list();
        expect(result.length).toEqual(1);
        expect(result[0].id).toEqual(studentMock.id);
    });

    it ('should get student by id', async ()=> {
        const result = await studentsController.getById(studentMock.id);
        expect(result).toEqual(studentMock);
    });

    it ('should get student by email', async ()=> {
        const result = await studentsController.getByEmail(studentMock.email);
        expect(result).toEqual(studentMock);
    });

    it ('should create student', async ()=> {
        const result = await studentsController.createStudent({ 
            name: studentMock.name, 
            email: studentMock.email, 
            password: studentMock.password 
        });
        expect(result).toEqual(studentMock);
    });

});