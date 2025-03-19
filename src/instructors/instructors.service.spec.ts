import { Test, TestingModule } from '@nestjs/testing';
import { InstructorsService } from './instructors.service';
import { InstructorsRepository } from './repositories/instructors.repository';
import { NotFoundException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';

describe('InstructorsService', () => {
    let instructorService: InstructorsService;
    let instructorsRepo: InstructorsRepository;
    let authService: AuthService;

    const instructorOne = { 
        id: "1", name: "Fabrício Pachalok", email: "fabriciopachalok@gmail.com", password: "123@fabricio"
    };

    const instructorTwo = {
        id: "1", name: "Larissa Melo", email: "larissamelo@gmail.com", password: "123@larissa"
    };

    beforeAll(async () => {
        const mockInstructorsRepo = {
            getById: jest.fn(),
            create: jest.fn()
        };

        const mockAuthService = { validateUser: jest.fn(), generateToken: jest.fn() };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                InstructorsService,
                {
                    provide: InstructorsRepository,
                    useValue: mockInstructorsRepo,
                },
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                },
            ],
        }).compile();

        instructorService = module.get<InstructorsService>(InstructorsService);
        instructorsRepo = module.get<InstructorsRepository>(InstructorsRepository);
        authService = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(instructorService).toBeDefined();
    });

    it('should return an instructor when found', async () => {
        const id = "1";
        (instructorsRepo.getById as jest.Mock).mockResolvedValue(instructorOne);
        const result = await instructorService.getById(id);
        expect(result).toEqual(instructorOne);
    });

    it('should throw NotFoundException when instructor is not found', async () => {
        instructorsRepo.getById = jest.fn().mockResolvedValue(null);
        await expect(instructorService.getById("999")).rejects.toThrow(NotFoundException);
    });

    it('Should get instructors', async () => {
        const instructors = [instructorOne, instructorTwo];
        instructorsRepo.listAll = jest.fn().mockReturnValueOnce(instructors);
        const result = await instructorService.list();
        expect(result.length).toEqual(instructors.length);
    });

    it('should return an instructor when found by email', async () => {
        const email = "fabriciopachalok@gmail.com";
        instructorsRepo.getByEmail = jest.fn().mockReturnValueOnce(instructorOne);
        const result = await instructorService.getByEmail(email);
        expect(result).toEqual(instructorOne);
    });

    it('should throw NotFoundException when instructor is not found by email', async () => {
        instructorsRepo.getByEmail = jest.fn().mockResolvedValue(null);
        await expect(instructorService.getByEmail("ABC")).rejects.toThrow(NotFoundException);
    });

    it('should register an instructor', async () => {
        const mockToken = "mocked-jwt-token"; // Token fictício
    
        instructorsRepo.getByEmail = jest.fn().mockResolvedValue(null);
    
        instructorsRepo.create = jest.fn().mockResolvedValue({
            id: "1",
            name: "Fabrício Pachalok",
            email: "fabriciopachalok@gmail.com",
            password: "hashedPassword" // Simulando a senha já criptografada
        });
    
        // Mockando `authService.generateToken` para garantir que retorna um token fixo
        authService.generateToken = jest.fn().mockReturnValue({ access_token: mockToken });
    
        const result = await instructorService.register(
            "Fabrício Pachalok",
            "fabriciopachalok@gmail.com",
            "123@fabricio"
        );
    
        // Verifica se a função `create` foi chamada corretamente
        expect(instructorsRepo.create).toHaveBeenCalledWith({
            name: "Fabrício Pachalok",
            email: "fabriciopachalok@gmail.com",
            password: expect.any(String) // O hash da senha deve ser uma string
        });
    
        // Verifica se o token foi gerado corretamente
        expect(result).toEqual({ access_token: mockToken });
    
        // Verifica se `authService.generateToken` foi chamado com o instrutor criado
        expect(authService.generateToken).toHaveBeenCalledWith({
            id: "1",
            name: "Fabrício Pachalok",
            email: "fabriciopachalok@gmail.com",
            password: "hashedPassword"
        });
    });

});





