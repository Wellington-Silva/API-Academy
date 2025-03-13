import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Instructor } from './entities/instructor.entity';
import { InstructorsService } from './instructors.service';
import { InstructorsController } from './instructors.controller';
import { InstructorsRepository } from './repositories/instructors.repository';
import { ExercisesModule } from 'src/exercises/exercise.module';

console.log('✅ InstructorsModule está sendo carregado');
@Module({
  imports: [
    TypeOrmModule.forFeature([Instructor, InstructorsRepository]), 
    forwardRef(() => AuthModule), 
    forwardRef(() => ExercisesModule),
  ],
  controllers: [InstructorsController],
  providers: [InstructorsService, InstructorsRepository],
  exports: [InstructorsService, TypeOrmModule],
})

export class InstructorsModule {};