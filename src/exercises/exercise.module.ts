/* istanbul ignore file */
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExercisesService } from './exercise.service';
import { ExercisesController } from './exercise.controller';
import { Exercise } from './entities/exercise.entity';
import { StudentsModule } from 'src/students/students.module';
import { InstructorsModule } from 'src/instructors/instructors.module';
import { AuthModule } from 'src/auth/auth.module';

console.log('✅ ExercisesModule está sendo carregado');
@Module({
    imports: [
        TypeOrmModule.forFeature([Exercise]),
        forwardRef(() => StudentsModule),
        forwardRef(() => InstructorsModule),
        forwardRef(() => AuthModule)
    ],
    controllers: [ExercisesController],
    providers: [ExercisesService],
    exports: [ExercisesService],
})

export class ExercisesModule { };