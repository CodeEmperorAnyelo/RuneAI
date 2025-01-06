import api from '@/utils/axios';

// Interfaz para los datos de un agente
export interface Agent {
  id: string;
  name: string;
  objective: string;
  status: 'idle' | 'active' | 'paused' | 'completed';
  currentTask?: string;
  progress: number;
  activeTools: string[];
}

// Interfaz para las respuestas de la API
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Servicio para interactuar con las APIs de agentes
export const agentService = {
  // Obtener todos los agentes
  getAgents: async (): Promise<Agent[]> => {
    const response = await api.get<ApiResponse<Agent[]>>('/agents');
    return response.data.data; // Ajusta según el formato de tu backend
  },

  // Crear un nuevo agente
  createAgent: async (data: Partial<Agent>): Promise<Agent> => {
    const response = await api.post<ApiResponse<Agent>>('/agents', data);
    return response.data.data;
  },

  // Actualizar un agente existente
  updateAgent: async (id: string, data: Partial<Agent>): Promise<Agent> => {
    const response = await api.put<ApiResponse<Agent>>(`/agents/${id}`, data);
    return response.data.data;
  },

  // Eliminar un agente
  deleteAgent: async (id: string): Promise<void> => {
    await api.delete(`/agents/${id}`);
  },
};
