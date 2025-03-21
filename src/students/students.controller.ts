import { AuthGuard } from '@nestjs/passport';
import { Student } from './entities/student.entity';
import { StudentsService } from './students.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';

@Controller('students')
export class StudentsController {
    constructor(private readonly studentsService: StudentsService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    async list(): Promise<Student[]> {
        return await this.studentsService.list();
    };

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async getById(@Query('id') id: string): Promise<Student> {
        return await this.studentsService.getById(id);
    };

    @UseGuards(JwtAuthGuard)
    @Get('byEmail')
    async getByEmail(@Query('email') email: string): Promise<Student> {
        return await this.studentsService.findByEmail(email);
    };

    @Post()
    async createStudent(
        @Body() createStudentDto: { name: string; email: string; password: string },
    ): Promise<{ access_token: string }> {
        return await this.studentsService.create(
            createStudentDto.name,
            createStudentDto.email,
            createStudentDto.password,
        );
    };
    
};