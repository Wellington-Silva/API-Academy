/* istanbul ignore file */
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Instructor } from '../../instructors/entities/instructor.entity';
import { Student } from '../../students/entities/student.entity';

@Entity()
export class Exercise {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column()
    muscleGroup: string;

    @Column({ default: false })
    completed: boolean;

    @ManyToOne(() => Student, (student) => student.exercises, { onDelete: 'CASCADE' })
    student: Student;

    @ManyToOne(() => Instructor, (instructor) => instructor.exercises, { onDelete: 'CASCADE' })
    instructor: Instructor;

    @Column({ default: false })
    isDisabled: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

};