import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import {Continent} from "./continents";

@Entity()
export class Country {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 64 })
    country!: string;

    @ManyToOne(() => Continent, continent => continent.countries)
    continent!: Continent;
}