import 'dotenv/config';
import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { StudentsModule } from '../students/students.module';
import { InstructorsModule } from 'src/instructors/instructors.module'; 
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthRepository } from './repositories/auth.reposity';

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || process.env.JWT_SECRET,
            signOptions: { expiresIn: '5d' },
        }),
        forwardRef(() => StudentsModule),
        forwardRef(() => InstructorsModule)
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, JwtAuthGuard, AuthRepository],
    exports: [AuthService, JwtModule, JwtAuthGuard],
})

export class AuthModule { };