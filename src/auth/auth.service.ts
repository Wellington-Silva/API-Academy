import { Injectable, UnauthorizedException, Inject, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { StudentsService } from '../students/students.service';
import * as bcrypt from 'bcrypt';
import { InstructorsService } from '../instructors/instructors.service';


@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => StudentsService))
        private readonly studentsService: StudentsService,
        @Inject(forwardRef(() => InstructorsService))
        private instructorsService: InstructorsService,
        private readonly jwtService: JwtService,
    ) { }

    async validateStudent(email: string, password: string) {
        const student = await this.studentsService.getById(email);
        if (!student) throw new UnauthorizedException('Email ou senha inválidos');

        const isPasswordValid = await bcrypt.compare(password, student.password);
        if (!isPasswordValid) throw new UnauthorizedException('Email ou senha inválidos');

        return student;
    }

    async login(student: any) {
        const payload = { sub: student.id, email: student.email };
        return {
            access_token: this.jwtService.sign(payload),
        };
    };

    async generateToken(user: any) {
        const payload = { sub: user.id, email: user.email };
        return {
            access_token: this.jwtService.sign(payload),
        };
    };

}
