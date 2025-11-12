import {
    BaseEntity,
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Entrada } from './entrada.entity';
import { EstadoVenta } from './estadoVenta.entity';

@Entity('venta')
export class Venta extends BaseEntity {
    @PrimaryGeneratedColumn({ name: 'venta_id' })
    nroVenta: number;

    @Column()
    fecha: Date;

    @Column()
    total: number;

    @OneToMany(() => Entrada, (entrada) => entrada.venta)
    entradas: Entrada[];

    // Solo guardamos el ID de la promoción
    @Column({ type: 'int', nullable: true, name: 'promocion_id' })
    promocionId: number;

    @ManyToOne(() => EstadoVenta)
    @JoinColumn({ name: 'estado_venta' })
    estadoVenta: EstadoVenta;

    @Column()
    cliente: number;
}
