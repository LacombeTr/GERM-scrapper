import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Country} from "./countries";
import {Eruption} from "./eruptions";
import {VolcanoType} from "./volcanoTypes";

/**
 * Représente un volcan
 * @openapi
 * components:
 *   schemas:
 *     Volcano:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Identifiant unique du volcan
 *         name:
 *           type: string
 *           description: Nom du volcan
 *         volcanoType:
 *           $ref: "#/components/schemas/VolcanoType"
 *         country:
 *           $ref: "#/components/schemas/Country"
 *         latitude:
 *           type: number
 *           format: decimal
 *           description: Latitude du volcan (coordonnée géographique)
 *         longitude:
 *           type: number
 *           format: decimal
 *           description: Longitude du volcan (coordonnée géographique)
 *         altitude:
 *           type: integer
 *           description: Altitude du volcan en mètres
 *         lastEruption:
 *           type: string
 *           format: date
 *           description: Date de la dernière éruption
 *         eruptions:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/Eruption"
 *           description: Liste des éruptions associées au volcan
 */
@Entity()
export class Volcano {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 255 })
    name!: string;

    @ManyToOne(() => VolcanoType, volcanoType => volcanoType.volcanoes)
    volcanoType!: VolcanoType;

    @ManyToOne(() => Country, country => country.id)
    country!: Country;

    @Column({ type: "decimal", precision: 9, scale: 6 })
    latitude!: number;

    @Column({ type: "decimal", precision: 9, scale: 6 })
    longitude!: number;

    @Column("int")
    altitude!: number;

    @Column({ type: "date", nullable: true })
    lastEruption!: Date;

    @OneToMany(() => Eruption, eruption => eruption.volcano)
    eruptions!: Eruption[];
}