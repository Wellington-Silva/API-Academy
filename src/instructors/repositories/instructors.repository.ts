import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Instructor } from '../entities/instructor.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class InstructorsRepository {
    constructor(
        @InjectRepository(Instructor)
        private readonly repository: Repository<Instructor>,
    ) { }

    async create(instructor: Partial<Instructor>) {
        return this.repository.save(instructor);
    }

    async getByEmail(email: string) {
        return this.repository.findOne({ where: { email } });
    }

    async getById(id: string) {
        return this.repository.findOne({ where: { id } });
    }

    async listAll() {
        return this.repository.find({ where: { isDisabled: false } });
    }
};
