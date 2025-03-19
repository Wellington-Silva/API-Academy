import { Test, TestingModule } from '@nestjs/testing';
import { InstructorsController } from './instructors.controller';
import { InstructorsService } from './instructors.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthService } from '../auth/auth.service';
import { ExecutionContext } from '@nestjs/common';

describe('InstructorsController', () => {
    let controller: InstructorsController;

    beforeAll(async () => {
        const mockInstructorsService = {
            getById: jest.fn().mockResolvedValue({
                id: '1',
                name: 'Fabrício Pachalok',
                email: 'fabriciopachalok@gmail.com',
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
            controllers: [InstructorsController],
            providers: [
                { provide: InstructorsService, useValue: mockInstructorsService },
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
});
