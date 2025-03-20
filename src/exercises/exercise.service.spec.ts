import { Test, TestingModule } from '@nestjs/testing';
import { ExercisesService } from './exercise.service';
import { StudentsService } from '../students/students.service';
import { Exercise } from './entities/exercise.entity';
import { Student } from '../students/entities/student.entity';
import { Instructor } from '../instructors/entities/instructor.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { exerciseOneMock, exerciseTwoMock } from './exercise.service.mock';
import { Repository } from 'typeorm';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('ExerciseService', () => {

    let exercisesService: ExercisesService;
    let exerciseRepository: Repository<Exercise>;
    let studentRepository: Repository<Student>;
    let instructorRepository: Repository<Instructor>;

    const mockExerciseRepository = {
        find: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        update: jest.fn(),
    };

    const mockStudentRepository = {
        findOne: jest.fn(),
    };

    const mockInstructorRepository = {
        findOne: jest.fn(),
    };

    const mockStudentsService = {};

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ExercisesService,
                { provide: getRepositoryToken(Exercise), useValue: mockExerciseRepository },
                { provide: getRepositoryToken(Student), useValue: mockStudentRepository },
                { provide: getRepositoryToken(Instructor), useValue: mockInstructorRepository },
                { provide: StudentsService, useValue: mockStudentsService },
                { provide: getRepositoryToken(Exercise), useValue: mockExerciseRepository },
            ]
        }).compile();

        exercisesService = module.get<ExercisesService>(ExercisesService);
        exerciseRepository = module.get<Repository<Exercise>>(getRepositoryToken(Exercise));
        studentRepository = module.get<Repository<Student>>(getRepositoryToken(Student));
        instructorRepository = module.get<Repository<Instructor>>(getRepositoryToken(Instructor));
    });

    it('should be defined', () => {
        expect(exercisesService).toBeDefined();
    });

    it('should a list exercises', async () => {
        const exercises = [exerciseOneMock, exerciseTwoMock];
        exerciseRepository.find = jest.fn().mockReturnValueOnce(exercises);
        const result = await exercisesService.listAll();
        expect(result.length).toEqual(exercises.length);
        expect(result).toEqual(exercises);
        expect(exerciseRepository.find).toHaveBeenCalled();
    });

    it('should get exercises by student id', async () => {
        const studentId = '123';
        const exercises = [exerciseOneMock, exerciseTwoMock];

        jest.spyOn(exerciseRepository, 'find').mockResolvedValueOnce(exercises);

        const result = await exercisesService.getExercisesByStudent(studentId);

        expect(result).toEqual(exercises);
        expect(exerciseRepository.find).toHaveBeenCalledWith({
            where: { student: { id: studentId } },
            relations: ['student'],
        });
    });

    it('should get exercises by instructor id', async () => {
        const instructorId = '456';
        const exercises = [exerciseOneMock, exerciseTwoMock];

        jest.spyOn(exerciseRepository, 'find').mockResolvedValueOnce(exercises);

        const result = await exercisesService.getExercisesByInstructor(instructorId);

        expect(result).toEqual(exercises);
        expect(exerciseRepository.find).toHaveBeenCalledWith({
            where: { instructor: { id: instructorId } },
            relations: ['instructor'],
        });
    });

    it('should return a list of completed exercises for a given student', async () => {
        const studentId = '123';
        const completedExercises = [exerciseOneMock, exerciseTwoMock];

        jest.spyOn(exerciseRepository, 'find').mockResolvedValueOnce(completedExercises);

        const result = await exercisesService.listExercisesCompleteds(studentId);

        expect(result).toEqual(completedExercises);
        expect(exerciseRepository.find).toHaveBeenCalledWith({
            where: { student: { id: studentId }, completed: true },
        });
    });

    it('should create and return a new exercise', async () => {
        const instructorId = '1';
        const studentId = '2';
        const exerciseData = exerciseOneMock;

        const instructor = exerciseOneMock.instructor;
        const student = exerciseTwoMock.student;
        const createdExercise = exerciseTwoMock;

        jest.spyOn(instructorRepository, 'findOne').mockResolvedValueOnce(instructor);
        jest.spyOn(studentRepository, 'findOne').mockResolvedValueOnce(student);
        jest.spyOn(exerciseRepository, 'create').mockReturnValueOnce(createdExercise);
        jest.spyOn(exerciseRepository, 'save').mockResolvedValueOnce(createdExercise);

        const result = await exercisesService.create(
            instructorId,
            studentId,
            exerciseData.name,
            exerciseData.muscleGroup,
            exerciseData.description
        );

        expect(result).toEqual(createdExercise);
        expect(instructorRepository.findOne).toHaveBeenCalledWith({ where: { id: instructorId } });
        expect(studentRepository.findOne).toHaveBeenCalledWith({ where: { id: studentId } });
        expect(exerciseRepository.create).toHaveBeenCalledWith(
            expect.objectContaining({
                name: exerciseData.name,
                description: exerciseData.description,
                muscleGroup: exerciseData.muscleGroup,
                student,
                instructor,
            })
        );
        expect(exerciseRepository.save).toHaveBeenCalledWith(createdExercise);
    });

    it('should throw ForbiddenException when instructor is not found', async () => {
        const instructorId = '1';
        const studentId = '2';
        const exerciseData = exerciseOneMock;

        jest.spyOn(instructorRepository, 'findOne').mockResolvedValueOnce(null);

        await expect(
            exercisesService.create(instructorId, studentId, exerciseData.name, exerciseData.muscleGroup, exerciseData.description)
        ).rejects.toThrow(ForbiddenException);

        expect(instructorRepository.findOne).toHaveBeenCalledWith({ where: { id: instructorId } });
    });

    it('should throw NotFoundException when student is not found', async () => {
        const instructorId = '1';
        const studentId = '2';
        const exerciseData = exerciseOneMock;

        const instructor = exerciseOneMock.instructor;

        jest.spyOn(instructorRepository, 'findOne').mockResolvedValueOnce(instructor);
        jest.spyOn(studentRepository, 'findOne').mockResolvedValueOnce(null);

        await expect(
            exercisesService.create(instructorId, studentId, exerciseData.name, exerciseData.muscleGroup, exerciseData.description)
        ).rejects.toThrow(NotFoundException);

        expect(instructorRepository.findOne).toHaveBeenCalledWith({ where: { id: instructorId } });
        expect(studentRepository.findOne).toHaveBeenCalledWith({ where: { id: studentId } });
    });

    it('should mark an exercise as completed successfully', async () => {
        // Mock do update para simular sucesso
        jest.spyOn(exerciseRepository, 'update').mockResolvedValueOnce({ affected: 1 } as any);

        const exerciseId = '123';
        const result = await exercisesService.complete(exerciseId);

        expect(result).toEqual({ error: false, message: "Exercísio concluído com sucesso" });
        expect(exerciseRepository.update).toHaveBeenCalledWith(exerciseId, { completed: true });
    });

    it('should throw an error if the exercise does not exist', async () => {
        // Mock do update para simular falha (nenhuma linha afetada)
        jest.spyOn(exerciseRepository, 'update').mockResolvedValueOnce({ affected: 0 } as any);

        const exerciseId = 'invalid-id';

        await expect(exercisesService.complete(exerciseId)).rejects.toThrow("Não foi possível concluír este exercício");
        expect(exerciseRepository.update).toHaveBeenCalledWith(exerciseId, { completed: true });
    });

    it('should disable an exercise successfully', async () => {
        jest.spyOn(exerciseRepository, 'update').mockResolvedValueOnce({ affected: 1 } as any);
        const exerciseId = '123';
        const result = await exercisesService.delete(exerciseId);
        expect(result).toEqual({ error: false, message: "Exercício desabilitado com sucesso" });
        expect(exerciseRepository.update).toHaveBeenCalledWith(exerciseId, { isDisabled: true });
    });

    it('should throw an error if the exercise does not exist', async () => {
        jest.spyOn(exerciseRepository, 'update').mockResolvedValueOnce({ affected: 0 } as any);
        const exerciseId = 'invalid-id';
        await expect(exercisesService.delete(exerciseId)).rejects.toThrow("Erro ao desabilitar exercício");
        expect(exerciseRepository.update).toHaveBeenCalledWith(exerciseId, { isDisabled: true });
    });

});