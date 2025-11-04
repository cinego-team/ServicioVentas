import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Venta } from './venta.entity';

@Entity('Entrada')
export class Entrada extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    token: string;

    @Column()
    codigoSeguridad: string;

    @Column()
    esUsado: boolean;

    @Column()
    expiracion: Date;

    @Column({ type: 'int', nullable: false })
    disponibilidadButacaId: number;

    @Column({ type: 'int', nullable: false })
    @ManyToOne(() => Venta, venta => venta.entradas)
    venta: Venta;
}

