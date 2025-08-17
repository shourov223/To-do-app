"use client"
import { useState } from "react"
import { Plus, X, Check, Edit2, Save, Calendar, Filter } from "lucide-react"

const TodoApp = () => {
    const [inputValue, setInputValue] = useState("")
    const [tasks, setTasks] = useState([])
    const [filter, setFilter] = useState("all") // all, active, completed
    const [editingId, setEditingId] = useState(null)
    const [editValue, setEditValue] = useState("")

    const handleInputChange = (e) => {
        setInputValue(e.target.value)
    }

    const addTask = () => {
        const trimmedValue = inputValue.trim()
        if (!trimmedValue) {
            alert("Please enter a task!")
            return
        }
        
        if (tasks.some(task => task.text.toLowerCase() === trimmedValue.toLowerCase())) {
            alert("This task already exists!")
            return
        }

        const newTask = {
            id: Date.now(),
            text: trimmedValue,
            completed: false,
            createdAt: new Date().toLocaleDateString()
        }

        setTasks([...tasks, newTask])
        setInputValue("")
    }

    const removeTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id))
    }

    const toggleComplete = (id) => {
        setTasks(tasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
        ))
    }

    const startEdit = (id, text) => {
        setEditingId(id)
        setEditValue(text)
    }

    const saveEdit = () => {
        const trimmedValue = editValue.trim()
        if (!trimmedValue) {
            alert("Task cannot be empty!")
            return
        }

        setTasks(tasks.map(task => 
            task.id === editingId ? { ...task, text: trimmedValue } : task
        ))
        setEditingId(null)
        setEditValue("")
    }

    const cancelEdit = () => {
        setEditingId(null)
        setEditValue("")
    }

    const clearCompleted = () => {
        setTasks(tasks.filter(task => !task.completed))
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            addTask()
        }
    }

    const handleEditKeyPress = (e) => {
        if (e.key === 'Enter') {
            saveEdit()
        } else if (e.key === 'Escape') {
            cancelEdit()
        }
    }

    const filteredTasks = tasks.filter(task => {
        if (filter === "active") return !task.completed
        if (filter === "completed") return task.completed
        return true
    })

    const completedCount = tasks.filter(task => task.completed).length
    const activeCount = tasks.length - completedCount

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-3 sm:p-4 md:p-6 lg:p-8">
            <div className="max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto">
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 sm:p-6 md:p-8 text-white">
                        <div className="text-center">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                                ✨ Todo Master
                            </h1>
                            <p className="text-purple-100 text-sm sm:text-base opacity-90">
                                Stay organized, stay productive
                            </p>
                        </div>
                    </div>

                    <div className="p-4 sm:p-6 md:p-8">
                        {/* Input Section */}
                        <div className="mb-4 sm:mb-6">
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                <input
                                    value={inputValue}
                                    onChange={handleInputChange}
                                    onKeyPress={handleKeyPress}
                                    className="flex-1 px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:border-purple-500 focus:outline-none transition-all duration-200 placeholder-gray-400 text-sm sm:text-base shadow-sm"
                                    type="text"
                                    placeholder="What needs to be done?"
                                    maxLength={100}
                                />
                                <button
                                    onClick={addTask}
                                    className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl sm:rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium text-sm sm:text-base min-w-[44px] flex items-center justify-center"
                                >
                                    <Plus size={18} className="sm:hidden" />
                                    <span className="hidden sm:inline">Add Task</span>
                                    <Plus size={20} className="hidden sm:inline ml-2" />
                                </button>
                            </div>
                        </div>

                        {/* Stats */}
                        {tasks.length > 0 && (
                            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl sm:rounded-2xl border border-purple-100">
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div className="p-2">
                                        <div className="text-lg sm:text-xl font-bold text-purple-600">{tasks.length}</div>
                                        <div className="text-xs sm:text-sm text-gray-600">Total</div>
                                    </div>
                                    <div className="p-2 border-x border-purple-200">
                                        <div className="text-lg sm:text-xl font-bold text-orange-600">{activeCount}</div>
                                        <div className="text-xs sm:text-sm text-gray-600">Active</div>
                                    </div>
                                    <div className="p-2">
                                        <div className="text-lg sm:text-xl font-bold text-green-600">{completedCount}</div>
                                        <div className="text-xs sm:text-sm text-gray-600">Done</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Filter Buttons */}
                        {tasks.length > 0 && (
                            <div className="grid grid-cols-3 gap-1 sm:gap-2 mb-4 sm:mb-6">
                                {[
                                    { key: "all", label: "All", icon: "📋" },
                                    { key: "active", label: "Active", icon: "⚡" },
                                    { key: "completed", label: "Done", icon: "✅" }
                                ].map(filterType => (
                                    <button
                                        key={filterType.key}
                                        onClick={() => setFilter(filterType.key)}
                                        className={`px-2 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                                            filter === filterType.key
                                                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                                                : "bg-gray-100 text-gray-600 hover:bg-gray-200 shadow-sm"
                                        }`}
                                    >
                                        <div className="hidden sm:block">{filterType.icon}</div>
                                        <div className="mt-1 sm:mt-0">{filterType.label}</div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Task List */}
                        <div className="space-y-2 sm:space-y-3 max-h-64 sm:max-h-96 md:max-h-[32rem] overflow-y-auto">
                            {filteredTasks.length === 0 ? (
                                <div className="text-center py-8 sm:py-12 text-gray-400">
                                    <div className="text-4xl sm:text-6xl mb-4">📝</div>
                                    <p className="text-sm sm:text-base px-4">
                                        {tasks.length === 0 
                                            ? "No tasks yet. Add one above!" 
                                            : `No ${filter} tasks`
                                        }
                                    </p>
                                </div>
                            ) : (
                                filteredTasks.map((task, index) => (
                                    <div
                                        key={task.id}
                                        className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 transform hover:scale-[1.02] ${
                                            task.completed
                                                ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-sm"
                                                : "bg-white border-gray-200 hover:border-purple-300 shadow-md hover:shadow-lg"
                                        } animate-in fade-in slide-in-from-bottom-2`}
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <div className="flex items-start sm:items-center gap-2 sm:gap-3">
                                            {/* Complete Button */}
                                            <button
                                                onClick={() => toggleComplete(task.id)}
                                                className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 transform hover:scale-110 flex-shrink-0 mt-1 sm:mt-0 ${
                                                    task.completed
                                                        ? "bg-gradient-to-r from-green-500 to-emerald-500 border-green-500 text-white shadow-lg"
                                                        : "border-gray-300 hover:border-purple-500 bg-white shadow-sm"
                                                }`}
                                            >
                                                {task.completed && <Check size={12} className="sm:hidden" />}
                                                {task.completed && <Check size={14} className="hidden sm:block" />}
                                            </button>

                                            {/* Task Content */}
                                            <div className="flex-1 min-w-0">
                                                {editingId === task.id ? (
                                                    <input
                                                        value={editValue}
                                                        onChange={(e) => setEditValue(e.target.value)}
                                                        onKeyPress={handleEditKeyPress}
                                                        className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:border-purple-500 text-sm sm:text-base"
                                                        autoFocus
                                                    />
                                                ) : (
                                                    <div>
                                                        <p className={`font-medium text-sm sm:text-base break-words ${
                                                            task.completed 
                                                                ? "line-through text-gray-500" 
                                                                : "text-gray-800"
                                                        }`}>
                                                            {task.text}
                                                        </p>
                                                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                                                            <Calendar size={10} className="sm:hidden" />
                                                            <Calendar size={12} className="hidden sm:block" />
                                                            {task.createdAt}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-1 flex-shrink-0">
                                                {editingId === task.id ? (
                                                    <>
                                                        <button
                                                            onClick={saveEdit}
                                                            className="p-1.5 sm:p-2 text-green-600 hover:bg-green-100 rounded-lg transition-all duration-200 transform hover:scale-110"
                                                        >
                                                            <Save size={14} className="sm:hidden" />
                                                            <Save size={16} className="hidden sm:block" />
                                                        </button>
                                                        <button
                                                            onClick={cancelEdit}
                                                            className="p-1.5 sm:p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 transform hover:scale-110"
                                                        >
                                                            <X size={14} className="sm:hidden" />
                                                            <X size={16} className="hidden sm:block" />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => startEdit(task.id, task.text)}
                                                            className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200 transform hover:scale-110"
                                                        >
                                                            <Edit2 size={14} className="sm:hidden" />
                                                            <Edit2 size={16} className="hidden sm:block" />
                                                        </button>
                                                        <button
                                                            onClick={() => removeTask(task.id)}
                                                            className="p-1.5 sm:p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200 transform hover:scale-110"
                                                        >
                                                            <X size={14} className="sm:hidden" />
                                                            <X size={16} className="hidden sm:block" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Clear Completed Button */}
                        {completedCount > 0 && (
                            <div className="mt-4 sm:mt-6 pt-4 border-t border-gray-200">
                                <button
                                    onClick={clearCompleted}
                                    className="w-full py-3 sm:py-4 text-red-600 hover:bg-red-50 rounded-xl sm:rounded-2xl transition-all duration-200 font-medium text-sm sm:text-base border border-red-200 hover:border-red-300 transform hover:scale-[1.02]"
                                >
                                    🗑️ Clear {completedCount} completed task{completedCount !== 1 ? 's' : ''}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TodoApp