// components/pages/DashboardPage.tsx
import { AgentDashboard } from '@/components/agents/AgentDashboard';
import { DashboardHeader } from '@/components/layout/DashboardHeader';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <AgentDashboard />
      </main>
    </div>
  );
}