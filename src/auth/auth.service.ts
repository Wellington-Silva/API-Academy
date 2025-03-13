import { Injectable, UnauthorizedException, Inject, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { StudentsService } from '../students/students.service';
import * as bcrypt from 'bcrypt';
import { InstructorsService } from '../instructors/instructors.service';
import { Student } from 'src/students/entities/student.entity';
import { Instructor } from 'src/instructors/entities/instructor.entity';

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => StudentsService))
        private readonly studentsService: StudentsService,

        @Inject(forwardRef(() => InstructorsService))
        private readonly instructorsService: InstructorsService,

        private readonly jwtService: JwtService,
    ) { }

    async validateUser(email: string, password: string) {
        let user: Student | Instructor | null = await this.studentsService.findByEmail(email);
    
        if (!user) {
            user = await this.instructorsService.getByEmail(email);
        }
    
        if (!user) throw new UnauthorizedException('Email ou senha inválidos');
    
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new UnauthorizedException('Email ou senha inválidos');
    
        return { id: user.id, email: user.email, type: user.type };
    };
    
    async login(user: { id: string; email: string; type: number }) {
        const payload = { sub: user.id, email: user.email, type: user.type };
        return {
            access_token: this.jwtService.sign(payload),
        };
    };
    
    async generateToken(user: { id: string; email: string; type: number }) {
        const payload = { sub: user.id, email: user.email, type: user.type };
        return {
            access_token: this.jwtService.sign(payload),
        };
    };
    
}
