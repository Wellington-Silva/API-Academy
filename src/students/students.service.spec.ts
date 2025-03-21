import { NotFoundException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { StudentsService } from './students.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ExercisesService } from '../exercises/exercise.service';
import { StudentsRepository } from './repositories/students.repository';

describe('StudentsService', () => {

    let studentsService: StudentsService;
    let studentsRepository: StudentsRepository;
    let authService: AuthService;

    const studentOne = {
        id: "1", name: "Wellington Silva", email: "wellingtonsilva@gmail.com", password: "123@well", type: 0, isDisabled: false, createdAt: new Date, updatedAt: new Date, exercises: []
    };

    const studentTwo = {
        id: "2", name: "Gleice Ellen", email: "gleiceellen@gmail.com", password: "123@ge", type: 0, isDisabled: false, createdAt: new Date, updatedAt: new Date, exercises: []
    };

    const mockStudentsRepository = {
        findAll: jest.fn(),
        findById: jest.fn(),
        findByEmail: jest.fn(),
        create: jest.fn()
    };

    const mockAuthService = { validateUser: jest.fn(), generateToken: jest.fn() };
    const mockExercisesService = {};

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                StudentsService,
                { provide: StudentsRepository, useValue: mockStudentsRepository },
                { provide: AuthService, useValue: mockAuthService },
                { provide: ExercisesService, useValue: mockExercisesService },
            ]
        }).compile();

        studentsService = module.get<StudentsService>(StudentsService);
        studentsRepository = module.get<StudentsRepository>(StudentsRepository) as jest.Mocked<StudentsRepository>;
        authService = module.get<AuthService>(AuthService);
    });

    it("should be defined", () => {
        expect(studentsService).toBeDefined();
    });

    it('should a list students', async () => {
        const students = [studentOne, studentTwo];
        studentsRepository.findAll = jest.fn().mockReturnValueOnce(students);
        const result = await studentsService.list();
        expect(result.length).toEqual(students.length);
        expect(result).toEqual(students);
        expect(studentsRepository.findAll).toHaveBeenCalled();
    });

    it('should throw NotFoundException when student is not found', async () => {
        studentsRepository.findAll = jest.fn().mockResolvedValue(null);
        await expect(studentsService.list()).rejects.toThrow(NotFoundException);
    });

    it('should return an student when found', async () => {
        const id = "1";
        jest.spyOn(studentsRepository, 'findById').mockResolvedValueOnce(studentOne);
        const result = await studentsService.getById(id);
        expect(result).toEqual(studentOne);
    });

    it('should throw NotFoundException when student is not found by id', async () => {
        studentsRepository.findById = jest.fn().mockResolvedValue(null);
        await expect(studentsService.getById("999")).rejects.toThrow(NotFoundException);
    });

    it('should return an student when found by email', async () => {
        jest.spyOn(studentsRepository, 'findByEmail').mockResolvedValueOnce(studentOne);
        const result = await studentsService.findByEmail(studentOne.email);
        expect(result).toEqual(studentOne);
        expect(studentsRepository.findByEmail).toHaveBeenCalled();
    });

    it('should throw NotFoundException when student is not found by email', async () => {
        studentsRepository.findByEmail = jest.fn().mockResolvedValueOnce(null);
        await expect(studentsService.findByEmail("ABC")).rejects.toThrow(NotFoundException);
    });

    it('should create student', async () => {
        const mockToken = "mocked-jwt-token"; // Token fictício
    
        studentsRepository.findByEmail = jest.fn().mockResolvedValue(null);
    
        studentsRepository.create = jest.fn().mockResolvedValue({
            id: "1",
            name: "Wellington Silva",
            email: "wellingtonsilva@gmail.com",
            password: "hashedPassword" // Simulando a senha já criptografada
        });
    
        authService.generateToken = jest.fn().mockReturnValue({ access_token: mockToken });
    
        const result = await studentsService.create(
            "Wellington Silva",
            "wellingtonsilva@gmail.com",
            "123@well"
        );
    
        expect(studentsRepository.create).toHaveBeenCalledWith({
            name: "Wellington Silva",
            email: "wellingtonsilva@gmail.com",
            password: expect.any(String)
        });
    
        expect(result).toEqual({ access_token: mockToken });
    
        expect(authService.generateToken).toHaveBeenCalledWith({
            id: "1",
            name: "Wellington Silva",
            email: "wellingtonsilva@gmail.com",
            password: "hashedPassword"
        });
    });

});