"use client";
import React, { useState } from 'react';
import { 
  PlusCircle, 
  Brain, 
  WrenchIcon, 
  ActivitySquare, 
  CreditCard 
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import DashboardPage from '@/components/pages/DashboardPage';

const AgentDashboard = () => {
  const [agents, setAgents] = useState([]);
  const [showNewAgentForm, setShowNewAgentForm] = useState(false);

  const AgentCard = ({ agent }) => (
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
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Agent Name</label>
            <input 
              type="text"
              className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md"
              placeholder="Enter agent name..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Objective</label>
            <textarea
              className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md"
              placeholder="Define the agent's primary objective..."
              rows={4}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Available Tools</label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <input type="checkbox" />
                <span>Web Search</span>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" />
                <span>Data Analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" />
                <span>Code Generation</span>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" />
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
          {agents.map((agent, index) => (
            <AgentCard key={index} agent={agent} />
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
};

export default AgentDashboard;
