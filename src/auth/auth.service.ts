import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './repositories/auth.reposity';
import { Injectable, UnauthorizedException, Inject, forwardRef } from '@nestjs/common';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,

        private readonly authRepository: AuthRepository
    ) { }

    async validateUser(email: string, password: string) {
        const user = await this.authRepository.findUserByEmail(email);
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
    
};