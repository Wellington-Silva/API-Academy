import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthRepository } from './repositories/auth.repository';
import { UnauthorizedException } from '@nestjs/common';

jest.mock('bcrypt'); 

describe('AuthService', () => {
    let authService: AuthService;
    let authRepositoryMock: { findUserByEmail: jest.Mock };
    let bcryptCompareMock: jest.SpyInstance;
    let jwtServiceMock: { sign: jest.Mock };

    beforeAll(async () => {

        jwtServiceMock = { sign: jest.fn().mockReturnValue('mocked_token') };

        authRepositoryMock = {
            findUserByEmail: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: JwtService,
                    useValue: jwtServiceMock,
                },
                {
                    provide: AuthRepository,
                    useValue: authRepositoryMock,
                },
            ]
        }).compile();

        authService = module.get<AuthService>(AuthService);
    });

    beforeEach(() => {
        bcryptCompareMock = jest.spyOn(bcrypt, 'compare');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(authService).toBeDefined();
    });

    it('should return user data when credentials are valid', async () => {
        const mockUser = { id: '1', email: 'test@example.com', password: 'hashedPassword', type: 1 };
        authRepositoryMock.findUserByEmail.mockResolvedValue(mockUser);
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);

        const result = await authService.validateUser('test@example.com', 'validPassword');

        expect(result).toEqual({ id: mockUser.id, email: mockUser.email, type: mockUser.type });
        expect(authRepositoryMock.findUserByEmail).toHaveBeenCalledWith('test@example.com');
        expect(bcryptCompareMock).toHaveBeenCalledWith('validPassword', mockUser.password);
    });

    it('should throw UnauthorizedException if user is not found', async () => {
        authRepositoryMock.findUserByEmail.mockResolvedValue(null);

        await expect(authService.validateUser('notfound@example.com', 'password'))
            .rejects
            .toThrow(UnauthorizedException);

        expect(authRepositoryMock.findUserByEmail).toHaveBeenCalledWith('notfound@example.com');
        expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
        const mockUser = { id: '1', email: 'test@example.com', password: 'hashedPassword', type: 1 };
        authRepositoryMock.findUserByEmail.mockResolvedValue(mockUser);
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);

        await expect(authService.validateUser('test@example.com', 'wrongPassword'))
            .rejects
            .toThrow(UnauthorizedException);

        expect(authRepositoryMock.findUserByEmail).toHaveBeenCalledWith('test@example.com');
        expect(bcryptCompareMock).toHaveBeenCalledWith('wrongPassword', mockUser.password);
    });

    const mockUser = { id: '1', email: 'test@example.com', type: 1 };

    it('should return access token on login', async () => {
        const result = await authService.login(mockUser);

        expect(result).toEqual({ access_token: 'mocked_token' });
        expect(jwtServiceMock.sign).toHaveBeenCalledWith({
            sub: mockUser.id,
            email: mockUser.email,
            type: mockUser.type,
        });
    });

    it('should return access token on generateToken', async () => {
        const result = await authService.generateToken(mockUser);

        expect(result).toEqual({ access_token: 'mocked_token' });
        expect(jwtServiceMock.sign).toHaveBeenCalledWith({
            sub: mockUser.id,
            email: mockUser.email,
            type: mockUser.type,
        });
    });

});