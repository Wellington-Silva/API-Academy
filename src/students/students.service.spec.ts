import { Test, TestingModule } from '@nestjs/testing';
import { StudentsService } from './students.service';
import { StudentsRepository } from './repositories/students.repository';
import { Student } from './entities/student.entity';
import * as bcrypt from 'bcrypt';

describe('StudentsService', () => {

    let studentsService: StudentsService;
    let studentsRepository: StudentsRepository;
    
    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                StudentsService,
            ]
        }).compile();  
        
        studentsService = module.get<StudentsService>(StudentsService);
        studentsRepository = module.get<StudentsRepository>(StudentsRepository);
    });

    it("should be defined", () => {
       expect(studentsService).toBeDefined();
    });

});