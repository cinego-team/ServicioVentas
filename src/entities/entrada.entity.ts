import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Venta } from './venta.entity';

@Entity('Entrada')
export class Entrada extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    codigoSeguridad: string;

    @Column({ type: 'int', nullable: false })
    disponibilidadButacaId: number;

    @Column({ type: 'int', nullable: false })
    @ManyToOne(() => Venta, venta => venta.entradas)
    venta: Venta;
}

