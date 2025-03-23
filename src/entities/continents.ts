import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import {Country} from "./countries";

@Entity()
export class Continent {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 32 })
    continent!: string;

    @OneToMany(() => Country, country => country.continent)
    countries!: Country[];
}