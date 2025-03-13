import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CustomRequest } from './custom-request';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest() as CustomRequest;
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            throw new UnauthorizedException('Token não fornecido');
        }

        const token = authHeader.split(' ')[1]; // Pegando o token após "Bearer"
        try {
            const decoded = this.jwtService.verify(token);
            request.user = decoded; // Atribui o usuário ao request
            return true;
        } catch (error) {
            throw new UnauthorizedException('Token inválido');
        }
    }
};