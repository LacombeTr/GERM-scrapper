// Type
import {Volcano} from "./volcanoes";
import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class VolcanoType {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 255 })
    volcanoType!: string;

    @OneToMany(() => Volcano, volcano => volcano.volcanoType)
    volcanoes!: Volcano[];
}