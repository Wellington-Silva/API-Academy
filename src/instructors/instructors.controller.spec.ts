import { ExecutionContext } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InstructorsController } from './instructors.controller';
import { instructorMock, instructorServiceMock } from './instructor.service.mock';

describe('InstructorsController', () => {
    let controller: InstructorsController;

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
            controllers: [InstructorsController],
            providers: [
                instructorServiceMock,
                { provide: AuthService, useValue: mockAuthService },
            ],
        })
            .overrideGuard(JwtAuthGuard)
            .useValue(mockJwtAuthGuard)
            .compile();

        controller = module.get<InstructorsController>(InstructorsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should get users', async () => {
        const result = await controller.list();
        expect(result.length).toEqual(1);
        expect(result[0].id).toEqual(instructorMock.id);
    });

    it('should get an user', async () => {
        const result = await controller.getByEmail(instructorMock.email);
        expect(result).toEqual(instructorMock);
    });

    it('should create user', async () => {
        const result = await controller.register({ 
            name: instructorMock.name, 
            email: instructorMock.email, 
            password: instructorMock.password 
        });

        expect(result).toEqual(instructorMock);
    });

});
