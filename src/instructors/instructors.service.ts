import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';
import { Injectable, ConflictException, Inject, forwardRef, NotFoundException } from '@nestjs/common';
import { InstructorsRepository } from './repositories/instructors.repository';
import { Instructor } from './entities/instructor.entity';

@Injectable()
export class InstructorsService {
    constructor(
        private readonly instructorsRepo: InstructorsRepository,
        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthService
    ) { };

    async list() {
        return await this.instructorsRepo.listAll();
    };

    async getById(instructorId: string): Promise<Instructor> {
        const instructor = await this.instructorsRepo.getById(instructorId);
        if (!instructor) throw new NotFoundException("Instrutor não encontrado");
        return instructor;
    };

    async register(name: string, email: string, password: string) {
        const existing = await this.instructorsRepo.getByEmail(email);
        if (existing) throw new ConflictException('Email já cadastrado');

        const hashedPassword = await bcrypt.hash(password, 10);
        const instructor = await this.instructorsRepo.create({ name, email, password: hashedPassword });

        return this.authService.generateToken(instructor);
    };

    async getByEmail(email: string) {
        const instructor = await this.instructorsRepo.getByEmail(email);
        if (!instructor) throw new NotFoundException('Instrutor não encontrado');
        return instructor;
    };

};