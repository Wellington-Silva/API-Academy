import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { StudentsModule } from '../students/students.module';
import { InstructorsModule } from 'src/instructors/instructors.module'; 
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'secret_key',
            signOptions: { expiresIn: '1h' },
        }),
        forwardRef(() => StudentsModule),
        forwardRef(() => InstructorsModule)
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService],
})

export class AuthModule { };