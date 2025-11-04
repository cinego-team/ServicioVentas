import {
    BaseEntity,
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    ManyToOne,
} from 'typeorm';
import { Entrada } from './entrada.entity';
import { EstadoVenta } from './estadoVenta.entity';

@Entity('venta')
export class Venta extends BaseEntity {
    @PrimaryGeneratedColumn()
    nroVenta: number;

    @Column()
    fecha: Date;

    @Column()
    total: number;

    @OneToMany(() => Entrada, (entrada) => entrada.venta)
    entradas: Entrada[];

    // Solo guardamos el ID de la promoción
    @Column({ type: 'int', nullable: true })
    promocionId: number;

    @ManyToOne(() => EstadoVenta)
    estadoVenta: EstadoVenta;
}
