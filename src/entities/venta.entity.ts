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
    @PrimaryGeneratedColumn({ name: 'id' })
    nroVenta: number;

    @Column()
    fecha: Date;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total: number;

    @OneToMany(() => Entrada, (entrada) => entrada.venta)
    entradas: Entrada[];

    // Solo guardamos el ID de la promoción
    @Column({ type: 'int', nullable: true, name: 'promocion_id' })
    promocionId: number;

    @ManyToOne(() => EstadoVenta)
    @JoinColumn({ name: 'estado_venta_id' })
    estadoVenta: EstadoVenta;

    @Column({ type: 'int', name: 'cliente_id' })
    cliente: number;

    @Column({ type: 'date', name: 'fecha_funcion' })
    fechaFuncion: string;

    @Column({ type: 'time', name: 'hora_funcion' })
    horaFuncion: string;
}
