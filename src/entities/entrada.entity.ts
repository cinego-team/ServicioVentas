import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Venta } from './venta.entity';

@Entity('entrada')
export class Entrada extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    token: string;

    @Column()
    esUsado: boolean;

    @Column()
    expiracion: Date;

    @Column({ type: 'int', nullable: false })
    disponibilidadButacaId: number;

    @ManyToOne(() => Venta, venta => venta.entradas, { nullable: false })
    @JoinColumn({ name: 'nroVenta' })
    venta: Venta;
}