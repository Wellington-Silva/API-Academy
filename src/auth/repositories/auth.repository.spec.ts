import { DataSource, Repository } from 'typeorm';
import { AuthRepository } from './auth.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { Student } from '../../students/entities/student.entity';
import { Instructor } from '../../instructors/entities/instructor.entity';

describe('AuthRepository', () => {
    let authRepository: AuthRepository;
    let studentRepositoryMock: Partial<Repository<Student>>;
    let instructorRepositoryMock: Partial<Repository<Instructor>>;
    let dataSourceMock: Partial<DataSource>;

    beforeAll(async () => {
        studentRepositoryMock = {
            findOne: jest.fn(),
        };

        instructorRepositoryMock = {
            findOne: jest.fn(),
        };

        dataSourceMock = {
            getRepository: jest.fn().mockImplementation((entity) => {
                if (entity === Student) return studentRepositoryMock;
                if (entity === Instructor) return instructorRepositoryMock;
                return null;
            }),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthRepository,
                { provide: DataSource, useValue: dataSourceMock },
            ],
        }).compile();

        authRepository = module.get<AuthRepository>(AuthRepository);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(authRepository).toBeDefined();
    });

    it('should return a student if found', async () => {
        const studentMock = { id: '1', email: 'student@example.com' } as Student;
        (studentRepositoryMock.findOne as jest.Mock).mockResolvedValue(studentMock);

        const result = await authRepository.findUserByEmail('student@example.com');

        expect(result).toEqual(studentMock);
        expect(studentRepositoryMock.findOne).toHaveBeenCalledWith({ where: { email: 'student@example.com' } });
        expect(instructorRepositoryMock.findOne).not.toHaveBeenCalled();
    });

    it('should return an instructor if student is not found', async () => {
        const instructorMock = { id: '2', email: 'instructor@example.com' } as Instructor;
        (studentRepositoryMock.findOne as jest.Mock).mockResolvedValue(null);
        (instructorRepositoryMock.findOne as jest.Mock).mockResolvedValue(instructorMock);

        const result = await authRepository.findUserByEmail('instructor@example.com');

        expect(result).toEqual(instructorMock);
        expect(studentRepositoryMock.findOne).toHaveBeenCalledWith({ where: { email: 'instructor@example.com' } });
        expect(instructorRepositoryMock.findOne).toHaveBeenCalledWith({ where: { email: 'instructor@example.com' } });
    });

    it('should return null if neither student nor instructor is found', async () => {
        (studentRepositoryMock.findOne as jest.Mock).mockResolvedValue(null);
        (instructorRepositoryMock.findOne as jest.Mock).mockResolvedValue(null);

        const result = await authRepository.findUserByEmail('notfound@example.com');

        expect(result).toBeNull();
        expect(studentRepositoryMock.findOne).toHaveBeenCalledWith({ where: { email: 'notfound@example.com' } });
        expect(instructorRepositoryMock.findOne).toHaveBeenCalledWith({ where: { email: 'notfound@example.com' } });
    });

});