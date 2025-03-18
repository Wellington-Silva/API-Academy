import 'dotenv/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Student } from '../students/entities/student.entity';
import { Exercise } from 'src/exercises/entities/exercise.entity';
import { Instructor } from '../instructors/entities/instructor.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: process.env.PASSWORD_DB,
    database: 'Academia', 
    entities: [Student, Instructor, Exercise],
    synchronize: true
};