import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Exercise } from '../../exercises/entities/exercise.entity';

export enum UserRole {
    STUDENT = 0,
    INSTRUCTOR = 1
};

@Entity('students')
export class Student {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.STUDENT,
    })
    type: number;

    @Column({ default: false })
    isDisabled: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Exercise, (exercise) => exercise.student)
    exercises: Exercise[];
};