import { Test, TestingModule } from '@nestjs/testing';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthService } from '../auth/auth.service';

describe('StudentsController', () => {
    let studentsController: StudentsController;

    beforeAll(async () => {

        const mockStudentService = {
            getById: jest.fn().mockResolvedValue({
                id: '1',
                name: 'Wellington Silva',
                email: 'wellingtonsilva@gmail.com',
            })
        };

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
                { provide: StudentsService, useValue: mockStudentService },
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

});