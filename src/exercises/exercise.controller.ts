import { Controller, Get, Post, Body, Query, UseGuards, Req, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { ExercisesService } from './exercise.service';
import { Exercise } from './entities/exercise.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CustomRequest } from 'src/auth/custom-request';

@Controller('exercises')
export class ExercisesController {
    constructor(private exercisesService: ExercisesService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createExercise(@Req() req: Request, @Body() body: { studentId: string; name: string; description?: string }) {
        if (!body.studentId) throw new BadRequestException('O campo studentId é obrigatório.');
        
        const instructorId = (req as unknown as CustomRequest).user?.id;
        if (!instructorId) throw new UnauthorizedException('Instrutor não autenticado.');

        return this.exercisesService.create(instructorId, body.studentId, body.name, body.description);
    };

    @Get()
    async getAllExercises(): Promise<Exercise[]> {
        return this.exercisesService.listAll();
    }

    @Get('student')
    async getExercisesByStudent(@Query('studentId') studentId: string): Promise<Exercise[]> {
        return this.exercisesService.getExercisesByStudent(studentId);
    }

    @Get('instructor')
    async getExercisesByInstructor(@Query('instructorId') instructorId: string): Promise<Exercise[]> {
        return this.exercisesService.getExercisesByInstructor(instructorId);
    }
}
