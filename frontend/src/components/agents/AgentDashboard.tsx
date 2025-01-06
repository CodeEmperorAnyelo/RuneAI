import { useState, useEffect } from 'react';
import { Agent, agentService } from '@/services/agentService';
import { handleApiError } from '@/utils/error';
import { toast } from 'sonner';
import {
  PlusCircle,
  Brain,
  WrenchIcon,
  ActivitySquare,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { create } from 'zustand';

interface AgentStore {
  agents: Agent[];
  loading: boolean;
  fetchAgents: () => Promise<void>;
  createAgent: (data: Partial<Agent>) => Promise<void>;
}

export const useAgentStore = create<AgentStore>((set) => ({
  agents: [],
  loading: false,
  fetchAgents: async () => {
    set({ loading: true });
    try {
      const response = await agentService.getAgents();
      set({ agents: response });
    } catch (error) {
      toast.error('Error fetching agents');
    } finally {
      set({ loading: false });
    }
  },
  createAgent: async (data) => {
    try {
      const response = await agentService.createAgent(data);
      set((state) => ({ agents: [...state.agents, response] }));
      toast.success('Agent created successfully');
    } catch (error) {
      toast.error('Error creating agent');
    }
  },
}));

export function AgentDashboard() {
  const { agents, loading, fetchAgents, createAgent } = useAgentStore();
  const [showNewAgentForm, setShowNewAgentForm] = useState(false);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const handleCreateAgent = async (agentData: Partial<Agent>) => {
    await createAgent(agentData);
  };

  const AgentCard = ({ agent }: { agent: Agent }) => (
    <Card className="w-full bg-gradient-to-r from-slate-900 to-slate-800 text-white border-slate-700 hover:border-blue-500 transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">{agent.name}</CardTitle>
          <div className="flex items-center space-x-2">
            <ActivitySquare className="w-4 h-4 text-green-400 animate-pulse" />
            <span className="text-sm text-green-400">Active</span>
          </div>
        </div>
        <CardDescription className="text-slate-400">
          {agent.objective}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-blue-400" />
            <div className="text-sm">
              Current Task: {agent.currentTask || 'Idle'}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <WrenchIcon className="w-5 h-5 text-purple-400" />
            <div className="text-sm">
              Active Tools: {agent.activeTools?.join(', ') || 'None'}
            </div>
          </div>
          <div className="mt-4 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full animate-pulse"
              style={{ width: `${agent.progress || 0}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const NewAgentForm = () => (
    <Card className="w-full bg-slate-900 text-white border-slate-700">
      <CardHeader>
        <CardTitle>Create New Agent</CardTitle>
        <CardDescription className="text-slate-400">
          Define your agent's objective and capabilities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleCreateAgent({
              name: formData.get('name') as string,
              objective: formData.get('objective') as string,
              activeTools: Array.from(formData.getAll('tools')) as string[],
              status: 'idle',
              progress: 0,
            });
          }}
        >
          <div>
            <label className="block text-sm font-medium mb-1">Agent Name</label>
            <input
              name="name"
              type="text"
              className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md"
              placeholder="Enter agent name..."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Objective</label>
            <textarea
              name="objective"
              className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md"
              placeholder="Define the agent's primary objective..."
              rows={4}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Available Tools</label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <input type="checkbox" name="tools" value="web_search" />
                <span>Web Search</span>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" name="tools" value="data_analysis" />
                <span>Data Analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" name="tools" value="code_generation" />
                <span>Code Generation</span>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" name="tools" value="text_processing" />
                <span>Text Processing</span>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            Create Agent
          </button>
        </form>
      </CardContent>
    </Card>
  );

  if (loading) {
    return <div className="text-white">Loading agents...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">AI Agent Dashboard</h1>
          <button
            onClick={() => setShowNewAgentForm(!showNewAgentForm)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
            <span>New Agent</span>
          </button>
        </div>

        {showNewAgentForm && <NewAgentForm />}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>

        {agents.length === 0 && !showNewAgentForm && (
          <Alert className="bg-slate-900 border-slate-700 text-white">
            <AlertTitle>No agents created yet</AlertTitle>
            <AlertDescription>
              Click the "New Agent" button to create your first AI agent.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
