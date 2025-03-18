import { Controller, Get, Post, Body, Query, UseGuards, Req, BadRequestException, UnauthorizedException, Delete, Put } from '@nestjs/common';
import { ExercisesService } from './exercise.service';
import { Exercise } from './entities/exercise.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CustomRequest } from 'src/auth/custom-request';

@Controller('exercises')
export class ExercisesController {
    constructor(private exercisesService: ExercisesService) { };

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(): Promise<Exercise[]> {
        return this.exercisesService.listAll();
    };

    @UseGuards(JwtAuthGuard)
    @Get('completeds')
    async listExercisesCompleteds(@Req() req: Request) {
        const studentId = (req as unknown as CustomRequest).user?.id;
        if (!studentId) throw new UnauthorizedException('Usuário não autenticado.');
        return this.exercisesService.listExercisesCompleteds(studentId);
    };

    @UseGuards(JwtAuthGuard)
    @Get('student')
    async getExercisesByStudent(@Query('studentId') studentId: string): Promise<Exercise[]> {
        return this.exercisesService.getExercisesByStudent(studentId);
    };

    @UseGuards(JwtAuthGuard)
    @Get('instructor')
    async getExercisesByInstructor(@Query('instructorId') instructorId: string): Promise<Exercise[]> {
        return this.exercisesService.getExercisesByInstructor(instructorId);
    };

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Req() req: Request, @Body() body: { studentId: string; name: string; description?: string, muscleGroup: string }) {
        if (!body.studentId) throw new BadRequestException('O campo studentId é obrigatório.');
        
        const instructorId = (req as unknown as CustomRequest).user?.id;
        if (!instructorId) throw new UnauthorizedException('Instrutor não autenticado.');

        return this.exercisesService.create(instructorId, body.studentId, body.name, body.muscleGroup, body.description);
    };

    @UseGuards(JwtAuthGuard)
    @Put('complete')
    async completed(@Req() req: Request, @Query('exerciseId') exerciseId: string) {
        const role = (req as unknown as CustomRequest).user?.type;
        if (role != 0) throw new Error("Apenas alunos podem marcar como concluído");
        return this.exercisesService.complete(exerciseId);
    };

    @Delete()
    async delete(@Query('exerciseId') exerciseId: string) {
        return this.exercisesService.delete(exerciseId);
    };

};