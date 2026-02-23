import React, { useState } from "react";
import { Briefcase, User, Heart, ShoppingCart, Check, X, TriangleAlert } from "lucide-react";

type TaskData = {
  title: string;
  description: string;
  priority: string;
  category: string;
  dueDate?: string;
};

type TaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: TaskData) => void;
  editingTask?: TaskData | null;
  defaultCategory?: string;
};

export default function TaskModal({ isOpen, onClose, onSave, editingTask, defaultCategory = "Work" }: TaskModalProps) {
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriority, setNewPriority] = useState("Low");
  const [newCategory, setNewCategory] = useState(defaultCategory);
  const [newDueDate, setNewDueDate] = useState("");
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  const [prevEditingTask, setPrevEditingTask] = useState(editingTask);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  // Sync state when modal opens/closes or when editingTask changes without using useEffect
  if (editingTask !== prevEditingTask || isOpen !== prevIsOpen) {
    setPrevEditingTask(editingTask);
    setPrevIsOpen(isOpen);
    if (isOpen) {
      if (editingTask) {
        setNewTitle(editingTask.title);
        setNewDescription(editingTask.description);
        setNewPriority(editingTask.priority === "Medium" ? "Med" : editingTask.priority);
        setNewCategory(editingTask.category);
        setNewDueDate(editingTask.dueDate || "");
      } else {
        setNewTitle("");
        setNewDescription("");
        setNewPriority("Low");
        setNewCategory(defaultCategory);
        setNewDueDate("");
      }
      setShowDiscardConfirm(false);
    }
  }

  if (!isOpen) return null;

  const hasUnsavedChanges = () => {
    return newTitle.trim() !== "" || newDescription.trim() !== "" || newDueDate !== "";
  };

  const handleClose = () => {
    // If not editing and user has typed something, show discard confirm
    if (!editingTask && hasUnsavedChanges()) {
      setShowDiscardConfirm(true);
    } else {
      onClose();
    }
  };

  const forceClose = () => {
    setShowDiscardConfirm(false);
    onClose();
  };

  const handleSave = () => {
    if (!newTitle.trim()) return;
    onSave({
      title: newTitle.trim(),
      description: newDescription.trim(),
      priority: newPriority === "Med" ? "Medium" : newPriority,
      category: newCategory,
      dueDate: newDueDate || undefined,
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center animate-[fadeIn_0.2s_ease-out]" onClick={handleClose}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="relative bg-[#1A1D24] border border-[#2B2E36] rounded-2xl w-[calc(100%-2rem)] max-w-xl shadow-2xl animate-[scaleIn_0.25s_ease-out] max-h-[90vh] overflow-y-auto overflow-x-hidden" onClick={(e) => e.stopPropagation()}>
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes scaleIn {
              from { opacity: 0; transform: scale(0.9) translateY(20px); }
              to { opacity: 1; transform: scale(1) translateY(0); }
            }
          `}</style>
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 pb-4">
            <div className="flex items-center gap-2">
              <Check size={20} className="text-blue-400" />
              <h2 className="text-lg font-bold">{editingTask ? "Edit Task" : "Create New Task"}</h2>
            </div>
            <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors">
              <X size={22} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="px-6 pb-6 space-y-5">
            {/* Task Title */}
            <div>
              <label className="text-sm font-semibold mb-2 block">
                Task Title <span className="text-red-400">*</span>
              </label>
              <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g., Design system review" className="w-full bg-[#252830] border border-[#3A3D46] text-sm text-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-500" />
              <p className="text-xs text-gray-500 mt-1.5">Title is required to create a task.</p>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-semibold mb-2 block">Description (Optional)</label>
              <textarea value={newDescription} onChange={(e) => setNewDescription(e.target.value)} placeholder="Add more details about this task..." rows={3} className="w-full bg-[#252830] border border-[#3A3D46] text-sm text-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-500 resize-none" />
            </div>

            {/* Priority & Due Date */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <div className="flex-1">
                <label className="text-sm font-semibold mb-2 block">Priority</label>
                <div className="flex gap-2">
                  {["Low", "Med", "High"].map((p) => (
                    <button key={p} onClick={() => setNewPriority(p)} className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${newPriority === p ? "bg-[#1C3A5E] border-blue-500 text-blue-400" : "bg-[#252830] border-[#3A3D46] text-gray-400 hover:border-gray-500"}`}>
                      <span className={`w-2 h-2 rounded-full ${p === "Low" ? "bg-blue-400" : p === "Med" ? "bg-yellow-400" : "bg-red-400"}`}></span>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Due Date</label>
                <input type="date" value={newDueDate} onChange={(e) => setNewDueDate(e.target.value)} className="bg-[#252830] border border-[#3A3D46] text-sm text-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors w-full sm:w-44" />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="text-sm font-semibold mb-2 block">Category</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { name: "Work", icon: <Briefcase size={20} /> },
                  { name: "Personal", icon: <User size={20} /> },
                  { name: "Health", icon: <Heart size={20} /> },
                  { name: "Shopping", icon: <ShoppingCart size={20} /> },
                ].map((cat) => (
                  <button key={cat.name} onClick={() => setNewCategory(cat.name)} className={`flex flex-col items-center gap-2 py-4 rounded-xl text-xs font-semibold uppercase tracking-wide transition-colors border ${newCategory === cat.name ? "bg-[#1C3A5E] border-blue-500 text-blue-400" : "bg-[#252830] border-[#3A3D46] text-gray-400 hover:border-gray-500"}`}>
                    {cat.icon}
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 px-6 pb-6">
            <button onClick={handleClose} className="px-5 py-2.5 text-sm font-medium text-gray-400 hover:text-white transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} disabled={!newTitle.trim()} className="flex items-center gap-2 bg-[#1C7AEC] hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-lg shadow-blue-500/20">
              <Check size={18} />
              {editingTask ? "Save Changes" : "Add Task"}
            </button>
          </div>
        </div>
      </div>

      {/* Discard Changes Confirmation */}
      {showDiscardConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center animate-[fadeIn_0.15s_ease-out]">
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative bg-[#1A1D24] border border-[#2B2E36] rounded-2xl w-[calc(100%-2rem)] max-w-sm shadow-2xl p-6 animate-[scaleIn_0.2s_ease-out]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-3">
              <TriangleAlert size={24} className="text-amber-400" />
              <h3 className="text-lg font-bold">Discard changes?</h3>
            </div>
            <p className="text-sm text-gray-400 mb-6">You have unsaved changes. Are you sure you want to leave?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDiscardConfirm(false)} className="flex-1 bg-[#252830] hover:bg-[#2E313A] border border-[#3A3D46] text-white py-2.5 rounded-lg font-medium text-sm transition-colors">
                Keep Editing
              </button>
              <button onClick={forceClose} className="flex-1 bg-[#E8365D] hover:bg-[#D42E52] text-white py-2.5 rounded-lg font-medium text-sm transition-colors">
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
