import { create } from 'zustand';
import { Agent, agentService } from '@/services/agentService';
import { toast } from 'sonner';

interface AgentStore {
  agents: Agent[];
  loading: boolean;
  loadAgents: () => Promise<void>;
  addAgent: (data: Partial<Agent>) => Promise<void>;
  modifyAgent: (id: string, data: Partial<Agent>) => Promise<void>;
  removeAgent: (id: string) => Promise<void>;
}

export const useAgentStore = create<AgentStore>((set) => ({
  agents: [],
  loading: false,

  loadAgents: async () => {
    set({ loading: true });
    try {
      const agents = await agentService.getAgents();
      set({ agents });
    } catch (error) {
      toast.error('Failed to load agents');
    } finally {
      set({ loading: false });
    }
  },

  // Add a new agent
  addAgent: async (data) => {
    try {
      const response = await agentService.createAgent(data);
      set((state) => ({ agents: [...state.agents, response.data] }));
      toast.success('Agent created successfully');
    } catch (error) {
      toast.error('Failed to create agent');
    }
  },

  // Update an existing agent
  modifyAgent: async (id, data) => {
    try {
      const response = await agentService.updateAgent(id, data);
      set((state) => ({
        agents: state.agents.map((agent) =>
          agent.id === id ? response.data : agent
        ),
      }));
      toast.success('Agent updated successfully');
    } catch (error) {
      toast.error('Failed to update agent');
    }
  },

  // Remove an agent
  removeAgent: async (id) => {
    try {
      await agentService.deleteAgent(id);
      set((state) => ({
        agents: state.agents.filter((agent) => agent.id !== id),
      }));
      toast.success('Agent deleted successfully');
    } catch (error) {
      toast.error('Failed to delete agent');
    }
  },
}));
