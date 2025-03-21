import { Test, TestingModule } from '@nestjs/testing';
import { ExercisesController } from './exercise.controller';
import { exerciseOneMock, exerciseTwoMock, exerciseServiceMock } from './exercise.service.mock';
import { UnauthorizedException } from '@nestjs/common';

describe('ExerciseController', () => {

    let exerciseController: ExercisesController;

    beforeAll(async () => {

        const module: TestingModule = await Test.createTestingModule({
            controllers: [ExercisesController],
            providers: [
                exerciseServiceMock,
            ]
        }).compile();

        exerciseController = module.get<ExercisesController>(ExercisesController);
    });

    it('should be defined', () => {
        expect(exerciseController).toBeDefined();
    });

    it('should get exercise', async () => {
        const result = await exerciseController.findAll();
        expect(result.length).toEqual(1);
        expect(result[0].id).toEqual(exerciseOneMock.id);
    });

    it('should get exercise by student', async () => {
        const result = await exerciseController.getExercisesByStudent(exerciseOneMock.student.id);
        expect(result).toEqual([exerciseOneMock, exerciseTwoMock]);
        expect(result[0].id).toEqual(exerciseOneMock.id);
    });

    it('should get exercise by instructor', async () => {
        const result = await exerciseController.getExercisesByInstructor(exerciseOneMock.instructor.id);
        expect(result).toEqual([exerciseOneMock, exerciseTwoMock]);
        expect(result[0].id).toEqual(exerciseOneMock.id);
    });

    it('should get list complets', async () => {
        const mockRequest = { user: { id: '1' } } as unknown as Request;
        const result = await exerciseController.listExercisesCompleteds(mockRequest);
        expect(result).toEqual([exerciseOneMock, exerciseTwoMock]);
        expect(result[0].id).toEqual(exerciseOneMock.id);
    });

    it('should throw UnauthorizedException if user is not authenticated', async () => {
        const mockRequest = {} as unknown as Request;
        await expect(exerciseController.listExercisesCompleteds(mockRequest))
            .rejects
            .toThrow(UnauthorizedException);
    });

    it('should create an exercise', async () => {
        const mockRequest = { user: { id: '1' } } as unknown as Request;
        const body = {
            studentId: exerciseOneMock.student.id, 
            name: "Supino reto",
            description: "Exercício para peito", 
            muscleGroup: "Peito"
        };
    
        const result = await exerciseController.create(mockRequest, body);
        expect(result).toEqual(exerciseOneMock);
    });

    it('should return exercise completed', async () => {
        const mockRequest = { user: { id: 'student-id-123', type: 0 } } as unknown as Request;
        const exerciseId = exerciseOneMock.id;
    
        jest.spyOn(exerciseServiceMock.useValue, 'complete').mockResolvedValue(exerciseOneMock);
    
        const result = await exerciseController.completed(mockRequest, exerciseId);
    
        expect(result).toEqual(exerciseOneMock);
    });
    

    it('should throw an error if user is not a student', async () => {
        const mockRequest = { user: { id: 'instructor-id-123', type: 1 } } as unknown as Request;
        const exerciseId = exerciseOneMock.id;
    
        await expect(exerciseController.completed(mockRequest, exerciseId))
            .rejects
            .toThrow("Apenas alunos podem marcar como concluído");
    });

    it('should delete an exercise', async () => {
        const exerciseId = exerciseOneMock.id;
    
        const result = await exerciseController.delete(exerciseId);
    
        expect(result).toEqual(exerciseOneMock);
        expect(exerciseServiceMock.useValue.delete).toHaveBeenCalledWith(exerciseId);
    });

});