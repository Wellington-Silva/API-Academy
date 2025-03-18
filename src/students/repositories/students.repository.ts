import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from '../entities/student.entity';

@Injectable()
export class StudentsRepository {
    constructor(
        @InjectRepository(Student)
        private readonly repository: Repository<Student>,
    ) { };

    async create(studentData: Partial<Student>): Promise<Student> {
        const student = this.repository.create(studentData);
        return await this.repository.save(student);
    }

    async findByEmail(email: string): Promise<Student | null> {
        return await this.repository.findOne({ where: { email } });
    }

    async findById(id: string): Promise<Student | null> {
        return await this.repository.findOne({ where: { id } });
    }

    async findAll(): Promise<Student[]> {
        return await this.repository.find();
    }

    async update(id: string, data: object) {
        const updatedStudent = Object.assign(data);
        return await this.repository.save(updatedStudent);
    };

    async remove(id: string) {
        return await this.repository.delete(id);
    };

};