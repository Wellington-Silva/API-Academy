import { Repository } from 'typeorm';
import { ForbiddenException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Exercise } from './entities/exercise.entity';
import { Student } from 'src/students/entities/student.entity';
import { Instructor } from 'src/instructors/entities/instructor.entity';
import { StudentsService } from 'src/students/students.service';

@Injectable()
export class ExercisesService {
    constructor(
        @InjectRepository(Exercise)
        private readonly exerciseRepository: Repository<Exercise>,

        @InjectRepository(Student)
        private readonly studentRepository: Repository<Student>,

        @InjectRepository(Instructor)
        private readonly instructorRepository: Repository<Instructor>,

        @Inject(forwardRef(() => StudentsService)) // 🔥 Resolver a injeção circular
        private readonly studentsService: StudentsService,
    ) { }

    async create(instructorId: string, studentId: string, name: string, muscleGroup: string, description?: string) {
        // Verificar se o instrutor existe
        const instructor = await this.instructorRepository.findOne({ where: { id: instructorId } });
        if (!instructor) {
            throw new ForbiddenException('Apenas instrutores podem criar exercícios.');
        }

        // Verificar se o aluno existe
        const student = await this.studentRepository.findOne({ where: { id: studentId } });
        if (!student) {
            throw new NotFoundException('Aluno não encontrado.');
        }

        // Criar o exercício
        const exercise = this.exerciseRepository.create({
            name,
            description,
            muscleGroup,
            student,
            instructor,
        });

        return await this.exerciseRepository.save(exercise);
    };

    async listAll(): Promise<Exercise[]> {
        return this.exerciseRepository.find();
    }

    async getExercisesByStudent(studentId: string): Promise<Exercise[]> {
        return this.exerciseRepository.find({
            where: { student: { id: studentId } },
            relations: ['student'], // Opcional
        });
    };

    async getExercisesByInstructor(instructorId: string): Promise<Exercise[]> {
        return this.exerciseRepository.find({
            where: { instructor: { id: instructorId } },
            relations: ['instructor'], // Opcional
        });
    };

    async delete(exerciseId: string) {
        const disabledExercise = await this.exerciseRepository.update(exerciseId, { isDisabled: true });
        if (!disabledExercise.affected) throw new Error("Erro ao desabilitar exercício");
        return { error: false, message: "Exercício desabilitado com sucesso" }
    };

};