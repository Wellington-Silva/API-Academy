/* istanbul ignore file */
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Student } from './entities/student.entity';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { StudentsRepository } from './repositories/students.repository';
import { ExercisesModule } from 'src/exercises/exercise.module';

console.log('✅ StudentsModule está sendo carregado');
@Module({
  imports: [
    TypeOrmModule.forFeature([Student]), 
    forwardRef(() => AuthModule), 
    forwardRef(() => ExercisesModule)
  ],
  controllers: [StudentsController],
  providers: [StudentsService, StudentsRepository],
  exports: [StudentsService, StudentsRepository, TypeOrmModule],
})

export class StudentsModule {};