import React from "react";
import { Search, Plus, TrendingUp, AlertCircle, Check } from "lucide-react";

type Task = {
  id: number;
  title: string;
  description: string;
  priority: string;
  priorityColors: string;
  category: string;
  categoryColor: string;
  completed: boolean;
  dueDate?: string;
};

interface DashboardHeaderProps {
  title: string;
  subtitle: React.ReactNode;
  tasks: Task[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenModal: () => void;
  children?: React.ReactNode;
}

export default function DashboardHeader({ title, subtitle, tasks, searchQuery, setSearchQuery, onOpenModal, children }: DashboardHeaderProps) {
  const completedTasksCount = tasks.filter((t) => t.completed).length;
  const totalTasksCount = tasks.length;
  const completionPercentage = totalTasksCount === 0 ? 0 : Math.round((completedTasksCount / totalTasksCount) * 100);

  const highPriorityPendingCount = tasks.filter((t) => t.priority === "High" && !t.completed).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-y-10">
      {/* ── Header: Title & Actions ── */}
      <header className="md:col-span-4 flex flex-col md:flex-row md:items-center justify-between gap-6 order-1">
        <div>
          <h2 className="text-3xl font-bold mb-1">{title}</h2>
          <p className="text-gray-400 text-sm">{subtitle}</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search tasks..." className="w-full bg-[#1C1F26] border border-[#242730] text-sm text-gray-200 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-500" />
          </div>
          <button onClick={onOpenModal} className="w-full sm:w-auto bg-[#1C7AEC] hover:bg-blue-600 text-white flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-lg shadow-blue-500/20">
            <Plus size={18} />
            Add New Task
          </button>
        </div>
      </header>

      {/* ── Daily Goals Card ── */}
      <div className="md:col-span-2 bg-linear-to-br from-[#1A2133] to-[#151923] p-6 rounded-2xl border border-[#222E46] relative overflow-hidden order-2">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-1">Daily Goals Progress</h3>
            <p className="text-sm text-gray-400">Keep it up! You&apos;re making great progress.</p>
          </div>
          <div className="bg-[#243553] p-2 rounded-lg">
            <TrendingUp size={20} className="text-blue-400" />
          </div>
        </div>

        <div className="mt-8">
          <div className="flex justify-between text-sm mb-2 font-medium">
            <span>
              {completedTasksCount} of {totalTasksCount} tasks completed
            </span>
            <span className="text-blue-400">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-[#242B38] rounded-full h-2.5 overflow-hidden">
            <div className="bg-blue-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${completionPercentage}%` }}></div>
          </div>
        </div>
      </div>

      {/* ── Small Stats Container (High Priority & Done) ── */}
      {/* On mobile: columns-2, order-4 (at bottom). On desktop: part of main grid, order-3 */}
      <div className="grid grid-cols-2 md:grid-cols-2 md:col-span-2 md:gap-6 gap-4 order-4 md:order-3">
        {/* High Priority Card */}
        <div className="bg-[#1C1F26] p-4 sm:p-6 rounded-2xl border border-[#242730] flex flex-col justify-between items-center text-center">
          <div className="bg-[#3A2A22] w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="text-[#E76C3E]" size={20} />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold mb-1">{highPriorityPendingCount}</h3>
          <p className="text-[10px] sm:text-sm text-gray-400 leading-tight">
            High
            <br />
            Priority
          </p>
        </div>

        {/* Done this week Card */}
        <div className="bg-[#1C1F26] p-4 sm:p-6 rounded-2xl border border-[#242730] flex flex-col justify-between items-center text-center">
          <div className="bg-[#1C3A2E] w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-4">
            <Check className="text-[#32C581]" size={20} />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold mb-1">{completedTasksCount}</h3>
          <p className="text-[10px] sm:text-sm text-gray-400 leading-tight">
            Done this
            <br />
            week
          </p>
        </div>
      </div>

      {/* ── Today's Tasks Section (Children) ── */}
      {/* On mobile: order-3 (middle). On desktop: order-5 (bottom, col-span-4) */}
      <div className="md:col-span-4 order-3 md:order-5">{children}</div>
    </div>
  );
}
