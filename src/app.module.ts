import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmConfig } from './config/ormconfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsModule } from './students/students.module';
import { InstructorsModule } from './instructors/instructors.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), StudentsModule, InstructorsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
