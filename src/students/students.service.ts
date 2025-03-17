import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';
import { Student } from './entities/student.entity';
import { StudentsRepository } from './repositories/students.repository';
import { Injectable, NotFoundException, ConflictException, Inject, forwardRef } from '@nestjs/common';
import { ExercisesService } from 'src/exercises/exercise.service';

@Injectable()
export class StudentsService {
    constructor(
        private readonly studentsRepository: StudentsRepository,

        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthService,

        @Inject(forwardRef(() => ExercisesService))
        private readonly exercisesService: ExercisesService,
    ) { };

    async list(): Promise<Student[]> {
        const students = await this.studentsRepository.findAll();
        if (!students) throw new NotFoundException('Nenhum aluno encontrado');
        return students;
    };

    async getById(id: string): Promise<Student> {
        const student = await this.studentsRepository.findById(id);
        if (!student) throw new NotFoundException('Aluno não encontrado.');
        return student;
    };

    async create(name: string, email: string, password: string): Promise<{ access_token: string }> {
        const existing = await this.studentsRepository.findByEmail(email);
        if (existing) throw new ConflictException('Email já cadastrado');

        const hashedPassword = await bcrypt.hash(password, 10);
        const student = await this.studentsRepository.create({ name, email, password: hashedPassword });

        return this.authService.generateToken(student);
    };

    async findByEmail(email: string) {
        const student = await this.studentsRepository.findByEmail(email);
        if (!student) throw new NotFoundException("Aluno não encontrado");
        return student;
    }

};