import axios from 'axios';
export class DisponibilidadButacaService{
  private baseUrl = 'http://api-gateway'; // URL del microservicio

  async validarDisponibilidad(disponibilidaButacaId: number): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseUrl}/${disponibilidaButacaId}`);
      return response.status === 200; // si existe, retorna true
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return false; 
      }
      throw new Error('Error al consultar el microservicio de disponibilidad de butacas');
    }
  }
}