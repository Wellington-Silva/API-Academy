import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {

    let authController: AuthController;
    let authServiceMock: { validateUser: jest.Mock; login: jest.Mock };

    beforeAll(async () => {

        authServiceMock = {
            validateUser: jest.fn().mockResolvedValue({ id: '1', email: 'test@example.com', type: 1 }),
            login: jest.fn().mockResolvedValue({ access_token: 'token-fictício' }),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: authServiceMock,
                },
            ]
        }).compile();

        authController = module.get<AuthController>(AuthController);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(authController).toBeDefined();
    });

    it('should make login', async () => {
        const body = { email: 'test@example.com', password: '123@test' };

        const result = await authController.login(body);

        expect(result).toEqual({ access_token: 'token-fictício' });

        expect(authServiceMock.validateUser).toHaveBeenCalledWith(body.email, body.password);
        expect(authServiceMock.login).toHaveBeenCalledWith({ id: '1', email: 'test@example.com', type: 1 });
    });

});