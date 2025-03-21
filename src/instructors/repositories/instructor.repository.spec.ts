import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { Instructor } from '../entities/instructor.entity';
import { InstructorsRepository } from './instructors.repository';

describe('InstructorsRepository', () => {
    let instructorsRepository: InstructorsRepository;
    let repositoryMock: Partial<Repository<Instructor>>;

    beforeAll(async () => {
        repositoryMock = {
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                InstructorsRepository,
                { provide: getRepositoryToken(Instructor), useValue: repositoryMock },
            ],
        }).compile();

        instructorsRepository = module.get<InstructorsRepository>(InstructorsRepository);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(instructorsRepository).toBeDefined();
    });

    it('should create an instructor', async () => {
        const instructorMock = { id: '1', email: 'instructor@example.com' } as Instructor;
        (repositoryMock.save as jest.Mock).mockResolvedValue(instructorMock);

        const result = await instructorsRepository.create(instructorMock);

        expect(result).toEqual(instructorMock);
        expect(repositoryMock.save).toHaveBeenCalledWith(instructorMock);
    });

    it('should return an instructor by email', async () => {
        const instructorMock = { id: '1', email: 'instructor@example.com' } as Instructor;
        (repositoryMock.findOne as jest.Mock).mockResolvedValue(instructorMock);

        const result = await instructorsRepository.getByEmail('instructor@example.com');

        expect(result).toEqual(instructorMock);
        expect(repositoryMock.findOne).toHaveBeenCalledWith({ where: { email: 'instructor@example.com' } });
    });

    it('should return an instructor by id', async () => {
        const instructorMock = { id: '1', email: 'instructor@example.com' } as Instructor;
        (repositoryMock.findOne as jest.Mock).mockResolvedValue(instructorMock);

        const result = await instructorsRepository.getById('1');

        expect(result).toEqual(instructorMock);
        expect(repositoryMock.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should list all instructors that are not disabled', async () => {
        const instructorsMock = [
            { id: '1', email: 'instructor1@example.com', isDisabled: false } as Instructor,
            { id: '2', email: 'instructor2@example.com', isDisabled: false } as Instructor,
        ];
        (repositoryMock.find as jest.Mock).mockResolvedValue(instructorsMock);

        const result = await instructorsRepository.listAll();

        expect(result).toEqual(instructorsMock);
        expect(repositoryMock.find).toHaveBeenCalledWith({ where: { isDisabled: false } });
    });
});
