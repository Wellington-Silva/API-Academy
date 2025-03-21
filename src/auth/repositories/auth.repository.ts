import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { Instructor } from '../../instructors/entities/instructor.entity';

@Injectable()
export class AuthRepository {
    private studentRepository: Repository<Student>;
    private instructorRepository: Repository<Instructor>;

    constructor(private readonly dataSource: DataSource) {
        this.studentRepository = this.dataSource.getRepository(Student);
        this.instructorRepository = this.dataSource.getRepository(Instructor);
    };

    async findUserByEmail(email: string): Promise<Student | Instructor | null> {
        let user = await this.studentRepository.findOne({ where: { email } });
        if (!user) {
            user = await this.instructorRepository.findOne({ where: { email } });
        }
        return user;
    };

};