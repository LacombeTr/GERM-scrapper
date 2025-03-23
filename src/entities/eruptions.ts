// Eruption
import {EruptionType} from "./eruptionsType";
import {Volcano} from "./volcanoes";
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

/**
 * Représente une éruption
 * @openapi
 * components:
 *   schemas:
 *     Eruption:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Identifiant unique de l'éruption
 *         volcano:
 *           $ref: "#/components/schemas/Volcano"
 *         date:
 *           type: string
 *           format: date
 *           nullable: true
 *           description: Date de l'éruption
 *         confirmed:
 *           type: boolean
 *           description: Indique si l'éruption est confirmée
 *         eruptionType:
 *           $ref: "#/components/schemas/EruptionType"
 *         vei:
 *           type: integer
 *           description: Indice d'explosivité volcanique (Volcanic Explosivity Index)
 *         description:
 *           type: string
 *           description: Description de l'éruption
 */
@Entity()
export class Eruption {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Volcano, volcano => volcano.eruptions)
    volcano!: Volcano;

    @Column({ type: "date", nullable: true })
    date!: Date;

    @Column()
    confirmed!: boolean;

    @ManyToOne(() => EruptionType, eruptionType => eruptionType.id)
    eruptionType!: EruptionType;

    @Column("int", { nullable: true })
    vei!: number;

    @Column("text", { nullable: true })
    description!: string;
}