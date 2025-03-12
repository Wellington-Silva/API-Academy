import { Test, TestingModule } from '@nestjs/testing';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';

describe('StudentsController', () => {
    let studentsController: StudentsController;
    let studentsService: StudentsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [StudentsController],
            providers: [
                {
                    provide: StudentsService,
                    useValue: {
                        create: jest.fn(),
                        getById: jest.fn(),
                        getByEmail: jest.fn(),
                        list: jest.fn(),
                    },
                },
            ],
        }).compile();

        studentsController = module.get<StudentsController>(StudentsController);
        studentsService = module.get<StudentsService>(StudentsService);
    });

    it('should be defined', () => {
        expect(studentsController).toBeDefined();
    });
});