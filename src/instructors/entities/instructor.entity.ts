import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Exercise } from "../../exercises/entities/exercise.entity";

export enum UserRole {
    STUDENT = 0,
    INSTRUCTOR = 1
};

@Entity('instructors')
export class Instructor {
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
        default: UserRole.INSTRUCTOR,
    })
    type: number;

    @Column({ default: false })
    isDisabled: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Exercise, (exercise) => exercise.instructor)
    exercises: Exercise[];
};