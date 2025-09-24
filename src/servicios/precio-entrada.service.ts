import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PrecioEntrada {
  private readonly gatewayUrl = 'http://api-gateway';

  /**
   * Obtiene el precio de una entrada por su ID desde el microservicio
   */
  async obtenerPrecioEntrada(entradaId: number): Promise<number> {
    try {
      const response = await axios.get<{ precio: number }>(`${this.gatewayUrl}/entradas/${entradaId}/precio`);
      return response.data.precio;
    } catch (error) {
      console.error(`Error obteniendo precio para entrada ${entradaId}:`, error);
      throw new Error('No se pudo obtener el precio de la entrada');
    }
  }
}