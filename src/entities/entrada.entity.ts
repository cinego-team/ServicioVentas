import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Venta } from './venta.entity';

@Entity('entrada')
export class Entrada extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    token: string;

    @Column({ name: 'es_usado' })
    esUsado: boolean;

    @Column()
    expiracion: Date;

    @Column({ type: 'int', nullable: false, name: 'disponibilidad_butaca_id' })
    disponibilidadButacaId: number;

    @ManyToOne(() => Venta, venta => venta.entradas, { nullable: false })
    @JoinColumn({ name: 'venta_id' })
    venta: Venta;
}