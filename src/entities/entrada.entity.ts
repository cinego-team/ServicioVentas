import { BaseEntity, Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, ManyToOne,AfterInsert } from 'typeorm';
import { Venta } from './venta.entity';
import * as crypto from 'crypto';

@Entity('Entrada')
export class Entrada extends BaseEntity {
   @PrimaryGeneratedColumn()
    id: number;

  @Column()
  codigoSeguridad: string;
  @Column({ type: 'int', nullable: false })
  disponibilidadButacaId: number;
  @Column({ type: 'int', nullable: false })
  @ManyToOne(() => Venta, venta => venta.entradas, {
    nullable: true,         //  puede existir sin venta
    onDelete: "SET NULL",   //  si elimino la venta, la entrada queda huérfana
  })
  venta: Venta;
   // Generar código de seguridad después de insertar para incluir el id
  @AfterInsert()
  async generarCodigoSeguridad() {
    // Datos para el hash: id + disponibilidadButaca + timestamp actual
    const data = `${this.id}-${this.disponibilidadButacaId}-${new Date().toISOString()}`;
    this.codigoSeguridad = crypto.createHash('sha256').update(data).digest('hex');
    // Actualizar la entidad con el código generado
    await Entrada.update(this.id, { codigoSeguridad: this.codigoSeguridad });
  
}
}

