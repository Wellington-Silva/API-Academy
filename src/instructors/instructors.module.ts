import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Instructor } from './entities/instructor.entity';
import { InstructorsService } from './instructors.service';
import { InstructorsController } from './instructors.controller';
import { InstructorsRepository } from './repositories/instructors.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Instructor]), forwardRef(() => AuthModule)],
  controllers: [InstructorsController],
  providers: [InstructorsService, InstructorsRepository],
  exports: [InstructorsService],
})

export class InstructorsModule {};