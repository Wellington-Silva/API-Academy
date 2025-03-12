import { Test, TestingModule } from '@nestjs/testing';
import { StudentsService } from './students.service';
import { StudentsRepository } from './repositories/students.repository';
import { Student } from './entities/student.entity';
import * as bcrypt from 'bcrypt';

describe('StudentsService', () => {
    let studentsService: StudentsService;
    let studentsRepository: StudentsRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                StudentsService,
                {
                    provide: StudentsRepository,
                    useValue: {
                        create: jest.fn(),
                        findByEmail: jest.fn(),
                        findById: jest.fn(),
                        findAll: jest.fn(),
                    },
                },
            ],
        }).compile();

        studentsService = module.get<StudentsService>(StudentsService);
        studentsRepository = module.get<StudentsRepository>(StudentsRepository);
    });

    it('deve ser definido', () => {
        expect(studentsService).toBeDefined();
    });

    it('deve criar um aluno com senha criptografada', async () => {
        const studentData = { name: 'João', email: 'joao@email.com', password: '123456' };
        const hashedPassword = await bcrypt.hash(studentData.password, 10);
        const student = new Student();
        Object.assign(student, { ...studentData, password: hashedPassword });

        jest.spyOn(studentsRepository, 'findByEmail').mockResolvedValue(null);
        jest.spyOn(bcrypt, 'hash').mockImplementation(async () => hashedPassword);
        jest.spyOn(studentsRepository, 'create').mockResolvedValue(student);

        const result = await studentsService.create(
            studentData.name,
            studentData.email,
            studentData.password,
        );

        expect(result.password).not.toBe(studentData.password);
        expect(result.password).toBe(hashedPassword);
        expect(studentsRepository.create).toHaveBeenCalledWith({
            name: studentData.name,
            email: studentData.email,
            password: hashedPassword,
        });
    });

    it('deve lançar erro ao tentar cadastrar um email já existente', async () => {
        const studentData = { name: 'João', email: 'joao@email.com', password: '123456' };
        jest.spyOn(studentsRepository, 'findByEmail').mockResolvedValue(new Student());

        await expect(
            studentsService.create(studentData.name, studentData.email, studentData.password),
        ).rejects.toThrow('Email já cadastrado.');
    });

    it('deve retornar um aluno pelo ID', async () => {
        const student = new Student();
        student.id = '123';
        student.name = 'João';

        jest.spyOn(studentsRepository, 'findById').mockResolvedValue(student);

        const result = await studentsService.getById('123');

        expect(result).toEqual(student);
        expect(studentsRepository.findById).toHaveBeenCalledWith('123');
    });

    it('deve lançar erro ao tentar buscar um aluno inexistente', async () => {
        jest.spyOn(studentsRepository, 'findById').mockResolvedValue(null);

        await expect(studentsService.getById('123')).rejects.toThrow('Aluno não encontrado.');
    });

    it('deve retornar todos os alunos', async () => {
        const students = [new Student(), new Student()];
        jest.spyOn(studentsRepository, 'findAll').mockResolvedValue(students);

        const result = await studentsService.list();

        expect(result).toEqual(students);
    });
});