import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Venta } from './venta.entity';

@Entity('estado_venta')
export class EstadoVenta extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    nombre: string;
    @OneToMany(() => Venta, venta => venta.estadoVenta)
    ventas: Venta[];

}

