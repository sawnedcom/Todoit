"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, Filter, ArrowUpDown, Trash2, Edit3, TriangleAlert, Calendar, Check } from "lucide-react";
import Navbar from "../../layout/navbar";
import TaskModal from "../TaskModal";
import DashboardHeader from "../DashboardHeader";

export default function CompletedTasks() {
  const [tasks, setTasks] = useState<{ id: number; title: string; description: string; priority: string; priorityColors: string; category: string; categoryColor: string; completed: boolean; dueDate?: string }[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load tasks from localStorage after mount (avoids hydration mismatch)
  useEffect(() => {
    const saved = localStorage.getItem("todoit-tasks");
    if (saved) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTasks(JSON.parse(saved));
      } catch {
        /* ignore */
      }
    }
    setIsLoaded(true);
  }, []);

  // Save tasks to localStorage whenever they change (skip initial mount)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("todoit-tasks", JSON.stringify(tasks));
    }
  }, [tasks, isLoaded]);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingTaskData, setEditingTaskData] = useState<{ title: string; description: string; priority: string; category: string; dueDate?: string } | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);

  const priorityMap: Record<string, string> = {
    Low: "bg-[#1A263B] text-[#5586E8] border-[#22334E]",
    Medium: "bg-[#36301A] text-[#F3A530] border-[#484022]",
    High: "bg-[#362121] text-[#EF5C5D] border-[#482828]",
  };

  const categoryMap: Record<string, string> = {
    Work: "bg-blue-400",
    Personal: "bg-purple-400",
    Health: "bg-pink-400",
    Shopping: "bg-green-400",
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  const confirmDeleteTask = (id: number) => {
    setTaskToDelete(id);
  };

  const executeDeleteTask = () => {
    if (taskToDelete !== null) {
      setTasks(tasks.filter((task) => task.id !== taskToDelete));
      setTaskToDelete(null);
    }
  };

  const cancelDeleteTask = () => {
    setTaskToDelete(null);
  };

  const filteredTasks = tasks.filter((task) => task.completed && (task.title.toLowerCase().includes(searchQuery.toLowerCase()) || task.description.toLowerCase().includes(searchQuery.toLowerCase())));

  const handleSaveTask = (taskData: { title: string; description: string; priority: string; category: string; dueDate?: string }) => {
    if (editingTaskId !== null) {
      setTasks(
        tasks.map((task) =>
          task.id === editingTaskId
            ? {
                ...task,
                ...taskData,
                priorityColors: priorityMap[taskData.priority],
                categoryColor: categoryMap[taskData.category],
              }
            : task
        )
      );
    } else {
      const newTask = {
        id: Date.now(),
        ...taskData,
        priorityColors: priorityMap[taskData.priority],
        categoryColor: categoryMap[taskData.category],
        completed: false,
      };
      setTasks([...tasks, newTask]);
    }

    setEditingTaskId(null);
    setEditingTaskData(null);
    setShowModal(false);
  };

  const openModal = () => {
    setEditingTaskId(null);
    setEditingTaskData(null);
    setShowModal(true);
  };

  const openEditModal = (task: { id: number; title: string; description: string; priority: string; category: string; dueDate?: string }) => {
    setEditingTaskId(task.id);
    setEditingTaskData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      category: task.category,
      dueDate: task.dueDate || "",
    });
    setShowModal(true);
  };

  return (
    <div className="flex h-screen bg-[#14161B] text-white font-sans overflow-hidden">
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-275 mx-auto px-6 py-8 pt-20 md:p-10 lg:p-12">
          {/* Header & Stats & Tasks */}
          <DashboardHeader title="Completed Tasks" subtitle={<>Keep up the great work! You have {tasks.filter((t) => t.completed).length} completed tasks.</>} tasks={tasks} searchQuery={searchQuery} setSearchQuery={setSearchQuery} onOpenModal={openModal}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Finished Tasks</h3>
              <div className="flex items-center gap-3 text-gray-400">
                <button className="hover:text-white transition-colors">
                  <Filter size={20} />
                </button>
                <button className="hover:text-white transition-colors">
                  <ArrowUpDown size={20} />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {filteredTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                  <CheckCircle2 size={48} className="mb-4 text-gray-600" />
                  <p className="text-lg font-medium">{tasks.length === 0 ? "No task confirmed" : "No matching tasks found"}</p>
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <div key={task.id} className={task.completed ? "bg-[#181A20] border border-[#242730] rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 opacity-75 group" : "bg-[#20232A] hover:bg-[#252830] transition-colors border border-[#2B2E36] rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 group"}>
                    <div className="flex items-start gap-4 w-full sm:w-auto">
                      <div className="shrink-0 flex items-center justify-center m-1">
                        <div onClick={() => toggleTask(task.id)} className={`w-5 h-5 cursor-pointer rounded border-2 flex items-center justify-center transition-all ${task.completed ? "bg-[#1C7AEC] border-[#1C7AEC]" : "bg-transparent border-[#4B5563] hover:border-[#6B7280]"}`}>
                          {task.completed && <Check size={14} className="text-white" strokeWidth={3} />}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-semibold truncate ${task.completed ? "text-gray-500 line-through" : "text-gray-100"}`}>{task.title}</h4>
                        <p className={`text-sm mt-0.5 line-clamp-1 ${task.completed ? "text-gray-600" : "text-gray-400"}`}>{task.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto sm:ml-auto">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-md border whitespace-nowrap ${task.completed ? "bg-[#1C3A2E] text-[#32C581] border-[#254E3E]" : task.priorityColors}`}>{task.completed ? "Done" : task.priority}</span>
                      <span className={`px-2.5 py-1 text-xs font-medium bg-[#2B2E36] rounded-md flex items-center gap-1.5 border border-[#353841] whitespace-nowrap ${task.completed ? "text-gray-400" : "text-gray-300"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${task.categoryColor} ${task.completed ? "opacity-60" : ""}`}></span>
                        {task.category}
                      </span>
                      {task.dueDate && (
                        <span className={`px-2.5 py-1 text-xs font-medium bg-[#2B2E36] rounded-md flex items-center gap-1.5 border border-[#353841] whitespace-nowrap ${task.completed ? "text-gray-500" : "text-gray-300"}`}>
                          <Calendar size={12} />
                          {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      )}
                      <div className="flex items-center gap-2 ml-auto sm:ml-2">
                        <button onClick={() => openEditModal(task)} className="text-gray-500 hover:text-blue-500 transition-colors p-1 focus:outline-none" title="Edit task">
                          <Edit3 size={18} />
                        </button>
                        <button onClick={() => confirmDeleteTask(task.id)} className="text-gray-500 hover:text-red-500 transition-colors p-1 focus:outline-none" title="Delete task">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </DashboardHeader>
        </div>
      </main>

      {/* Create New Task Modal */}
      <TaskModal isOpen={showModal} onClose={() => setShowModal(false)} onSave={handleSaveTask} editingTask={editingTaskData} defaultCategory="Work" />

      {/* Delete Confirmation Modal */}
      {taskToDelete !== null && (
        <div className="fixed inset-0 z-60 flex items-center justify-center animate-[fadeIn_0.15s_ease-out]">
          <div className="absolute inset-0 bg-black/50" onClick={cancelDeleteTask} />
          <div className="relative bg-[#1A1D24] border border-[#2B2E36] rounded-2xl w-[calc(100%-2rem)] max-w-sm shadow-2xl p-6 animate-[scaleIn_0.2s_ease-out]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-3">
              <TriangleAlert size={24} className="text-red-400" />
              <h3 className="text-lg font-bold">Delete task?</h3>
            </div>
            <p className="text-sm text-gray-400 mb-6">Are you sure you want to delete this task? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={cancelDeleteTask} className="flex-1 bg-[#252830] hover:bg-[#2E313A] border border-[#3A3D46] text-white py-2.5 rounded-lg font-medium text-sm transition-colors">
                Cancel
              </button>
              <button onClick={executeDeleteTask} className="flex-1 bg-[#E8365D] hover:bg-[#D42E52] text-white py-2.5 rounded-lg font-medium text-sm transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
