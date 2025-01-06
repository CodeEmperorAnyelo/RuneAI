// components/layout/DashboardHeader.tsx
import { Bell, Settings, User } from 'lucide-react';

export function DashboardHeader() {
  return (
    <header className="bg-slate-900 border-b border-slate-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">RuneAI</h1>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-slate-400 hover:text-white">
            <Bell size={20} />
          </button>
          <button className="p-2 text-slate-400 hover:text-white">
            <Settings size={20} />
          </button>
          <button className="p-2 text-slate-400 hover:text-white">
            <User size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}