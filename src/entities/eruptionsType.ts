import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class EruptionType {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 64 })
    eruptionType!: string;
}