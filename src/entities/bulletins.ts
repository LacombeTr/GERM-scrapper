import {Volcano} from "./volcanoes";
import {Country} from "./countries";

/**
 * Représente un bulletin pour un volcan
 * @openapi
 * components:
 *   schemas:
 *     Bulletin:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Identifiant unique du bulletin
 *         volcano:
 *           $ref: "#/components/schemas/Volcano"
 *         country:
 *           $ref: "#/components/schemas/Country"
 *         watchStart:
 *           type: string
 *           format: date
 *           description: Début de la phase d'observation
 *         watchEnd:
 *           type: string
 *           format: date
 *           description: Fin de la phase d'observation
 *         description:
 *           type: string
 *           description: Corps du bulletin
 *         source:
 *           type: string
 *           description: Source du bulletin
 *         pubDate:
 *           type: string
 *           format: date
 *           description: Date de publication du bulletin
 *         coordinates:
 *           type: object
 *           type: array
 *               items:
 *               type: number
 *               example: [48.8566, 2.3522]
 *           description: Coordonnées géographiques de l'activité du bulletin
 */
@Entity()
export class Bulletin {

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Volcano, volcano => volcano.id)
    volcano!: Volcano;

    @ManyToOne(() => Country, country => country.id)
    country!: Country;

    @Column({type: "date", nullable: true})
    watchStart!: Date;

    @Column({type: "date", nullable: true})
    watchEnd!: Date;

    @Column("text", {nullable: true})
    description!: string;

    @Column("text", {nullable: true})
    source!: string;

    @Column({type: "date", nullable: true})
    pubDate!: Date;

    @Column("geometry", {spatialFeatureType: "Point", srid: 4326})
    coordinates!: string;
}