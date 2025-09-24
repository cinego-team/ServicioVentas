import axios from 'axios';

export class PromocionService {
  private baseUrl = 'http://api-gateway'; // URL del microservicio

  async validarPromocion(promocionId: number): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseUrl}/${promocionId}`);
      return response.status === 200; // si existe, retorna true
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return false; // no existe la promoción
      }
      throw new Error('Error al consultar el microservicio de promociones');
    }
  }
async obtenerPromocion(promocionId: number): Promise<{ porcentaje: number }> {
  try {
    const response = await axios.get<{ porcentaje: number }>(`${this.baseUrl}/${promocionId}`);
    return response.data; 
  } catch (error) {
    throw new Error('Error al obtener la promoción');
  }
}
}