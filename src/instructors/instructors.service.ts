import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';
import { Injectable, ConflictException, Inject, forwardRef } from '@nestjs/common';
import { InstructorsRepository } from './repositories/instructors.repository';

@Injectable()
export class InstructorsService {
    constructor(
        private readonly instructorsRepo: InstructorsRepository,
        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthService
    ) { };

    async list() {
        return await this.instructorsRepo.listAll();
    }

    async register(name: string, email: string, password: string) {
        const existing = await this.instructorsRepo.getByEmail(email);
        if (existing) throw new ConflictException('Email já cadastrado');

        const hashedPassword = await bcrypt.hash(password, 10);
        const instructor = await this.instructorsRepo.create({ name, email, password: hashedPassword });

        return this.authService.generateToken(instructor);
    };

    async getByEmail(email: string) {
        return this.instructorsRepo.getByEmail(email);
    };

};